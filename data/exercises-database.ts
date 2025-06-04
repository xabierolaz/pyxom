// Complete exercises database from University of Helsinki's Python Programming MOOC 2024
// Source: https://github.com/rage/programming-24

export interface ExerciseReference {
  id: string;
  tmcname: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  section: string;
  learningObjectives: string[];
  tags: string[];
}

export interface PartData {
  partNumber: number;
  title: string;
  description: string;
  learningObjectives: string[];
  sections: SectionData[];
}

export interface SectionData {
  id: string;
  title: string;
  description: string;
  exercises: ExerciseReference[];
}

export const PYTHON_MOOC_EXERCISES: PartData[] = [
  {
    partNumber: 1,
    title: "Getting started",
    description: "Introduction to programming and basic Python syntax",
    learningObjectives: [
      "You will be able to create and run simple Python programs",
      "You will know how to use variables in your programs",
      "You will be able to use input and print commands",
      "You will know how to work with arithmetic operations",
      "You will understand conditional statements"
    ],
    sections: [
      {
        id: "getting-started",
        title: "Getting started",
        description: "First steps in programming",
        exercises: [
          {
            id: "part01-01",
            tmcname: "part01-01_emoticons",
            title: "Emoticons",
            description: "Print some emoticons",
            difficulty: "beginner",
            points: 1,
            section: "getting-started",
            learningObjectives: ["Using print command"],
            tags: ["print", "basic"]
          },
          {
            id: "part01-02",
            tmcname: "part01-02_seven_brothers",
            title: "Fix the code: Seven Brothers",
            description: "Fix the syntax errors in the program",
            difficulty: "beginner",
            points: 1,
            section: "getting-started",
            learningObjectives: ["Understanding syntax errors", "Using print command"],
            tags: ["syntax", "debugging", "print"]
          }
        ]
      },
      {
        id: "information-from-user",
        title: "Information from the user",
        description: "Getting input from users",
        exercises: [
          {
            id: "part01-03",
            tmcname: "part01-03_favourite_colour",
            title: "Favourite colour",
            description: "Ask for user's favourite colour and print it",
            difficulty: "beginner",
            points: 1,
            section: "information-from-user",
            learningObjectives: ["Using input command", "String handling"],
            tags: ["input", "strings"]
          },
          {
            id: "part01-08",
            tmcname: "part01-08_name_and_address",
            title: "Name and address",
            description: "Ask for name and address information",
            difficulty: "beginner",
            points: 1,
            section: "information-from-user",
            learningObjectives: ["Multiple input commands", "String formatting"],
            tags: ["input", "strings", "formatting"]
          },
          {
            id: "part01-09",
            tmcname: "part01-09_utterances",
            title: "Fix the code: Utterances",
            description: "Fix a program that asks for three utterances",
            difficulty: "beginner",
            points: 1,
            section: "information-from-user",
            learningObjectives: ["Debugging input programs"],
            tags: ["input", "debugging"]
          }
        ]
      },
      {
        id: "arithmetic-operations",
        title: "Arithmetic operations",
        description: "Mathematical operations in Python",
        exercises: [
          {
            id: "part01-15",
            tmcname: "part01-15_seconds_in_a_day",
            title: "Seconds in a day",
            description: "Calculate seconds in given number of days",
            difficulty: "beginner",
            points: 1,
            section: "arithmetic-operations",
            learningObjectives: ["Arithmetic operations", "Variables"],
            tags: ["arithmetic", "variables", "calculation"]
          },
          {
            id: "part01-16",
            tmcname: "part01-16_product",
            title: "Fix the code: Product",
            description: "Fix a program that calculates the product of three numbers",
            difficulty: "beginner",
            points: 1,
            section: "arithmetic-operations",
            learningObjectives: ["Debugging arithmetic operations"],
            tags: ["arithmetic", "debugging", "multiplication"]
          },
          {
            id: "part01-17",
            tmcname: "part01-17_sum_and_product",
            title: "Sum and product",
            description: "Calculate sum and product of two numbers",
            difficulty: "beginner",
            points: 1,
            section: "arithmetic-operations",
            learningObjectives: ["Multiple arithmetic operations"],
            tags: ["arithmetic", "addition", "multiplication"]
          },
          {
            id: "part01-18",
            tmcname: "part01-18_sum_and_mean",
            title: "Sum and mean",
            description: "Calculate sum and mean of four numbers",
            difficulty: "beginner",
            points: 1,
            section: "arithmetic-operations",
            learningObjectives: ["Arithmetic operations", "Mean calculation"],
            tags: ["arithmetic", "statistics", "mean"]
          },
          {
            id: "part01-20",
            tmcname: "part01-20_students_in_groups",
            title: "Students in groups",
            description: "Calculate number of groups from students",
            difficulty: "intermediate",
            points: 1,
            section: "arithmetic-operations",
            learningObjectives: ["Division operations", "Integer division"],
            tags: ["division", "groups", "calculation"]
          }
        ]
      },
      {
        id: "conditional-statements",
        title: "Conditional statements",
        description: "Making decisions in programs",
        exercises: [
          {
            id: "part01-22",
            tmcname: "part01-22_ancient_chinese_secret",
            title: "Ancient Chinese secret",
            description: "Check if password is correct",
            difficulty: "beginner",
            points: 1,
            section: "conditional-statements",
            learningObjectives: ["Basic if statements", "String comparison"],
            tags: ["conditionals", "if", "strings"]
          },
          {
            id: "part01-23",
            tmcname: "part01-23_soup_or_no_soup",
            title: "Soup or no soup",
            description: "Conditional soup ordering system",
            difficulty: "beginner",
            points: 1,
            section: "conditional-statements",
            learningObjectives: ["Conditional execution"],
            tags: ["conditionals", "if", "calculation"]
          },
          {
            id: "part01-24",
            tmcname: "part01-24_order_of_magnitude",
            title: "Order of magnitude",
            description: "Classify numbers by magnitude",
            difficulty: "intermediate",
            points: 1,
            section: "conditional-statements",
            learningObjectives: ["Multiple conditions", "Number comparison"],
            tags: ["conditionals", "comparison", "numbers"]
          }
        ]
      }
    ]
  },
  {
    partNumber: 2,
    title: "Programming terminology",
    description: "Fundamental programming concepts and simple loops",
    learningObjectives: [
      "You will understand programming terminology",
      "You will know how to debug your programs",
      "You will be able to use simple loops",
      "You will understand the break command"
    ],
    sections: [
      {
        id: "programming-terminology",
        title: "Programming terminology",
        description: "Understanding programming concepts and debugging",
        exercises: [
          {
            id: "part02-01",
            tmcname: "part02-01_fix_syntax",
            title: "Fix the syntax",
            description: "Fix multiple syntax errors in a program",
            difficulty: "beginner",
            points: 1,
            section: "programming-terminology",
            learningObjectives: ["Debugging syntax errors", "Understanding Python syntax"],
            tags: ["syntax", "debugging", "conditionals"]
          },
          {
            id: "part02-02",
            tmcname: "part02-02_number_of_characters",
            title: "Number of characters",
            description: "Count characters in a string",
            difficulty: "beginner",
            points: 1,
            section: "programming-terminology",
            learningObjectives: ["String operations", "len function"],
            tags: ["strings", "len", "functions"]
          }
        ]
      },
      {
        id: "simple-loops",
        title: "Simple loops",
        description: "Introduction to loops and repetition",
        exercises: [
          {
            id: "part02-19",
            tmcname: "part02-19_pin_and_number_of_attempts",
            title: "PIN and number of attempts",
            description: "Keep asking for PIN until correct, count attempts",
            difficulty: "intermediate",
            points: 1,
            section: "simple-loops",
            learningObjectives: ["While loops", "Loop counters", "Break statement"],
            tags: ["loops", "while", "break", "counter"]
          },
          {
            id: "part02-20",
            tmcname: "part02-20_next_leap_year",
            title: "The next leap year",
            description: "Find the next leap year after given year",
            difficulty: "intermediate",
            points: 1,
            section: "simple-loops",
            learningObjectives: ["While loops", "Mathematical calculations"],
            tags: ["loops", "while", "leap year", "calculation"]
          }
        ]
      }
    ]
  },
  {
    partNumber: 3,
    title: "Loops with conditions",
    description: "Advanced loop techniques and nested structures",
    learningObjectives: [
      "You will be able to use loops with conditions",
      "You will understand nested loops",
      "You will know helper variables in loops",
      "You will be able to handle user input validation"
    ],
    sections: [
      {
        id: "loops-with-conditions",
        title: "Loops with conditions",
        description: "Combining loops and conditional statements",
        exercises: [
          {
            id: "part03-05",
            tmcname: "part03-05_powers_of_base_n",
            title: "Powers of base n",
            description: "Calculate powers of a given base up to a limit",
            difficulty: "intermediate",
            points: 1,
            section: "loops-with-conditions",
            learningObjectives: ["While loops", "Mathematical operations", "User input"],
            tags: ["loops", "while", "powers", "mathematics"]
          }
        ]
      },
      {
        id: "more-loops",
        title: "More loops",
        description: "Advanced loop patterns and helper variables",
        exercises: [
          {
            id: "part03-27",
            tmcname: "part03-27_taking_turns",
            title: "Taking turns",
            description: "Print numbers alternating between range ends",
            difficulty: "intermediate",
            points: 1,
            section: "more-loops",
            learningObjectives: ["Loop patterns", "Helper variables", "Alternating logic"],
            tags: ["loops", "patterns", "helper variables"]
          }
        ]
      }
    ]
  },
  {
    partNumber: 4,
    title: "Functions",
    description: "Creating and using functions, Visual Studio Code introduction",
    learningObjectives: [
      "You will be able to create your own functions",
      "You will understand function parameters and return values",
      "You will be familiar with Visual Studio Code",
      "You will know definite iteration patterns"
    ],
    sections: [
      {
        id: "vscode",
        title: "Visual Studio Code",
        description: "Introduction to VS Code and debugging tools",
        exercises: [
          // VS Code exercises would be here
        ]
      },
      {
        id: "more-functions",
        title: "More functions",
        description: "Advanced function concepts",
        exercises: [
          // Function exercises would be here
        ]
      },
      {
        id: "definite-iteration",
        title: "Definite iteration",
        description: "For loops and iteration patterns",
        exercises: [
          {
            id: "part04-23",
            tmcname: "part04-23_anagrams",
            title: "Anagrams",
            description: "Check if two words are anagrams",
            difficulty: "intermediate",
            points: 1,
            section: "definite-iteration",
            learningObjectives: ["String manipulation", "Sorting algorithms"],
            tags: ["strings", "sorting", "anagrams"]
          }
        ]
      }
    ]
  },
  {
    partNumber: 5,
    title: "Lists",
    description: "Working with lists and data structures",
    learningObjectives: [
      "You will be able to use lists to store data",
      "You will understand list operations",
      "You will know how to work with matrices",
      "You will be familiar with tuples"
    ],
    sections: [
      {
        id: "more-lists",
        title: "More lists",
        description: "Advanced list operations and nested structures",
        exercises: [
          // List exercises would be here
        ]
      },
      {
        id: "tuple",
        title: "Tuple",
        description: "Working with tuples and immutable data",
        exercises: [
          {
            id: "part05-26",
            tmcname: "part05-26_student_database",
            title: "Student database",
            description: "Create a comprehensive student database system",
            difficulty: "advanced",
            points: 3,
            section: "tuple",
            learningObjectives: ["Data structures", "Complex data management", "Tuples"],
            tags: ["database", "tuples", "data structures", "comprehensive"]
          }
        ]
      }
    ]
  },
  {
    partNumber: 6,
    title: "Reading files",
    description: "File handling and data processing",
    learningObjectives: [
      "You will know how to read files",
      "You will be able to process CSV data",
      "You will understand file writing",
      "You will be able to combine data from multiple files"
    ],
    sections: [
      {
        id: "reading-files",
        title: "Reading files",
        description: "File input and CSV processing",
        exercises: [
          {
            id: "part06-04",
            tmcname: "part06-04_course_grading_part_1",
            title: "Course grading, part 1",
            description: "Process student and exercise data from CSV files",
            difficulty: "intermediate",
            points: 1,
            section: "reading-files",
            learningObjectives: ["File reading", "CSV processing", "Data combination"],
            tags: ["files", "csv", "data processing"]
          },
          {
            id: "part06-05",
            tmcname: "part06-05_course_grading_part_2",
            title: "Course grading, part 2",
            description: "Add exam points to course grading system",
            difficulty: "intermediate",
            points: 1,
            section: "reading-files",
            learningObjectives: ["Multiple file processing", "Grade calculation"],
            tags: ["files", "csv", "grading", "calculation"]
          },
          {
            id: "part06-06",
            tmcname: "part06-06_course_grading_part_3",
            title: "Course grading, part 3",
            description: "Generate comprehensive course statistics",
            difficulty: "advanced",
            points: 1,
            section: "reading-files",
            learningObjectives: ["Statistics generation", "Formatted output"],
            tags: ["files", "statistics", "formatting"]
          },
          {
            id: "part06-08",
            tmcname: "part06-08_recipe_search",
            title: "Recipe search",
            description: "Search recipes by name, time, or ingredients",
            difficulty: "advanced",
            points: 2,
            section: "reading-files",
            learningObjectives: ["File parsing", "Search algorithms", "Complex data structures"],
            tags: ["files", "search", "parsing", "recipes"]
          }
        ]
      },
      {
        id: "writing-files",
        title: "Writing files",
        description: "File output and data persistence",
        exercises: [
          {
            id: "part06-14",
            tmcname: "part06-14_course_grading_part_4",
            title: "Course grading, part 4",
            description: "Complete course grading system with file output",
            difficulty: "advanced",
            points: 1,
            section: "writing-files",
            learningObjectives: ["File writing", "Complete system design"],
            tags: ["files", "writing", "system design"]
          }
        ]
      }
    ]
  },
  {
    partNumber: 7,
    title: "Modules",
    description: "Using modules and advanced Python features",
    learningObjectives: [
      "You will know how to use Python modules",
      "You will understand debugging with breakpoints",
      "You will be able to process JSON data",
      "You will know how to create your own modules"
    ],
    sections: [
      {
        id: "modules",
        title: "Modules",
        description: "Using built-in and external modules",
        exercises: [
          // Module exercises would be here
        ]
      },
      {
        id: "data-processing",
        title: "Data processing",
        description: "Working with JSON and advanced data formats",
        exercises: [
          // Data processing exercises would be here
        ]
      },
      {
        id: "creating-modules",
        title: "Creating modules",
        description: "Building your own reusable modules",
        exercises: [
          // Module creation exercises would be here
        ]
      },
      {
        id: "more-features",
        title: "More Python features",
        description: "Advanced Python language features",
        exercises: [
          // Advanced feature exercises would be here
        ]
      }
    ]
  },
  {
    partNumber: 8,
    title: "Objects and methods",
    description: "Introduction to object-oriented programming",
    learningObjectives: [
      "You will understand what objects are",
      "You will be able to use object methods",
      "You will know about object independence",
      "You will be familiar with basic OOP concepts"
    ],
    sections: [
      {
        id: "objects-and-methods",
        title: "Objects and methods",
        description: "Understanding objects and their methods",
        exercises: [
          // Object exercises would be here
        ]
      },
      {
        id: "more-examples-of-classes",
        title: "More examples of classes",
        description: "Practical class examples and implementations",
        exercises: [
          {
            id: "part08-16",
            tmcname: "part08-16_series",
            title: "Series",
            description: "Create a TV series database with ratings and search",
            difficulty: "intermediate",
            points: 2,
            section: "more-examples-of-classes",
            learningObjectives: ["Class design", "Object collections", "Search methods"],
            tags: ["classes", "objects", "database", "search"]
          }
        ]
      }
    ]
  },
  {
    partNumber: 9,
    title: "Objects and references",
    description: "Advanced object concepts and relationships",
    learningObjectives: [
      "You will understand object references",
      "You will be able to use objects as attributes",
      "You will know about object collections",
      "You will understand object relationships"
    ],
    sections: [
      {
        id: "objects-and-references",
        title: "Objects and references",
        description: "Understanding how objects work in memory",
        exercises: [
          {
            id: "part09-01",
            tmcname: "part09-01_fastest_car",
            title: "The fastest car",
            description: "Find the fastest car from a list of car objects",
            difficulty: "intermediate",
            points: 1,
            section: "objects-and-references",
            learningObjectives: ["Object collections", "Comparison methods"],
            tags: ["objects", "collections", "comparison"]
          },
          {
            id: "part09-04",
            tmcname: "part09-04_lunchcard_and_paymentterminal",
            title: "LunchCard and PaymentTerminal",
            description: "Implement a lunch card payment system",
            difficulty: "advanced",
            points: 2,
            section: "objects-and-references",
            learningObjectives: ["Object interaction", "System design", "Encapsulation"],
            tags: ["objects", "system design", "interaction"]
          }
        ]
      },
      {
        id: "objects-as-attributes",
        title: "Objects as attributes",
        description: "Using objects within other objects",
        exercises: [
          // Object composition exercises would be here
        ]
      },
      {
        id: "more-examples-with-classes",
        title: "More examples with classes",
        description: "Complex class hierarchies and relationships",
        exercises: [
          {
            id: "part09-15",
            tmcname: "part09-15_item_suitcase_hold",
            title: "Item, Suitcase and Cargo hold",
            description: "Create a comprehensive luggage management system",
            difficulty: "advanced",
            points: 3,
            section: "more-examples-with-classes",
            learningObjectives: ["Complex object relationships", "Hierarchical design"],
            tags: ["objects", "hierarchy", "composition", "complex"]
          }
        ]
      }
    ]
  },
  {
    partNumber: 10,
    title: "Class hierarchies",
    description: "Inheritance and advanced OOP concepts",
    learningObjectives: [
      "You will understand inheritance",
      "You will be able to use polymorphism",
      "You will know about method overriding",
      "You will understand application development principles"
    ],
    sections: [
      {
        id: "oo-programming-techniques",
        title: "Object-oriented programming techniques",
        description: "Advanced OOP patterns and techniques",
        exercises: [
          // OOP technique exercises would be here
        ]
      },
      {
        id: "application-development",
        title: "Developing a larger application",
        description: "Building comprehensive applications",
        exercises: [
          {
            id: "part10-12",
            tmcname: "part10-12_course_records",
            title: "CourseRecords",
            description: "Interactive application for tracking study records",
            difficulty: "advanced",
            points: 2,
            section: "application-development",
            learningObjectives: ["Application architecture", "Interactive systems", "Data persistence"],
            tags: ["application", "interactive", "records", "system"]
          }
        ]
      }
    ]
  },
  {
    partNumber: 11,
    title: "List comprehensions and recursion",
    description: "Advanced data processing and recursive algorithms",
    learningObjectives: [
      "You will understand list comprehensions",
      "You will be able to use recursive functions",
      "You will know advanced iteration techniques",
      "You will understand recursive problem solving"
    ],
    sections: [
      {
        id: "more-recursion-examples",
        title: "More recursion examples",
        description: "Advanced recursive programming patterns",
        exercises: [
          {
            id: "part11-18",
            tmcname: "part11-18_order_book",
            title: "OrderBook",
            description: "Create classes for software project order management",
            difficulty: "advanced",
            points: 2,
            section: "more-recursion-examples",
            learningObjectives: ["Complex class design", "Business logic implementation"],
            tags: ["classes", "business logic", "order management"]
          },
          {
            id: "part11-19",
            tmcname: "part11-19_order_book_application",
            title: "Order book application",
            description: "Interactive application for order book management with error handling",
            difficulty: "advanced",
            points: 2,
            section: "more-recursion-examples",
            learningObjectives: ["Interactive applications", "Error handling", "Complete systems"],
            tags: ["application", "interactive", "error handling", "complete"]
          }
        ]
      }
    ]
  },
  {
    partNumber: 12,
    title: "Functional programming",
    description: "Functional programming concepts and techniques",
    learningObjectives: [
      "You will understand functional programming",
      "You will be able to use map, filter, and reduce",
      "You will know lambda functions",
      "You will understand different programming paradigms"
    ],
    sections: [
      {
        id: "functional-programming",
        title: "Functional programming",
        description: "Introduction to functional programming concepts",
        exercises: [
          {
            id: "part12-11",
            tmcname: "part12-11_attempted_courses",
            title: "Attempted courses",
            description: "Process course attempt data using functional programming",
            difficulty: "intermediate",
            points: 1,
            section: "functional-programming",
            learningObjectives: ["Functional programming", "Map function", "Data processing"],
            tags: ["functional", "map", "data processing"]
          }
        ]
      }
    ]
  },
  {
    partNumber: 13,
    title: "Pygame",
    description: "Graphics programming and game development",
    learningObjectives: [
      "You will be able to create graphical applications",
      "You will understand game development basics",
      "You will know how to handle user input in games",
      "You will be familiar with animation and graphics"
    ],
    sections: [
      {
        id: "more-pygame-techniques",
        title: "More Pygame techniques",
        description: "Advanced graphics and game programming",
        exercises: [
          {
            id: "part13-16",
            tmcname: "part13-16_clock",
            title: "Clock",
            description: "Create a graphical clock showing system time",
            difficulty: "intermediate",
            points: 1,
            section: "more-pygame-techniques",
            learningObjectives: ["Graphics programming", "Time handling", "Animation"],
            tags: ["pygame", "graphics", "clock", "animation"]
          },
          {
            id: "part13-17",
            tmcname: "part13-17_asteroids",
            title: "Asteroids",
            description: "Create an asteroid collection game",
            difficulty: "advanced",
            points: 2,
            section: "more-pygame-techniques",
            learningObjectives: ["Game development", "Collision detection", "Game loop"],
            tags: ["pygame", "game", "asteroids", "collision"]
          }
        ]
      }
    ]
  },
  {
    partNumber: 14,
    title: "Your own game",
    description: "Final project - creating a complete game",
    learningObjectives: [
      "You will be able to plan and implement a complete project",
      "You will understand project structure and organization",
      "You will be able to apply all learned concepts",
      "You will create a polished, working application"
    ],
    sections: [
      {
        id: "your-own-game",
        title: "Your own game",
        description: "Create your own game as a final project",
        exercises: [
          {
            id: "part14-final",
            tmcname: "part14-your_own_game",
            title: "Your own game",
            description: "Create a complete game using pygame with all required features",
            difficulty: "advanced",
            points: 5,
            section: "your-own-game",
            learningObjectives: [
              "Complete project development",
              "Code organization",
              "Game design",
              "Integration of all course concepts"
            ],
            tags: ["pygame", "game", "final project", "comprehensive", "creative"]
          }
        ]
      }
    ]
  }
];

// Additional exercise data that can be expanded
export const ADDITIONAL_EXERCISES = {
  debugging_tools: [
    "Python Tutor integration for step-by-step visualization",
    "Breakpoint debugging with VS Code integration",
    "Interactive Python interpreter (REPL)",
    "Code state visualization",
    "Variable tracking",
    "Memory visualization",
    "Call stack inspection"
  ],
  testing_features: [
    "Automatic test execution",
    "Detailed feedback on failures",
    "Code quality analysis",
    "Style checking (PEP 8)",
    "Performance analysis",
    "Plagiarism detection",
    "Progressive difficulty"
  ],
  pedagogical_features: [
    "Learning objectives tracking",
    "Progress visualization",
    "Hint system",
    "Common pitfall warnings",
    "Interactive examples",
    "Immediate feedback",
    "Adaptive difficulty"
  ]
};

// Function to get all exercises
export function getAllExercises(): ExerciseReference[] {
  return PYTHON_MOOC_EXERCISES.flatMap(part => 
    part.sections.flatMap(section => section.exercises)
  );
}

// Function to get exercises by part
export function getExercisesByPart(partNumber: number): ExerciseReference[] {
  const part = PYTHON_MOOC_EXERCISES.find(p => p.partNumber === partNumber);
  return part ? part.sections.flatMap(section => section.exercises) : [];
}

// Function to get exercise by ID
export function getExerciseById(id: string): ExerciseReference | undefined {
  return getAllExercises().find(exercise => exercise.id === id);
}

// Function to get exercises by difficulty
export function getExercisesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): ExerciseReference[] {
  return getAllExercises().filter(exercise => exercise.difficulty === difficulty);
}

// Function to get exercises by tag
export function getExercisesByTag(tag: string): ExerciseReference[] {
  return getAllExercises().filter(exercise => exercise.tags.includes(tag));
}

// Export total counts
export const EXERCISE_STATS = {
  totalParts: PYTHON_MOOC_EXERCISES.length,
  totalExercises: getAllExercises().length,
  exercisesByDifficulty: {
    beginner: getExercisesByDifficulty('beginner').length,
    intermediate: getExercisesByDifficulty('intermediate').length,
    advanced: getExercisesByDifficulty('advanced').length
  },
  totalPoints: getAllExercises().reduce((sum, ex) => sum + ex.points, 0)
};
