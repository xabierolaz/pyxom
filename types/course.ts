export interface CoursePart {
  id: string;
  number: number;
  title: string;
  description: string;
  learningObjectives: string[];
  estimatedHours: number;
  exercises: Exercise[];
  isCompleted?: boolean;
  isUnlocked?: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  path: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  isCompleted?: boolean;
  type: 'coding' | 'quiz' | 'theory';
}

export interface CourseStats {
  totalParts: number;
  completedParts: number;
  totalExercises: number;
  completedExercises: number;
  totalPoints: number;
  earnedPoints: number;
  timeSpent: number; // en minutos
  averageScore: number;
}

export interface Certificate {
  id: string;
  type: 'introduction' | 'advanced' | 'complete';
  title: string;
  issuedDate: string;
  grade: number;
  requirements: {
    minPoints: number;
    requiredParts: number[];
    examRequired: boolean;
  };
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  parts: number[];
  duration: number; // en minutos
  questions: ExamQuestion[];
  passingScore: number;
  isAvailable?: boolean;
  nextAvailableDate?: string;
}

export interface ExamQuestion {
  id: string;
  type: 'multiple-choice' | 'code' | 'text';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
}
