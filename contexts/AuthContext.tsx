'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface User {
  id: string;
  name: string;
  email: string;
  progress: {
    completedExercises: string[];
    totalPoints: number;
    currentPart: number;
    certificates: string[];
    lastActive: string;
    timeSpent: number; // in minutes
  };
  joinDate: string;
  profileImage?: string;
  preferences: {
    theme: 'light' | 'dark';
    language: 'es' | 'en';
    emailNotifications: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateProgress: (exerciseId: string, points: number) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create user document in Firestore
  const createUserDocument = async (firebaseUser: FirebaseUser, name: string): Promise<User> => {
    const userDoc = {
      id: firebaseUser.uid,
      name: name || firebaseUser.displayName || 'Usuario',
      email: firebaseUser.email!,
      progress: {
        completedExercises: [],
        totalPoints: 0,
        currentPart: 1,
        certificates: [],
        lastActive: new Date().toISOString(),
        timeSpent: 0
      },
      joinDate: new Date().toISOString(),
      preferences: {
        theme: 'light' as const,
        language: 'es' as const,
        emailNotifications: true
      }
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...userDoc,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return userDoc;
  };

  // Load user data from Firestore
  const loadUserData = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          progress: userData.progress,
          joinDate: userData.joinDate,
          profileImage: userData.profileImage,
          preferences: userData.preferences || {
            theme: 'light',
            language: 'es',
            emailNotifications: true
          }
        };
      }
      
      return null;
    } catch (err) {
      console.error('Error loading user data:', err);
      return null;
    }
  };

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          let userData = await loadUserData(firebaseUser);
          
          // If no user document exists, create one
          if (!userData) {
            userData = await createUserDocument(firebaseUser, firebaseUser.displayName || '');
          }
          
          setUser(userData);
          
          // Update last active time
          await updateDoc(doc(db, 'users', firebaseUser.uid), {
            'progress.lastActive': new Date().toISOString(),
            updatedAt: serverTimestamp()
          });
        } catch (err) {
          console.error('Error setting up user:', err);
          setError('Error loading user data');
        }
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // User data will be loaded by the auth state change listener
      return true;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Error al iniciar sesión');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Update last active time before logout
      if (firebaseUser) {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          'progress.lastActive': new Date().toISOString(),
          updatedAt: serverTimestamp()
        });
      }
      
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Error al cerrar sesión');
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if user already exists
      const existingUsersQuery = query(
        collection(db, 'users'),
        where('email', '==', email)
      );
      const existingUsers = await getDocs(existingUsersQuery);
      
      if (!existingUsers.empty) {
        setError('Ya existe una cuenta con este email');
        return false;
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase Auth profile
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Create user document in Firestore
      await createUserDocument(userCredential.user, name);
      
      return true;
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Error al crear la cuenta');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (exerciseId: string, points: number): Promise<void> => {
    if (!user || !firebaseUser) return;
    
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      
      // Get current progress
      const currentDoc = await getDoc(userRef);
      const currentData = currentDoc.data();
      const currentProgress = currentData?.progress || user.progress;
      
      // Update progress
      const updatedProgress = {
        ...currentProgress,
        completedExercises: currentProgress.completedExercises.includes(exerciseId) 
          ? currentProgress.completedExercises 
          : [...currentProgress.completedExercises, exerciseId],
        totalPoints: currentProgress.totalPoints + points,
        lastActive: new Date().toISOString()
      };
      
      // Update Firestore
      await updateDoc(userRef, {
        progress: updatedProgress,
        updatedAt: serverTimestamp()
      });
      
      // Update local state
      const updatedUser = {
        ...user,
        progress: updatedProgress
      };
      setUser(updatedUser);
      
      // Store exercise completion
      await setDoc(doc(db, 'completions', `${firebaseUser.uid}_${exerciseId}`), {
        userId: firebaseUser.uid,
        exerciseId,
        points,
        completedAt: serverTimestamp(),
        timestamp: new Date().toISOString()
      });
      
    } catch (err) {
      console.error('Error updating progress:', err);
      setError('Error al actualizar el progreso');
    }
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user || !firebaseUser) return;
    
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      
      // Update Firestore
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      // Update local state
      setUser({
        ...user,
        ...updates
      });
      
      // Update Firebase Auth profile if name changed
      if (updates.name) {
        await updateProfile(firebaseUser, {
          displayName: updates.name
        });
      }
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error al actualizar el perfil');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      login,
      logout,
      register,
      updateProgress,
      updateUserProfile,
      isLoading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
