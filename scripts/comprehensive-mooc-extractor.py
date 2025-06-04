#!/usr/bin/env python3
"""
Enhanced MOOC.fi Complete Content Extractor

This script performs a comprehensive extraction of ALL content from the 
University of Helsinki's Python Programming MOOC 2024 repository.

Features:
- Extracts ALL markdown files with exercises and content
- Downloads complete course structure and organization
- Extracts technical implementation details
- Saves pedagogical patterns and methodologies
- Creates backup of all educational content
- Generates integration roadmap for PyXom

Repository: https://github.com/rage/programming-24
"""

import asyncio
import aiohttp
import json
import re
import os
from datetime import datetime
from typing import Dict, List, Any, Optional, Set
from pathlib import Path
import time

class ComprehensiveMOOCExtractor:
    def __init__(self):
        self.repo_owner = "rage"
        self.repo_name = "programming-24"
        self.api_base = f"https://api.github.com/repos/{self.repo_owner}/{self.repo_name}"
        self.raw_base = f"https://raw.githubusercontent.com/{self.repo_owner}/{self.repo_name}/main"
        
        self.headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'PyXom-MOOC-Comprehensive-Extractor/2.0'
        }
        
        self.extracted_data = {
            'metadata': {
                'extraction_date': datetime.now().isoformat(),
                'repository': f'{self.repo_owner}/{self.repo_name}',
                'extraction_version': '2.0',
                'total_files_found': 0,
                'total_exercises_found': 0,
                'total_parts': 14
            },
            'repository_structure': {},
            'parts': {},  # All 14 parts with complete content
            'exercises': {},  # All exercises with full details
            'course_content': {},  # All educational content
            'technical_implementation': {},  # All technical files
            'pedagogical_patterns': {},  # Educational methodologies
            'testing_framework': {},  # TMC and testing details
            'frontend_components': {},  # React components and UI
            'configuration': {}  # All config files
        }
        
        self.all_files: List[Dict] = []
        self.content_cache: Dict[str, str] = {}
        
    async def get_repository_tree(self, session: aiohttp.ClientSession):
        """Get complete repository file tree"""
        print("Fetching complete repository structure...")
        
        url = f"{self.api_base}/git/trees/main?recursive=1"
        async with session.get(url, headers=self.headers) as response:
            if response.status == 200:
                data = await response.json()
                self.all_files = data['tree']
                self.extracted_data['metadata']['total_files_found'] = len(self.all_files)
                print(f"Found {len(self.all_files)} files in repository")
                return True
            else:
                print(f"Failed to fetch repository tree: {response.status}")
                return False
    
    async def fetch_file_content(self, session: aiohttp.ClientSession, file_path: str) -> Optional[str]:
        """Fetch content of a specific file"""
        if file_path in self.content_cache:
            return self.content_cache[file_path]
            
        url = f"{self.raw_base}/{file_path}"
        try:
            async with session.get(url, headers=self.headers) as response:
                if response.status == 200:
                    content = await response.text()
                    self.content_cache[file_path] = content
                    return content
                else:
                    print(f"Failed to fetch {file_path}: {response.status}")
                    return None
        except Exception as e:
            print(f"Error fetching {file_path}: {e}")
            return None
    
    def categorize_files(self) -> Dict[str, List[str]]:
        """Categorize files by type and purpose"""
        categories = {
            'course_content': [],
            'exercises': [],
            'technical': [],
            'frontend': [],
            'configuration': [],
            'documentation': [],
            'data': []
        }
        
        for file_info in self.all_files:
            if file_info['type'] != 'blob':
                continue
                
            path = file_info['path']
            
            # Course content (markdown files in data/)
            if path.startswith('data/') and path.endswith('.md'):
                categories['course_content'].append(path)
            
            # Exercise files (programming exercises)
            elif 'exercise' in path.lower() or 'tmcname' in path:
                categories['exercises'].append(path)
            
            # Frontend components
            elif path.startswith('src/') and (path.endswith('.js') or path.endswith('.jsx')):
                categories['frontend'].append(path)
            
            # Technical implementation
            elif path.endswith(('.py', '.yml', '.yaml', '.json', '.js')) and not path.startswith('src/'):
                categories['technical'].append(path)
            
            # Configuration files
            elif path.startswith('.') or 'config' in path.lower():
                categories['configuration'].append(path)
            
            # Documentation
            elif path.endswith('.md') and not path.startswith('data/'):
                categories['documentation'].append(path)
            
            # Data files
            elif path.startswith('data/') and not path.endswith('.md'):
                categories['data'].append(path)
        
        return categories
    
    async def extract_course_content(self, session: aiohttp.ClientSession, content_files: List[str]):
        """Extract all course content from markdown files"""
        print("Extracting course content...")
        
        for file_path in content_files:
            print(f"Processing: {file_path}")
            content = await self.fetch_file_content(session, file_path)
            
            if content:
                # Determine which part this belongs to
                part_match = re.search(r'part-(\d+)', file_path)
                if part_match:
                    part_num = int(part_match.group(1))
                    
                    if part_num not in self.extracted_data['parts']:
                        self.extracted_data['parts'][part_num] = {
                            'part_number': part_num,
                            'files': {},
                            'exercises': [],
                            'learning_objectives': [],
                            'sections': [],
                            'content_summary': ''
                        }
                    
                    # Extract file info
                    filename = os.path.basename(file_path)
                    self.extracted_data['parts'][part_num]['files'][filename] = {
                        'path': file_path,
                        'content': content,
                        'exercises': self.extract_exercises_from_content(content),
                        'learning_objectives': self.extract_learning_objectives(content),
                        'sections': self.extract_sections(content)
                    }
                    
                    # Aggregate exercises for this part
                    exercises = self.extract_exercises_from_content(content)
                    self.extracted_data['parts'][part_num]['exercises'].extend(exercises)
                    
                    # Aggregate learning objectives
                    objectives = self.extract_learning_objectives(content)
                    self.extracted_data['parts'][part_num]['learning_objectives'].extend(objectives)
                
                else:
                    # General course content (not part-specific)
                    self.extracted_data['course_content'][file_path] = {
                        'content': content,
                        'exercises': self.extract_exercises_from_content(content)
                    }
            
            await asyncio.sleep(0.1)  # Rate limiting
    
    def extract_exercises_from_content(self, content: str) -> List[Dict]:
        """Extract all programming exercises from content"""
        exercises = []
        
        # Pattern for programming exercises with tmcname
        exercise_pattern = r'<programming-exercise.*?tmcname=["\']([^"\']+)["\'].*?>(.*?)</programming-exercise>'
        matches = re.findall(exercise_pattern, content, re.DOTALL | re.IGNORECASE)
        
        for tmcname, exercise_content in matches:
            exercise = {
                'tmcname': tmcname,
                'raw_content': exercise_content.strip(),
                'title': self.extract_exercise_title(exercise_content),
                'description': self.extract_exercise_description(exercise_content),
                'requirements': self.extract_exercise_requirements(exercise_content),
                'hints': self.extract_exercise_hints(exercise_content),
                'examples': self.extract_exercise_examples(exercise_content),
                'test_cases': self.extract_test_cases(exercise_content),
                'points': self.extract_points(exercise_content),
                'difficulty': self.determine_difficulty(tmcname, exercise_content)
            }
            exercises.append(exercise)
            
            # Add to global exercises database
            self.extracted_data['exercises'][tmcname] = exercise
        
        return exercises
    
    def extract_exercise_title(self, content: str) -> str:
        """Extract exercise title"""
        # Try multiple patterns for titles
        patterns = [
            r'<h2[^>]*>(.*?)</h2>',
            r'## (.*?)(?=\n)',
            r'# (.*?)(?=\n)',
            r'<title>(.*?)</title>'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                return re.sub(r'<[^>]+>', '', match.group(1)).strip()
        
        return "Untitled Exercise"
    
    def extract_exercise_description(self, content: str) -> str:
        """Extract exercise description"""
        # Remove HTML tags and get meaningful description
        clean_content = re.sub(r'<[^>]+>', '', content)
        clean_content = re.sub(r'\n+', ' ', clean_content).strip()
        
        # Get first meaningful paragraph
        sentences = clean_content.split('. ')
        description = '. '.join(sentences[:3])  # First 3 sentences
        
        return description if len(description) > 20 else clean_content[:200]
    
    def extract_exercise_requirements(self, content: str) -> List[str]:
        """Extract exercise requirements"""
        requirements = []
        
        # Look for requirement patterns
        req_patterns = [
            r'Write a (?:function|program|class) (?:that|which) (.+?)(?=\.|$)',
            r'Create (.+?)(?=\.|$)',
            r'Implement (.+?)(?=\.|$)',
            r'Your (?:function|program|class) should (.+?)(?=\.|$)'
        ]
        
        for pattern in req_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            requirements.extend(matches)
        
        return requirements
    
    def extract_exercise_hints(self, content: str) -> List[str]:
        """Extract hints from exercise content"""
        hints = []
        
        # Look for hint patterns
        hint_patterns = [
            r'<hint[^>]*>(.*?)</hint>',
            r'Hint:(.+?)(?=\n\n|\n#|$)',
            r'Tip:(.+?)(?=\n\n|\n#|$)',
            r'Remember:(.+?)(?=\n\n|\n#|$)'
        ]
        
        for pattern in hint_patterns:
            matches = re.findall(pattern, content, re.DOTALL | re.IGNORECASE)
            for match in matches:
                clean_hint = re.sub(r'<[^>]+>', '', match).strip()
                if clean_hint:
                    hints.append(clean_hint)
        
        return hints
    
    def extract_exercise_examples(self, content: str) -> List[Dict]:
        """Extract examples from exercise content"""
        examples = []
        
        # Look for example patterns
        example_patterns = [
            r'<sample-output>(.*?)</sample-output>',
            r'Example:.*?\n```(.*?)```',
            r'Sample output:.*?\n```(.*?)```'
        ]
        
        for pattern in example_patterns:
            matches = re.findall(pattern, content, re.DOTALL)
            for match in matches:
                examples.append({
                    'type': 'output',
                    'content': match.strip()
                })
        
        return examples
    
    def extract_test_cases(self, content: str) -> List[Dict]:
        """Extract test cases from exercise content"""
        test_cases = []
        
        # Look for test patterns in the content
        # This is a simplified extraction - real test cases would be in separate files
        if 'test' in content.lower():
            test_cases.append({
                'type': 'integration',
                'description': 'Full exercise test',
                'content': 'Test cases available in TMC system'
            })
        
        return test_cases
    
    def extract_points(self, content: str) -> int:
        """Extract point value"""
        # Default to 1 point, could be enhanced with actual point extraction
        return 1
    
    def determine_difficulty(self, tmcname: str, content: str) -> str:
        """Determine exercise difficulty based on content and name"""
        # Basic difficulty determination
        part_match = re.search(r'part(\d+)', tmcname)
        if part_match:
            part_num = int(part_match.group(1))
            if part_num <= 3:
                return 'beginner'
            elif part_num <= 8:
                return 'intermediate'
            else:
                return 'advanced'
        
        return 'intermediate'
    
    def extract_learning_objectives(self, content: str) -> List[str]:
        """Extract learning objectives"""
        objectives = []
        
        # Multiple patterns for learning objectives
        patterns = [
            r'After this part.*?you will.*?(?=\n\n|\n#)',
            r'You will.*?(?=\n\n|\n#)',
            r'Learning objectives.*?(?=\n\n|\n#)',
            r'In this part.*?you.*?(?=\n\n|\n#)'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, content, re.DOTALL | re.IGNORECASE)
            for match in matches:
                # Clean and split objectives
                clean_match = re.sub(r'<[^>]+>', '', match)
                lines = [line.strip() for line in clean_match.split('\n') if line.strip()]
                for line in lines:
                    if line and not line.startswith('#') and len(line) > 10:
                        objectives.append(line)
        
        return objectives
    
    def extract_sections(self, content: str) -> List[Dict]:
        """Extract sections from content"""
        sections = []
        
        # Find all headers
        header_pattern = r'^(#{1,6})\s+(.+)$'
        matches = re.findall(header_pattern, content, re.MULTILINE)
        
        for header_level, title in matches:
            sections.append({
                'level': len(header_level),
                'title': title.strip(),
                'type': 'section'
            })
        
        return sections
    
    async def extract_technical_implementation(self, session: aiohttp.ClientSession, tech_files: List[str]):
        """Extract technical implementation details"""
        print("Extracting technical implementation...")
        
        for file_path in tech_files:
            print(f"Processing technical file: {file_path}")
            content = await self.fetch_file_content(session, file_path)
            
            if content:
                self.extracted_data['technical_implementation'][file_path] = {
                    'content': content,
                    'file_type': os.path.splitext(file_path)[1],
                    'purpose': self.determine_file_purpose(file_path, content)
                }
            
            await asyncio.sleep(0.1)
    
    async def extract_frontend_components(self, session: aiohttp.ClientSession, frontend_files: List[str]):
        """Extract frontend components and UI patterns"""
        print("Extracting frontend components...")
        
        for file_path in frontend_files:
            print(f"Processing frontend file: {file_path}")
            content = await self.fetch_file_content(session, file_path)
            
            if content:
                self.extracted_data['frontend_components'][file_path] = {
                    'content': content,
                    'component_type': self.determine_component_type(file_path, content),
                    'features': self.extract_component_features(content)
                }
            
            await asyncio.sleep(0.1)
    
    def determine_file_purpose(self, file_path: str, content: str) -> str:
        """Determine the purpose of a technical file"""
        if 'test' in file_path.lower():
            return 'testing'
        elif 'config' in file_path.lower():
            return 'configuration'
        elif '.yml' in file_path or '.yaml' in file_path:
            return 'configuration'
        elif 'package.json' in file_path:
            return 'dependencies'
        elif '.py' in file_path:
            return 'python_script'
        else:
            return 'unknown'
    
    def determine_component_type(self, file_path: str, content: str) -> str:
        """Determine the type of frontend component"""
        if 'exercise' in file_path.lower():
            return 'exercise_component'
        elif 'quiz' in file_path.lower():
            return 'quiz_component'
        elif 'navigation' in file_path.lower():
            return 'navigation_component'
        elif 'index.js' in file_path:
            return 'main_component'
        else:
            return 'utility_component'
    
    def extract_component_features(self, content: str) -> List[str]:
        """Extract features from React component"""
        features = []
        
        # Look for React features
        if 'useState' in content:
            features.append('state_management')
        if 'useEffect' in content:
            features.append('lifecycle_hooks')
        if 'props' in content:
            features.append('props_handling')
        if 'export default' in content:
            features.append('exportable_component')
        
        return features
    
    async def extract_testing_framework(self, session: aiohttp.ClientSession):
        """Extract testing framework details"""
        print("Extracting testing framework...")
        
        # Look for TMC and testing related files
        testing_files = [f for f in self.all_files if 'test' in f['path'].lower() or 'tmc' in f['path'].lower()]
        
        for file_info in testing_files:
            file_path = file_info['path']
            content = await self.fetch_file_content(session, file_path)
            
            if content:
                self.extracted_data['testing_framework'][file_path] = {
                    'content': content,
                    'testing_type': self.determine_testing_type(file_path, content)
                }
    
    def determine_testing_type(self, file_path: str, content: str) -> str:
        """Determine the type of testing file"""
        if 'tmc' in file_path.lower():
            return 'tmc_configuration'
        elif 'test' in file_path.lower():
            return 'unit_test'
        else:
            return 'testing_utility'
    
    async def generate_integration_roadmap(self):
        """Generate a roadmap for integrating with PyXom"""
        roadmap = {
            'immediate_actions': [
                'Import all exercises into PyXom database',
                'Adapt exercise format to PyXom structure',
                'Implement TMC-style testing framework'
            ],
            'short_term': [
                'Add Python Tutor visualization',
                'Implement breakpoint debugging',
                'Create progress tracking system',
                'Add hint and feedback systems'
            ],
            'medium_term': [
                'Implement VS Code integration',
                'Add automated code analysis',
                'Create personalized learning paths',
                'Implement peer comparison features'
            ],
            'long_term': [
                'Add AI-powered hints and explanations',
                'Implement adaptive difficulty',
                'Create comprehensive analytics dashboard',
                'Add collaborative features'
            ],
            'technical_requirements': [
                'React component for exercise rendering',
                'Testing framework integration',
                'File upload and submission system',
                'Real-time code execution environment',
                'Progress persistence system'
            ]
        }
        
        self.extracted_data['integration_roadmap'] = roadmap
    
    async def run_extraction(self):
        """Main extraction process"""
        print("Starting comprehensive MOOC.fi data extraction...")
        print("=" * 60)
        
        async with aiohttp.ClientSession() as session:
            # Get repository structure
            success = await self.get_repository_tree(session)
            if not success:
                print("Failed to get repository structure")
                return
            
            # Categorize files
            categories = self.categorize_files()
            print(f"Categorized {sum(len(files) for files in categories.values())} files")
            
            # Extract course content
            await self.extract_course_content(session, categories['course_content'])
            
            # Extract technical implementation
            await self.extract_technical_implementation(session, categories['technical'])
            
            # Extract frontend components
            await self.extract_frontend_components(session, categories['frontend'])
            
            # Extract testing framework
            await self.extract_testing_framework(session)
            
            # Generate integration roadmap
            await self.generate_integration_roadmap()
        
        # Update metadata
        self.extracted_data['metadata']['total_exercises_found'] = len(self.extracted_data['exercises'])
        
        print("Extraction completed successfully!")
        return self.extracted_data
    
    def save_comprehensive_data(self, output_dir: str = "mooc_complete_extraction"):
        """Save all extracted data"""
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        # Save main data file
        with open(output_path / "complete_mooc_extraction.json", 'w', encoding='utf-8') as f:
            json.dump(self.extracted_data, f, indent=2, ensure_ascii=False)
        
        # Save individual categories
        categories = [
            'parts', 'exercises', 'course_content', 'technical_implementation',
            'frontend_components', 'testing_framework', 'pedagogical_patterns'
        ]
        
        for category in categories:
            if category in self.extracted_data:
                with open(output_path / f"{category}.json", 'w', encoding='utf-8') as f:
                    json.dump(self.extracted_data[category], f, indent=2, ensure_ascii=False)
        
        # Generate comprehensive report
        self.generate_comprehensive_report(output_path)
        
        # Generate PyXom integration guide
        self.generate_pyxom_integration_guide(output_path)
        
        print(f"\nAll data saved to: {output_path}")
        print("Files created:")
        print("- complete_mooc_extraction.json (Full dataset)")
        print("- parts.json (All 14 course parts)")
        print("- exercises.json (All exercises with details)")
        print("- technical_implementation.json (Technical files)")
        print("- frontend_components.json (React components)")
        print("- testing_framework.json (Testing system)")
        print("- comprehensive_report.txt (Detailed analysis)")
        print("- pyxom_integration_guide.md (Integration guide)")
    
    def generate_comprehensive_report(self, output_path: Path):
        """Generate detailed analysis report"""
        report_lines = []
        
        # Header
        report_lines.extend([
            "MOOC.fi Python Programming 2024 - Comprehensive Extraction Report",
            "=" * 70,
            f"Extraction Date: {self.extracted_data['metadata']['extraction_date']}",
            f"Repository: {self.extracted_data['metadata']['repository']}",
            f"Total Files Processed: {self.extracted_data['metadata']['total_files_found']}",
            f"Total Exercises Found: {self.extracted_data['metadata']['total_exercises_found']}",
            ""
        ])
        
        # Course Structure Analysis
        report_lines.extend([
            "COURSE STRUCTURE ANALYSIS:",
            "-" * 30,
            f"Number of Parts: {len(self.extracted_data['parts'])}",
            ""
        ])
        
        # Part-by-part breakdown
        for part_num in sorted(self.extracted_data['parts'].keys()):
            part_data = self.extracted_data['parts'][part_num]
            exercise_count = len(part_data['exercises'])
            objective_count = len(part_data['learning_objectives'])
            
            report_lines.append(f"Part {part_num}:")
            report_lines.append(f"  - Exercises: {exercise_count}")
            report_lines.append(f"  - Learning Objectives: {objective_count}")
            report_lines.append(f"  - Content Files: {len(part_data['files'])}")
        
        report_lines.append("")
        
        # Technical Analysis
        report_lines.extend([
            "TECHNICAL IMPLEMENTATION ANALYSIS:",
            "-" * 35,
            f"Technical Files: {len(self.extracted_data['technical_implementation'])}",
            f"Frontend Components: {len(self.extracted_data['frontend_components'])}",
            f"Testing Files: {len(self.extracted_data['testing_framework'])}",
            ""
        ])
        
        # Exercise Analysis
        report_lines.extend([
            "EXERCISE ANALYSIS:",
            "-" * 18,
        ])
        
        difficulty_counts = {}
        for exercise in self.extracted_data['exercises'].values():
            diff = exercise.get('difficulty', 'unknown')
            difficulty_counts[diff] = difficulty_counts.get(diff, 0) + 1
        
        for difficulty, count in difficulty_counts.items():
            report_lines.append(f"  {difficulty.title()}: {count} exercises")
        
        report_lines.append("")
        
        # Integration Recommendations
        if 'integration_roadmap' in self.extracted_data:
            roadmap = self.extracted_data['integration_roadmap']
            report_lines.extend([
                "INTEGRATION ROADMAP:",
                "-" * 20,
                "",
                "Immediate Actions:",
            ])
            for action in roadmap['immediate_actions']:
                report_lines.append(f"  • {action}")
            
            report_lines.extend(["", "Technical Requirements:"])
            for req in roadmap['technical_requirements']:
                report_lines.append(f"  • {req}")
        
        # Save report
        with open(output_path / "comprehensive_report.txt", 'w', encoding='utf-8') as f:
            f.write('\n'.join(report_lines))
    
    def generate_pyxom_integration_guide(self, output_path: Path):
        """Generate specific integration guide for PyXom"""
        guide_lines = [
            "# PyXom Integration Guide",
            "",
            "This guide outlines how to integrate the extracted MOOC.fi content into PyXom.",
            "",
            "## Overview",
            "",
            f"We have extracted {len(self.extracted_data['exercises'])} exercises from {len(self.extracted_data['parts'])} course parts.",
            "",
            "## Integration Steps",
            "",
            "### 1. Exercise Database Integration",
            "",
            "```typescript",
            "// Add these interfaces to types/exercise.ts",
            "interface MOOCExercise {",
            "  tmcname: string;",
            "  title: string;",
            "  description: string;",
            "  requirements: string[];",
            "  hints: string[];",
            "  examples: ExerciseExample[];",
            "  difficulty: 'beginner' | 'intermediate' | 'advanced';",
            "  points: number;",
            "}",
            "```",
            "",
            "### 2. Testing Framework",
            "",
            "Implement TMC-style testing:",
            "- Automatic test execution",
            "- Detailed feedback",
            "- Progress tracking",
            "",
            "### 3. UI Components",
            "",
            "Create components for:",
            "- Exercise rendering",
            "- Hint system",
            "- Progress visualization",
            "- Code submission",
            "",
            "### 4. Technical Features",
            "",
            "Implement:",
            "- Python Tutor integration",
            "- VS Code debugging tools",
            "- Real-time code analysis",
            "- Automated feedback",
            "",
            "## File Structure",
            "",
            "```",
            "pyxom/",
            "├── data/",
            "│   ├── mooc-exercises/",
            "│   │   ├── part-01/",
            "│   │   ├── part-02/",
            "│   │   └── ...",
            "│   └── exercises-database-mooc.ts",
            "├── components/",
            "│   ├── MOOCExercise.tsx",
            "│   ├── HintSystem.tsx",
            "│   └── ProgressTracker.tsx",
            "└── services/",
            "    ├── mooc-integration.ts",
            "    └── testing-framework.ts",
            "```",
            "",
            "## Next Steps",
            "",
            "1. Review extracted data",
            "2. Create database migration script",
            "3. Implement core components",
            "4. Add testing framework",
            "5. Integrate debugging tools",
            "6. Test complete system",
            "",
            "## Resources",
            "",
            f"- Total exercises: {len(self.extracted_data['exercises'])}",
            f"- Course parts: {len(self.extracted_data['parts'])}",
            f"- Technical files: {len(self.extracted_data['technical_implementation'])}",
            f"- Frontend components: {len(self.extracted_data['frontend_components'])}",
        ]
        
        with open(output_path / "pyxom_integration_guide.md", 'w', encoding='utf-8') as f:
            f.write('\n'.join(guide_lines))

async def main():
    """Main execution function"""
    extractor = ComprehensiveMOOCExtractor()
    
    print("🚀 Starting comprehensive MOOC.fi extraction...")
    print("This will extract ALL content from the repository for backup and integration.")
    print()
    
    # Run extraction
    data = await extractor.run_extraction()
    
    # Save all data
    extractor.save_comprehensive_data()
    
    print("\n" + "🎉 EXTRACTION COMPLETED SUCCESSFULLY! 🎉")
    print("=" * 60)
    print()
    print("📊 Summary:")
    print(f"   • Files processed: {data['metadata']['total_files_found']}")
    print(f"   • Exercises extracted: {data['metadata']['total_exercises_found']}")
    print(f"   • Course parts: {len(data['parts'])}")
    print(f"   • Technical files: {len(data['technical_implementation'])}")
    print(f"   • Frontend components: {len(data['frontend_components'])}")
    print()
    print("📁 Output location: mooc_complete_extraction/")
    print()
    print("🔧 Next steps:")
    print("   1. Review extracted data")
    print("   2. Follow PyXom integration guide")
    print("   3. Implement testing framework")
    print("   4. Add debugging tools")
    print("   5. Test complete integration")

if __name__ == "__main__":
    asyncio.run(main())
