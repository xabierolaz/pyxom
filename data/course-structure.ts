// Course structure following mooc.fi Python Programming MOOC 2024
// 14 parts organized as in the original course

import { CoursePart, Exercise, LearningObjective } from '@/types/course';

export const courseStructure: CoursePart[] = [
  {
    id: 'part01',
    title: 'Part 1',
    subtitle: 'Getting started',
    description: 'Learn the basics of programming in Python',
    learningObjectives: [
      { id: 'p1_obj1', text: 'You can write simple programs which read user input and produce output' },
      { id: 'p1_obj2', text: 'You know the difference between strings and integers and can use basic operations on these' },
      { id: 'p1_obj3', text: 'You can use variables to store, access and update data in your programs' },
      { id: 'p1_obj4', text: 'You know how to use the input() and print() functions' }
    ],
    sections: [
      {
        id: 'p1_s1',
        title: 'Getting started',
        exercises: [
          { id: 'ej01_suma_producto', title: 'Emoticons', path: '/01-introduccion/ej01_suma_producto', points: 2 },
          { id: 'ej02_variables', title: 'Fix the code: Seven brothers', path: '/01-introduccion/ej02_variables', points: 1 },
        ]
      },
      {
        id: 'p1_s2',
        title: 'Information from the user',
        exercises: [
          { id: 'ej03_input_output', title: 'Name and age', path: '/01-introduccion/ej03_input_output', points: 1 },
        ]
      },
      {
        id: 'p1_s3',
        title: 'More about variables',
        exercises: [
          { id: 'ej04_condicionales', title: 'Seconds in a day', path: '/01-introduccion/ej04_condicionales', points: 1 },
          { id: 'ej05_bucles', title: 'Fix the code: Product', path: '/01-introduccion/ej05_bucles', points: 1 },
        ]
      },
      {
        id: 'p1_s4',
        title: 'Arithmetic operations',
        exercises: [
          { id: 'ej06_listas', title: 'Sum and product', path: '/01-introduccion/ej06_listas', points: 2 },
        ]
      }
    ],
    estimatedHours: 8,
    completed: false,
    totalPoints: 8
  },
  {
    id: 'part02',
    title: 'Part 2',
    subtitle: 'Programming terminology',
    description: 'Learn fundamental programming concepts and terminology',
    learningObjectives: [
      { id: 'p2_obj1', text: 'You know how to use conditional statements' },
      { id: 'p2_obj2', text: 'You know how to use elif branches' },
      { id: 'p2_obj3', text: 'You can combine conditionals with logical operators' },
      { id: 'p2_obj4', text: 'You understand string formatting' }
    ],
    sections: [
      {
        id: 'p2_s1',
        title: 'Programming terminology',
        exercises: [
          { id: 'p2_ex1', title: 'Fix the code: Calculations', path: '/02-terminology/calculations', points: 1 }
        ]
      },
      {
        id: 'p2_s2',
        title: 'Conditional statements',
        exercises: [
          { id: 'p2_ex2', title: 'Age of maturity', path: '/02-terminology/age-maturity', points: 1 }
        ]
      }
    ],
    estimatedHours: 8,
    completed: false,
    totalPoints: 6
  },
  {
    id: 'part03',
    title: 'Part 3',
    subtitle: 'Loops with conditions',
    description: 'Master loops and conditional logic',
    learningObjectives: [
      { id: 'p3_obj1', text: 'You know how to use while loops' },
      { id: 'p3_obj2', text: 'You can use break and continue statements' },
      { id: 'p3_obj3', text: 'You can write programs which ask the user for input until certain criteria are met' }
    ],
    sections: [
      {
        id: 'p3_s1',
        title: 'Loops with conditions',
        exercises: [
          { id: 'p3_ex1', title: 'Numbers', path: '/03-loops/numbers', points: 2 }
        ]
      }
    ],
    estimatedHours: 10,
    completed: false,
    totalPoints: 8
  },
  {
    id: 'part04',
    title: 'Part 4',
    subtitle: 'Definite iteration',
    description: 'Learn to use for loops and work with strings',
    learningObjectives: [
      { id: 'p4_obj1', text: 'You can use for loops to repeat a section of code' },
      { id: 'p4_obj2', text: 'You understand the range function' },
      { id: 'p4_obj3', text: 'You can use for loops to iterate through strings' }
    ],
    sections: [
      {
        id: 'p4_s1',
        title: 'The for loop',
        exercises: [
          { id: 'ej01_recursividad_basica', title: 'Factorial', path: '/04-recursividad/ej01_recursividad_basica', points: 3 }
        ]
      }
    ],
    estimatedHours: 10,
    completed: false,
    totalPoints: 10
  },
  {
    id: 'part05',
    title: 'Part 5',
    subtitle: 'Lists',
    description: 'Working with lists and more complex data structures',
    learningObjectives: [
      { id: 'p5_obj1', text: 'You can create and use lists' },
      { id: 'p5_obj2', text: 'You can iterate through a list with a for loop' },
      { id: 'p5_obj3', text: 'You know some list methods and can search for items in a list' }
    ],
    sections: [
      {
        id: 'p5_s1',
        title: 'Lists and defining functions',
        exercises: [
          { id: 'p5_ex1', title: 'Longest string', path: '/05-lists/longest-string', points: 2 }
        ]
      }
    ],
    estimatedHours: 12,
    completed: false,
    totalPoints: 12
  },
  {
    id: 'part06',
    title: 'Part 6',
    subtitle: 'Reading files',
    description: 'Learn to read and process files',
    learningObjectives: [
      { id: 'p6_obj1', text: 'You can read and write files' },
      { id: 'p6_obj2', text: 'You can handle errors in file operations' },
      { id: 'p6_obj3', text: 'You can process CSV files' }
    ],
    sections: [
      {
        id: 'p6_s1',
        title: 'Reading files',
        exercises: [
          { id: 'p6_ex1', title: 'Fruit market', path: '/06-files/fruit-market', points: 3 }
        ]
      }
    ],
    estimatedHours: 12,
    completed: false,
    totalPoints: 14
  },
  {
    id: 'part07',
    title: 'Part 7',
    subtitle: 'Modules and randomness',
    description: 'Using modules and working with random numbers',
    learningObjectives: [
      { id: 'p7_obj1', text: 'You can use modules in your programs' },
      { id: 'p7_obj2', text: 'You can generate random numbers' },
      { id: 'p7_obj3', text: 'You can use the datetime module' }
    ],
    sections: [
      {
        id: 'p7_s1',
        title: 'Modules',
        exercises: [
          { id: 'p7_ex1', title: 'Password generator', path: '/07-modules/password-generator', points: 2 }
        ]
      }
    ],
    estimatedHours: 14,
    completed: false,
    totalPoints: 16
  },
  {
    id: 'part08',
    title: 'Part 8',
    subtitle: 'Functions and variable scope',
    description: 'Advanced function concepts and scope',
    learningObjectives: [
      { id: 'p8_obj1', text: 'You understand local and global variables' },
      { id: 'p8_obj2', text: 'You can write functions with default values' },
      { id: 'p8_obj3', text: 'You understand recursion' }
    ],
    sections: [
      {
        id: 'p8_s1',
        title: 'Functions and variable scope',
        exercises: [
          { id: 'ej02_sumatoria', title: 'Recursive sum', path: '/04-recursividad/ej02_sumatoria', points: 2 },
          { id: 'ej03_fibonacci', title: 'Fibonacci', path: '/04-recursividad/ej03_fibonacci', points: 3 }
        ]
      }
    ],
    estimatedHours: 14,
    completed: false,
    totalPoints: 18
  },
  {
    id: 'part09',
    title: 'Part 9',
    subtitle: 'Objects and methods',
    description: 'Introduction to object-oriented programming',
    learningObjectives: [
      { id: 'p9_obj1', text: 'You can use ready-made classes and understand what objects are' },
      { id: 'p9_obj2', text: 'You can call methods on objects' },
      { id: 'p9_obj3', text: 'You understand the relationship between classes and objects' }
    ],
    sections: [
      {
        id: 'p9_s1',
        title: 'Objects and methods',
        exercises: [
          { id: 'p9_ex1', title: 'List methods', path: '/09-objects/list-methods', points: 2 }
        ]
      }
    ],
    estimatedHours: 16,
    completed: false,
    totalPoints: 20
  },
  {
    id: 'part10',
    title: 'Part 10',
    subtitle: 'Class hierarchies',
    description: 'Advanced object-oriented programming concepts',
    learningObjectives: [
      { id: 'p10_obj1', text: 'You can write your own classes' },
      { id: 'p10_obj2', text: 'You understand encapsulation' },
      { id: 'p10_obj3', text: 'You can use inheritance' }
    ],
    sections: [
      {
        id: 'p10_s1',
        title: 'Class hierarchies',
        exercises: [
          { id: 'ej01_tree_basico', title: 'Binary tree basics', path: '/03-trees/ej01_tree_basico', points: 3 }
        ]
      }
    ],
    estimatedHours: 18,
    completed: false,
    totalPoints: 22
  },
  {
    id: 'part11',
    title: 'Part 11',
    subtitle: 'List comprehensions',
    description: 'Advanced list operations and comprehensions',
    learningObjectives: [
      { id: 'p11_obj1', text: 'You can use list comprehensions' },
      { id: 'p11_obj2', text: 'You understand more advanced sorting' },
      { id: 'p11_obj3', text: 'You can use regular expressions' }
    ],
    sections: [
      {
        id: 'p11_s1',
        title: 'List comprehensions',
        exercises: [
          { id: 'p11_ex1', title: 'Square roots', path: '/11-comprehensions/square-roots', points: 2 }
        ]
      }
    ],
    estimatedHours: 20,
    completed: false,
    totalPoints: 24
  },
  {
    id: 'part12',
    title: 'Part 12',
    subtitle: 'Functional programming',
    description: 'Functional programming concepts in Python',
    learningObjectives: [
      { id: 'p12_obj1', text: 'You understand lambda functions' },
      { id: 'p12_obj2', text: 'You can use map, filter and reduce' },
      { id: 'p12_obj3', text: 'You understand generators' }
    ],
    sections: [
      {
        id: 'p12_s1',
        title: 'Functional programming',
        exercises: [
          { id: 'p12_ex1', title: 'Sort by remaining stock', path: '/12-functional/sort-stock', points: 3 }
        ]
      }
    ],
    estimatedHours: 20,
    completed: false,
    totalPoints: 26
  },
  {
    id: 'part13',
    title: 'Part 13',
    subtitle: 'Pygame',
    description: 'Creating games and graphical applications',
    learningObjectives: [
      { id: 'p13_obj1', text: 'You can create simple games with Pygame' },
      { id: 'p13_obj2', text: 'You understand event handling' },
      { id: 'p13_obj3', text: 'You can draw graphics and handle user input' }
    ],
    sections: [
      {
        id: 'p13_s1',
        title: 'Pygame',
        exercises: [
          { id: 'p13_ex1', title: 'Four in a row', path: '/13-pygame/four-in-row', points: 4 }
        ]
      }
    ],
    estimatedHours: 22,
    completed: false,
    totalPoints: 28
  },
  {
    id: 'part14',
    title: 'Part 14',
    subtitle: 'More Pygame',
    description: 'Advanced Pygame concepts and final projects',
    learningObjectives: [
      { id: 'p14_obj1', text: 'You can create more complex games' },
      { id: 'p14_obj2', text: 'You understand game loops and state management' },
      { id: 'p14_obj3', text: 'You can handle collisions and animations' }
    ],
    sections: [
      {
        id: 'p14_s1',
        title: 'More Pygame',
        exercises: [
          { id: 'p14_ex1', title: 'Asteroids', path: '/14-pygame-advanced/asteroids', points: 5 }
        ]
      }
    ],
    estimatedHours: 25,
    completed: false,
    totalPoints: 30
  }
];

export const getTotalCoursePoints = (): number => {
  return courseStructure.reduce((total, part) => total + part.totalPoints, 0);
};

export const getCompletedParts = (): number => {
  return courseStructure.filter(part => part.completed).length;
};

export const getUserProgress = (): { completedExercises: number; totalExercises: number; earnedPoints: number; totalPoints: number } => {
  let completedExercises = 0;
  let totalExercises = 0;
  let earnedPoints = 0;
  let totalPoints = 0;

  courseStructure.forEach(part => {
    part.sections.forEach(section => {
      section.exercises.forEach(exercise => {
        totalExercises++;
        totalPoints += exercise.points;
        if (exercise.completed) {
          completedExercises++;
          earnedPoints += exercise.points;
        }
      });
    });
  });

  return { completedExercises, totalExercises, earnedPoints, totalPoints };
};
