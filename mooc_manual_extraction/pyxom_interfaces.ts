// TypeScript interfaces for MOOC.fi integration with PyXom
// Generated from manual extraction

export interface MOOCExercise {
  id: string;
  tmcname: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  part: number;
  exercise_number: number;
  tags: string[];
  learningObjectives: string[];
  source: 'mooc.fi';
}

export interface MOOCPart {
  part_number: number;
  files_found: string[];
  exercises: MOOCExercise[];
  learning_objectives: string[];
  content_summary: string;
}

export interface MOOCIntegrationData {
  exercises: MOOCExercise[];
  total_exercises: number;
  parts_with_content: number;
  integration_notes: string[];
}

// Example usage in PyXom:
// import { MOOCExercise, MOOCIntegrationData } from './mooc-interfaces';
//
// const moocData: MOOCIntegrationData = require('./pyxom_exercises.json');
// const exercises: MOOCExercise[] = moocData.exercises;