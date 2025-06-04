# PyXom

**Advanced Python Learning Platform - Complete MOOC.fi Implementation**

PyXom is a comprehensive Python learning platform that replicates the University of Helsinki's Python Programming MOOC 2024 with all advanced technical and pedagogical features. Built with Next.js, TypeScript, and Pyodide for in-browser Python execution.

## 🌟 Features

### 🔧 Advanced Development Environment
- **Monaco Code Editor** with Python syntax highlighting
- **Real-time Python Execution** using Pyodide (no server required)
- **Interactive Debugging** with breakpoints and step-by-step execution
- **Python Tutor Visualization** for code execution visualization
- **Integrated Testing** with TMC-style automated testing

### 🎓 Educational Features
- **Intelligent Hints System** with context-aware suggestions
- **Model Solutions** with protected viewing and explanations
- **Progress Tracking** with comprehensive analytics
- **Static Code Analysis** for code quality feedback
- **Interactive Learning Path** following Helsinki MOOC structure

### 📚 Course Content
- **14 Parts** covering Python fundamentals to advanced topics
- **900+ Exercises** with automated testing and feedback
- **Complete MOOC Database** with all original exercises
- **Comprehensive Test Cases** for each exercise
- **Model Solutions** with detailed explanations

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pyxom.git
   cd pyxom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Production Build
```bash
npm run build
npm start
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Code Editor**: Monaco Editor
- **Python Runtime**: Pyodide (WebAssembly)
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Deployment**: Vercel/Netlify ready

### Key Components

#### Core Components
- `CodeEditor.tsx` - Advanced Monaco editor with debugging support
- `DebuggerPanel.tsx` - Interactive debugger interface
- `PythonTutorVisualization.tsx` - Code execution visualization
- `TestResultsPanel.tsx` - Comprehensive test result display
- `HintsPanel.tsx` - Intelligent hints system
- `ModelSolutionPanel.tsx` - Protected solution viewer

#### Utilities
- `pythonRunner.ts` - Python execution engine with Pyodide
- `exercises-database.ts` - Complete MOOC exercise database
- `course-structure.ts` - Course organization and structure

### Project Structure
```
pyxom/
├── app/
│   ├── parts/[partId]/
│   │   ├── [exerciseId]/page.tsx    # Exercise pages
│   │   └── page.tsx                 # Part overview
│   └── page.tsx                     # Home page
├── components/
│   ├── debugging/                   # Debugging components
│   ├── CodeEditor.tsx              # Main editor
│   ├── TestResultsPanel.tsx        # Test results
│   ├── HintsPanel.tsx              # Hints system
│   └── ModelSolutionPanel.tsx      # Solutions viewer
├── data/
│   ├── exercises-database.ts       # Exercise database
│   └── course-structure.ts         # Course structure
├── types/
│   └── types.ts                    # TypeScript definitions
└── utils/
    └── pythonRunner.ts             # Python execution
```

## 🎯 Core Features Explained

### Advanced Code Editor
- **Monaco Editor Integration**: Full-featured IDE experience
- **Python Syntax Highlighting**: Professional code editing
- **Breakpoint Support**: Visual debugging with breakpoints
- **Auto-completion**: Intelligent code suggestions
- **Error Highlighting**: Real-time syntax error detection

### Python Execution Engine
- **Pyodide Integration**: Full Python runtime in browser
- **No Server Required**: Complete client-side execution
- **Package Support**: Import popular Python libraries
- **Test Automation**: Automated test case execution
- **Static Analysis**: Code quality and style checking

### Debugging System
- **Step-by-Step Execution**: Line-by-line code execution
- **Variable Inspection**: Real-time variable monitoring
- **Call Stack Visualization**: Function call tracking
- **Breakpoint Management**: Interactive breakpoint controls
- **Memory Visualization**: Object and data structure viewing

### Python Tutor Integration
- **Visual Code Execution**: Step-by-step visualization
- **State Tracking**: Variable changes over time
- **Interactive Controls**: Play, pause, step controls
- **Memory Diagrams**: Visual representation of data structures

### Intelligent Hints System
- **Context-Aware Hints**: Relevant suggestions based on code
- **Credit System**: Gamified hint usage
- **Categorized Hints**: Syntax, logic, and concept hints
- **Automatic Triggering**: Smart hint suggestions
- **Progress Integration**: Hints affect exercise scoring

### Testing Framework
- **TMC-Style Testing**: University-grade automated testing
- **Comprehensive Results**: Detailed test result analysis
- **Static Checks**: Code quality verification
- **Scoring System**: Point-based exercise evaluation
- **Feedback Generation**: Detailed error explanations

## 📖 Usage Guide

### For Students

1. **Navigate Course Structure**
   - Browse parts and exercises
   - Track your progress
   - View completion statistics

2. **Solve Exercises**
   - Read exercise descriptions
   - Write Python code in the editor
   - Run tests to verify solutions
   - Get hints when stuck

3. **Debug Your Code**
   - Set breakpoints in the editor
   - Step through code execution
   - Inspect variables and state
   - Visualize code execution

4. **Learn from Solutions**
   - View model solutions after completion
   - Compare your approach
   - Read detailed explanations

### For Educators

1. **Course Management**
   - Monitor student progress
   - View completion statistics
   - Analyze common mistakes

2. **Content Creation**
   - Add new exercises
   - Create test cases
   - Write model solutions
   - Design hint systems

## 🔧 Development

### Adding New Exercises

1. **Update Exercise Database**
   ```typescript
   // In data/exercises-database.ts
   export const exerciseDatabase: Exercise[] = [
     {
       id: "new-exercise",
       title: "New Exercise",
       description: "Exercise description",
       starterCode: "# Your code here",
       tests: [/* test cases */],
       modelSolution: "# Model solution",
       hints: [/* hints array */]
     }
   ];
   ```

2. **Add to Course Structure**
   ```typescript
   // In data/course-structure.ts
   export const courseStructure = {
     // Add to appropriate part
   };
   ```

### Customizing Components

All components are modular and can be customized:

- **Editor Theme**: Modify Monaco editor configuration
- **UI Styling**: Update Tailwind CSS classes
- **Test Framework**: Extend Python execution engine
- **Hint System**: Add new hint categories

### Environment Variables

Create `.env.local` for Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

## 🧪 Testing

### Running Tests
```bash
npm run test
```

### Test Structure
- **Unit Tests**: Component testing
- **Integration Tests**: Feature testing
- **E2E Tests**: Full user flow testing

## 🚀 Deployment

### Vercel Deployment
```bash
vercel --prod
```

### Netlify Deployment
```bash
netlify deploy --prod
```

### Docker Deployment
```bash
docker build -t pyxom .
docker run -p 3000:3000 pyxom
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind for styling
- Write comprehensive tests
- Document new features
- Follow commit conventions

## 📊 Performance

- **Bundle Size**: Optimized for production
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Pyodide Caching**: Efficient Python runtime loading
- **CDN Integration**: Static asset optimization

## 🔐 Security

- **Client-Side Execution**: No server-side code execution
- **Sandboxed Environment**: Pyodide provides safe execution
- **Firebase Security**: Secure authentication and data storage
- **Input Validation**: Comprehensive input sanitization

## 📱 Browser Support

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile**: Responsive design for tablets

## 🔐 Licencia

Este curso está licenciado bajo:

**Creative Commons BY-NC-ND 4.0**  
Uso educativo permitido. Prohibido uso comercial o modificación sin consentimiento del autor.  
[https://creativecommons.org/licenses/by-nc-nd/4.0/](https://creativecommons.org/licenses/by-nc-nd/4.0/)

© 2025 Xabier Olaz

## 🙏 Acknowledgments

- **University of Helsinki** - Original Python Programming MOOC
- **MOOC.fi Platform** - Educational framework inspiration
- **Pyodide Team** - Python in WebAssembly
- **Monaco Editor** - Advanced code editing capabilities

---

**PyXom - Advanced Python Learning Platform**  
Built with ❤️ for Python education
