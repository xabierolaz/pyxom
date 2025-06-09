// Mobile Gesture Support for PyXom Code Editor
// Implements critical order 10: Touch gestures for code editor

import React, { useRef, useEffect } from 'react';

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface GestureConfig {
  doubleTapThreshold: number;
  longPressThreshold: number;
  swipeThreshold: number;
  pinchThreshold: number;
  velocityThreshold: number;
}

interface GestureCallbacks {
  onDoubleTap?: (x: number, y: number) => void;
  onLongPress?: (x: number, y: number) => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinchZoom?: (scale: number, centerX: number, centerY: number) => void;
  onTwoFingerTap?: (x: number, y: number) => void;
  onThreeFingerTap?: () => void;
}

class MobileGestureHandler {
  private element: HTMLElement;
  private config: GestureConfig;
  private callbacks: GestureCallbacks;
  
  private touches: Map<number, TouchPoint> = new Map();
  private lastTap: TouchPoint | null = null;
  private longPressTimer: NodeJS.Timeout | null = null;
  private isLongPress = false;
  private initialPinchDistance = 0;
  private lastPinchScale = 1;

  constructor(
    element: HTMLElement,
    callbacks: GestureCallbacks,
    config: Partial<GestureConfig> = {}
  ) {
    this.element = element;
    this.callbacks = callbacks;
    this.config = {
      doubleTapThreshold: 300, // ms
      longPressThreshold: 500, // ms
      swipeThreshold: 50, // pixels
      pinchThreshold: 10, // pixels
      velocityThreshold: 0.5, // pixels/ms
      ...config
    };

    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    // Prevent default touch behaviors that might interfere
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this), { passive: false });

    // Prevent context menu on long press
    this.element.addEventListener('contextmenu', (e) => {
      if (this.isLongPress) {
        e.preventDefault();
      }
    });
  }

  private handleTouchStart(event: TouchEvent): void {
    const touches = Array.from(event.touches);
    
    // Store all current touches
    touches.forEach(touch => {
      this.touches.set(touch.identifier, {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now()
      });
    });

    // Handle single touch start
    if (touches.length === 1) {
      const touch = touches[0];
      this.startLongPressTimer(touch.clientX, touch.clientY);
    }

    // Handle pinch start
    if (touches.length === 2) {
      this.clearLongPressTimer();
      this.initialPinchDistance = this.getTouchDistance(touches[0], touches[1]);
      this.lastPinchScale = 1;
    }

    // Prevent default for multi-touch
    if (touches.length > 1) {
      event.preventDefault();
    }
  }

  private handleTouchMove(event: TouchEvent): void {
    const touches = Array.from(event.touches);
    
    // Clear long press on movement
    if (touches.length === 1) {
      const touch = touches[0];
      const storedTouch = this.touches.get(touch.identifier);
      
      if (storedTouch) {
        const distance = Math.sqrt(
          Math.pow(touch.clientX - storedTouch.x, 2) +
          Math.pow(touch.clientY - storedTouch.y, 2)
        );
        
        if (distance > 10) { // 10px threshold for movement
          this.clearLongPressTimer();
        }
      }
    }

    // Handle pinch zoom
    if (touches.length === 2 && this.callbacks.onPinchZoom) {
      event.preventDefault();
      
      const currentDistance = this.getTouchDistance(touches[0], touches[1]);
      const scale = currentDistance / this.initialPinchDistance;
      
      if (Math.abs(scale - this.lastPinchScale) > 0.1) {
        const centerX = (touches[0].clientX + touches[1].clientX) / 2;
        const centerY = (touches[0].clientY + touches[1].clientY) / 2;
        
        this.callbacks.onPinchZoom(scale, centerX, centerY);
        this.lastPinchScale = scale;
      }
    }

    // Update touch positions
    touches.forEach(touch => {
      if (this.touches.has(touch.identifier)) {
        this.touches.set(touch.identifier, {
          x: touch.clientX,
          y: touch.clientY,
          timestamp: Date.now()
        });
      }
    });
  }

  private handleTouchEnd(event: TouchEvent): void {
    const endedTouches = Array.from(event.changedTouches);
    const remainingTouches = Array.from(event.touches);
    
    this.clearLongPressTimer();

    // Handle single tap/double tap
    if (endedTouches.length === 1 && remainingTouches.length === 0) {
      const touch = endedTouches[0];
      const storedTouch = this.touches.get(touch.identifier);
      
      if (storedTouch) {
        const tapDuration = Date.now() - storedTouch.timestamp;
        
        if (tapDuration < this.config.longPressThreshold) {
          this.handleTap(touch.clientX, touch.clientY);
        }
        
        // Check for swipe
        this.checkSwipe(storedTouch, {
          x: touch.clientX,
          y: touch.clientY,
          timestamp: Date.now()
        });
      }
    }

    // Handle multi-finger taps
    if (endedTouches.length === 2 && remainingTouches.length === 0) {
      this.handleTwoFingerTap(endedTouches);
    }

    if (endedTouches.length === 3 && remainingTouches.length === 0) {
      this.handleThreeFingerTap();
    }

    // Clean up ended touches
    endedTouches.forEach(touch => {
      this.touches.delete(touch.identifier);
    });
  }

  private handleTouchCancel(event: TouchEvent): void {
    this.clearLongPressTimer();
    this.touches.clear();
  }

  private handleTap(x: number, y: number): void {
    const now = Date.now();
    
    if (this.lastTap && 
        now - this.lastTap.timestamp < this.config.doubleTapThreshold &&
        Math.abs(x - this.lastTap.x) < 30 &&
        Math.abs(y - this.lastTap.y) < 30) {
      
      // Double tap detected
      if (this.callbacks.onDoubleTap) {
        this.callbacks.onDoubleTap(x, y);
      }
      this.lastTap = null;
    } else {
      // Single tap
      this.lastTap = { x, y, timestamp: now };
    }
  }

  private handleTwoFingerTap(touches: Touch[]): void {
    if (this.callbacks.onTwoFingerTap) {
      const centerX = (touches[0].clientX + touches[1].clientX) / 2;
      const centerY = (touches[0].clientY + touches[1].clientY) / 2;
      this.callbacks.onTwoFingerTap(centerX, centerY);
    }
  }

  private handleThreeFingerTap(): void {
    if (this.callbacks.onThreeFingerTap) {
      this.callbacks.onThreeFingerTap();
    }
  }

  private startLongPressTimer(x: number, y: number): void {
    this.clearLongPressTimer();
    this.isLongPress = false;
    
    this.longPressTimer = setTimeout(() => {
      this.isLongPress = true;
      if (this.callbacks.onLongPress) {
        this.callbacks.onLongPress(x, y);
      }
    }, this.config.longPressThreshold);
  }

  private clearLongPressTimer(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    this.isLongPress = false;
  }

  private checkSwipe(start: TouchPoint, end: TouchPoint): void {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const deltaTime = end.timestamp - start.timestamp;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;
    
    if (distance < this.config.swipeThreshold || velocity < this.config.velocityThreshold) {
      return; // Not a swipe
    }

    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 0 && this.callbacks.onSwipeRight) {
        this.callbacks.onSwipeRight();
      } else if (deltaX < 0 && this.callbacks.onSwipeLeft) {
        this.callbacks.onSwipeLeft();
      }
    } else {
      // Vertical swipe
      if (deltaY > 0 && this.callbacks.onSwipeDown) {
        this.callbacks.onSwipeDown();
      } else if (deltaY < 0 && this.callbacks.onSwipeUp) {
        this.callbacks.onSwipeUp();
      }
    }
  }

  private getTouchDistance(touch1: Touch, touch2: Touch): number {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  }

  public destroy(): void {
    this.clearLongPressTimer();
    this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.element.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    this.element.removeEventListener('touchcancel', this.handleTouchCancel.bind(this));
    this.touches.clear();
  }
}

// React hook for mobile gestures
export function useMobileGestures(
  elementRef: React.RefObject<HTMLElement>,
  callbacks: GestureCallbacks,
  config?: Partial<GestureConfig>
) {
  const gestureHandlerRef = useRef<MobileGestureHandler | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gestureHandlerRef.current = new MobileGestureHandler(element, callbacks, config);

    return () => {
      gestureHandlerRef.current?.destroy();
    };
  }, [elementRef.current, callbacks, config]);

  return gestureHandlerRef.current;
}

// Code editor specific gestures
export class CodeEditorGestures {
  private gestureHandler: MobileGestureHandler;
  private editor: any; // Monaco editor instance
  private fontSize = 14;
  private minFontSize = 10;
  private maxFontSize = 24;

  constructor(element: HTMLElement, editor: any) {
    this.editor = editor;
    
    this.gestureHandler = new MobileGestureHandler(element, {
      onDoubleTap: this.handleDoubleTap.bind(this),
      onLongPress: this.handleLongPress.bind(this),
      onTwoFingerTap: this.handleTwoFingerTap.bind(this),
      onThreeFingerTap: this.handleThreeFingerTap.bind(this),
      onPinchZoom: this.handlePinchZoom.bind(this),
      onSwipeLeft: this.handleSwipeLeft.bind(this),
      onSwipeRight: this.handleSwipeRight.bind(this),
      onSwipeUp: this.handleSwipeUp.bind(this),
      onSwipeDown: this.handleSwipeDown.bind(this)
    });
  }

  private handleDoubleTap(x: number, y: number): void {
    // Select word at position
    const position = this.editor.getTargetAtClientPoint(x, y);
    if (position) {
      const word = this.editor.getModel().getWordAtPosition(position);
      if (word) {
        this.editor.setSelection({
          startLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endLineNumber: position.lineNumber,
          endColumn: word.endColumn
        });
      }
    }
  }

  private handleLongPress(x: number, y: number): void {
    // Show context menu or trigger selection
    const position = this.editor.getTargetAtClientPoint(x, y);
    if (position) {
      this.editor.setPosition(position);
      this.editor.trigger('mobile', 'editor.action.quickCommand', {});
    }
  }

  private handleTwoFingerTap(x: number, y: number): void {
    // Toggle code folding at position
    const position = this.editor.getTargetAtClientPoint(x, y);
    if (position) {
      this.editor.trigger('mobile', 'editor.toggleFold', {});
    }
  }

  private handleThreeFingerTap(): void {
    // Format code
    this.editor.trigger('mobile', 'editor.action.formatDocument', {});
  }

  private handlePinchZoom(scale: number, centerX: number, centerY: number): void {
    // Adjust font size based on pinch
    const newFontSize = Math.max(
      this.minFontSize,
      Math.min(this.maxFontSize, this.fontSize * scale)
    );
    
    if (Math.abs(newFontSize - this.fontSize) > 0.5) {
      this.fontSize = Math.round(newFontSize);
      this.editor.updateOptions({ fontSize: this.fontSize });
    }
  }

  private handleSwipeLeft(): void {
    // Decrease indentation or move to previous tab
    this.editor.trigger('mobile', 'editor.action.outdentLines', {});
  }

  private handleSwipeRight(): void {
    // Increase indentation or move to next tab
    this.editor.trigger('mobile', 'editor.action.indentLines', {});
  }

  private handleSwipeUp(): void {
    // Scroll up or move line up
    this.editor.trigger('mobile', 'editor.action.moveLinesUpAction', {});
  }

  private handleSwipeDown(): void {
    // Scroll down or move line down
    this.editor.trigger('mobile', 'editor.action.moveLinesDownAction', {});
  }

  public destroy(): void {
    this.gestureHandler.destroy();
  }
}

export { MobileGestureHandler };
export type { TouchPoint, GestureConfig, GestureCallbacks };
