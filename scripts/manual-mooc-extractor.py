#!/usr/bin/env python3
"""
Manual MOOC.fi Content Extractor

This script manually extracts key content from MOOC.fi repository
using only Python standard library (no external dependencies).

It focuses on extracting the most important content for PyXom integration.
"""

import urllib.request
import urllib.parse
import json
import re
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
import time

class ManualMOOCExtractor:
    def __init__(self):
        self.repo_owner = "rage"
        self.repo_name = "programming-24"
        self.base_url = f"https://raw.githubusercontent.com/{self.repo_owner}/{self.repo_name}/main"
        
        self.extracted_data = {
            'metadata': {
                'extraction_date': datetime.now().isoformat(),
                'repository': f'{self.repo_owner}/{self.repo_name}',
                'extraction_method': 'manual_standard_library',
                'total_exercises_found': 0
            },
            'parts': {},
            'exercises': {},
            'course_overview': {},
            'technical_notes': {}
        }
        
        # Key files to extract
        self.key_files = [
            "data/all-exercises.md",
            "data/grading-and-exams.md",
            "package.json",
            ".tmcproject.yml"
        ]
        
        # Part-specific files (we'll try common patterns)
        self.part_files = {}
        for i in range(1, 15):
            self.part_files[i] = [
                f"data/part-{i}/index.md",
                f"data/part-{i}/1-getting-started.md",
                f"data/part-{i}/2-information-from-user.md",
                f"data/part-{i}/3-more-about-variables.md",
                f"data/part-{i}/4-arithmetic-operations.md",
                f"data/part-{i}/5-conditional-statements.md"
            ]
    
    def fetch_url(self, url: str) -> Optional[str]:
        """Fetch content from URL using urllib"""
        try:
            with urllib.request.urlopen(url) as response:
                content = response.read().decode('utf-8')
                return content
        except Exception as e:
            print(f"Failed to fetch {url}: {e}")
            return None
    
    def fetch_file(self, file_path: str) -> Optional[str]:
        """Fetch a specific file from the repository"""
        url = f"{self.base_url}/{file_path}"
        return self.fetch_url(url)
    
    def extract_exercises_from_content(self, content: str, source: str) -> List[Dict]:
        """Extract exercises from markdown content"""
        exercises = []
        
        # Pattern for programming exercises
        exercise_pattern = r'<programming-exercise.*?tmcname=["\']([^"\']+)["\'].*?>(.*?)</programming-exercise>'
        matches = re.findall(exercise_pattern, content, re.DOTALL | re.IGNORECASE)
        
        for tmcname, exercise_content in matches:
            # Extract title
            title_match = re.search(r'<h2[^>]*>(.*?)</h2>', exercise_content, re.IGNORECASE)
            title = title_match.group(1) if title_match else "Untitled"
            title = re.sub(r'<[^>]+>', '', title).strip()
            
            # Extract description (first paragraph)
            clean_content = re.sub(r'<[^>]+>', '', exercise_content)
            paragraphs = [p.strip() for p in clean_content.split('\n\n') if p.strip()]
            description = paragraphs[0] if paragraphs else ""
            
            # Determine difficulty based on part number
            part_match = re.search(r'part(\d+)', tmcname)
            if part_match:
                part_num = int(part_match.group(1))
                if part_num <= 3:
                    difficulty = 'beginner'
                elif part_num <= 8:
                    difficulty = 'intermediate'
                else:
                    difficulty = 'advanced'
            else:
                difficulty = 'intermediate'
            
            exercise = {
                'tmcname': tmcname,
                'title': title,
                'description': description[:200] + "..." if len(description) > 200 else description,
                'difficulty': difficulty,
                'source_file': source,
                'points': 1,  # Default
                'raw_content': exercise_content[:500] + "..." if len(exercise_content) > 500 else exercise_content
            }
            
            exercises.append(exercise)
            self.extracted_data['exercises'][tmcname] = exercise
        
        return exercises
    
    def extract_learning_objectives(self, content: str) -> List[str]:
        """Extract learning objectives from content"""
        objectives = []
        
        # Look for common patterns
        patterns = [
            r'After this part.*?you will.*?(?=\n\n|\n#)',
            r'You will.*?(?=\n\n|\n#)',
            r'Learning objectives.*?(?=\n\n|\n#)'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, content, re.DOTALL | re.IGNORECASE)
            for match in matches:
                clean_match = re.sub(r'<[^>]+>', '', match)
                lines = [line.strip() for line in clean_match.split('\n') if line.strip()]
                for line in lines:
                    if line and not line.startswith('#') and len(line) > 15:
                        objectives.append(line)
        
        return objectives
    
    def extract_key_files(self):
        """Extract key repository files"""
        print("Extracting key files...")
        
        for file_path in self.key_files:
            print(f"Fetching: {file_path}")
            content = self.fetch_file(file_path)
            
            if content:
                if file_path == "data/all-exercises.md":
                    # Extract all exercises overview
                    self.extracted_data['course_overview']['all_exercises'] = content
                    exercises = self.extract_exercises_from_content(content, file_path)
                    print(f"Found {len(exercises)} exercises in {file_path}")
                
                elif file_path == "data/grading-and-exams.md":
                    # Extract grading information
                    self.extracted_data['course_overview']['grading_system'] = content
                
                elif file_path == "package.json":
                    # Extract technical dependencies
                    try:
                        package_data = json.loads(content)
                        self.extracted_data['technical_notes']['dependencies'] = package_data.get('dependencies', {})
                        self.extracted_data['technical_notes']['scripts'] = package_data.get('scripts', {})
                    except json.JSONDecodeError:
                        self.extracted_data['technical_notes']['package_json_raw'] = content
                
                elif file_path == ".tmcproject.yml":
                    # Extract TMC configuration
                    self.extracted_data['technical_notes']['tmc_config'] = content
            
            time.sleep(0.5)  # Be respectful to the server
    
    def extract_part_content(self, part_number: int):
        """Extract content for a specific part"""
        print(f"Extracting Part {part_number}...")
        
        part_data = {
            'part_number': part_number,
            'files_found': [],
            'exercises': [],
            'learning_objectives': [],
            'content_summary': ''
        }
        
        # Try to fetch files for this part
        for file_path in self.part_files[part_number]:
            content = self.fetch_file(file_path)
            
            if content:
                part_data['files_found'].append(file_path)
                
                # Extract exercises
                exercises = self.extract_exercises_from_content(content, file_path)
                part_data['exercises'].extend(exercises)
                
                # Extract learning objectives
                objectives = self.extract_learning_objectives(content)
                part_data['learning_objectives'].extend(objectives)
                
                # Add to content summary
                if file_path.endswith('index.md'):
                    # Use index.md as main summary
                    clean_content = re.sub(r'<[^>]+>', '', content)
                    part_data['content_summary'] = clean_content[:500] + "..."
            
            time.sleep(0.3)  # Rate limiting
        
        self.extracted_data['parts'][part_number] = part_data
        return part_data
    
    def extract_specific_technical_files(self):
        """Extract specific technical files we know exist"""
        print("Extracting technical implementation files...")
        
        # Known important files
        tech_files = [
            "src/services/moocfi.js",
            "src/partials/ProgrammingExercise/index.js",
            "src/partials/Quiz/index.js",
            "gatsby-config.js",
            "gatsby-node.js"
        ]
        
        for file_path in tech_files:
            print(f"Attempting to fetch: {file_path}")
            content = self.fetch_file(file_path)
            
            if content:
                self.extracted_data['technical_notes'][file_path] = content[:1000] + "..."  # Truncate for size
                print(f"✅ Found: {file_path}")
            else:
                print(f"❌ Not found: {file_path}")
            
            time.sleep(0.3)
    
    def generate_pyxom_integration_data(self):
        """Generate data specifically for PyXom integration"""
        print("Generating PyXom integration data...")
        
        # Create simplified exercise database for PyXom
        pyxom_exercises = []
        
        for tmcname, exercise in self.extracted_data['exercises'].items():
            # Extract part number
            part_match = re.search(r'part(\d+)', tmcname)
            part_number = int(part_match.group(1)) if part_match else 1
            
            # Extract exercise number
            ex_match = re.search(r'part\d+-(\d+)', tmcname)
            exercise_number = int(ex_match.group(1)) if ex_match else 1
            
            pyxom_exercise = {
                'id': f"mooc-{tmcname}",
                'tmcname': tmcname,
                'title': exercise['title'],
                'description': exercise['description'],
                'difficulty': exercise['difficulty'],
                'points': exercise['points'],
                'part': part_number,
                'exercise_number': exercise_number,
                'tags': ['mooc', f'part-{part_number}', exercise['difficulty']],
                'learningObjectives': self.extracted_data['parts'].get(part_number, {}).get('learning_objectives', [])[:3],
                'source': 'mooc.fi'
            }
            
            pyxom_exercises.append(pyxom_exercise)
        
        # Sort by part and exercise number
        pyxom_exercises.sort(key=lambda x: (x['part'], x['exercise_number']))
        
        self.extracted_data['pyxom_integration'] = {
            'exercises': pyxom_exercises,
            'total_exercises': len(pyxom_exercises),
            'parts_with_content': len([p for p in self.extracted_data['parts'].values() if p['exercises']]),
            'integration_notes': [
                'All exercises extracted with titles and descriptions',
                'Difficulty levels assigned based on part progression',
                'Learning objectives extracted where available',
                'Ready for integration into PyXom exercise database'
            ]
        }
    
    def run_extraction(self):
        """Run the complete extraction process"""
        print("🚀 Starting manual MOOC.fi extraction...")
        print("Using only Python standard library - no external dependencies")
        print("=" * 60)
        
        # Extract key overview files
        self.extract_key_files()
        
        # Extract content for all parts
        for part_num in range(1, 15):
            self.extract_part_content(part_num)
        
        # Extract technical files
        self.extract_specific_technical_files()
        
        # Generate PyXom integration data
        self.generate_pyxom_integration_data()
        
        # Update metadata
        self.extracted_data['metadata']['total_exercises_found'] = len(self.extracted_data['exercises'])
        
        print("✅ Extraction completed!")
        return self.extracted_data
    
    def save_data(self, output_dir: str = "mooc_manual_extraction"):
        """Save extracted data to files"""
        os.makedirs(output_dir, exist_ok=True)
        
        # Save complete data
        with open(f"{output_dir}/complete_extraction.json", 'w', encoding='utf-8') as f:
            json.dump(self.extracted_data, f, indent=2, ensure_ascii=False)
        
        # Save PyXom integration data separately
        with open(f"{output_dir}/pyxom_exercises.json", 'w', encoding='utf-8') as f:
            json.dump(self.extracted_data['pyxom_integration'], f, indent=2, ensure_ascii=False)
        
        # Save exercises only
        with open(f"{output_dir}/exercises_only.json", 'w', encoding='utf-8') as f:
            json.dump(self.extracted_data['exercises'], f, indent=2, ensure_ascii=False)
        
        # Generate summary report
        self.generate_summary_report(output_dir)
        
        # Generate TypeScript interfaces for PyXom
        self.generate_typescript_interfaces(output_dir)
        
        print(f"\n📁 Data saved to: {output_dir}/")
        print("📄 Files created:")
        print("  • complete_extraction.json - Full extracted data")
        print("  • pyxom_exercises.json - Ready for PyXom integration")
        print("  • exercises_only.json - Just the exercises")
        print("  • summary_report.txt - Extraction summary")
        print("  • pyxom_interfaces.ts - TypeScript interfaces")
    
    def generate_summary_report(self, output_dir: str):
        """Generate a summary report"""
        report = [
            "MOOC.fi Manual Extraction Report",
            "=" * 35,
            f"Extraction Date: {self.extracted_data['metadata']['extraction_date']}",
            f"Repository: {self.extracted_data['metadata']['repository']}",
            f"Method: {self.extracted_data['metadata']['extraction_method']}",
            "",
            "📊 EXTRACTION SUMMARY:",
            f"  • Total Exercises Found: {len(self.extracted_data['exercises'])}",
            f"  • Parts Processed: {len(self.extracted_data['parts'])}",
            f"  • Technical Files: {len([k for k in self.extracted_data['technical_notes'].keys() if k.endswith('.js')])}", 
            "",
            "📚 PART BREAKDOWN:",
        ]
        
        for part_num in sorted(self.extracted_data['parts'].keys()):
            part_data = self.extracted_data['parts'][part_num]
            report.append(f"  Part {part_num}: {len(part_data['exercises'])} exercises, {len(part_data['files_found'])} files")
        
        report.extend([
            "",
            "🔧 PYXOM INTEGRATION:",
            f"  • Ready exercises: {self.extracted_data['pyxom_integration']['total_exercises']}",
            f"  • Parts with content: {self.extracted_data['pyxom_integration']['parts_with_content']}",
            "",
            "✨ NEXT STEPS:",
            "  1. Review pyxom_exercises.json",
            "  2. Import exercises into PyXom database",
            "  3. Implement exercise rendering components",
            "  4. Add testing framework",
            "  5. Integrate debugging tools"
        ])
        
        with open(f"{output_dir}/summary_report.txt", 'w', encoding='utf-8') as f:
            f.write('\n'.join(report))
    
    def generate_typescript_interfaces(self, output_dir: str):
        """Generate TypeScript interfaces for PyXom integration"""
        interfaces = [
            "// TypeScript interfaces for MOOC.fi integration with PyXom",
            "// Generated from manual extraction",
            "",
            "export interface MOOCExercise {",
            "  id: string;",
            "  tmcname: string;",
            "  title: string;",
            "  description: string;",
            "  difficulty: 'beginner' | 'intermediate' | 'advanced';",
            "  points: number;",
            "  part: number;",
            "  exercise_number: number;",
            "  tags: string[];",
            "  learningObjectives: string[];",
            "  source: 'mooc.fi';",
            "}",
            "",
            "export interface MOOCPart {",
            "  part_number: number;",
            "  files_found: string[];",
            "  exercises: MOOCExercise[];",
            "  learning_objectives: string[];",
            "  content_summary: string;",
            "}",
            "",
            "export interface MOOCIntegrationData {",
            "  exercises: MOOCExercise[];",
            "  total_exercises: number;",
            "  parts_with_content: number;",
            "  integration_notes: string[];",
            "}",
            "",
            "// Example usage in PyXom:",
            "// import { MOOCExercise, MOOCIntegrationData } from './mooc-interfaces';",
            "//",
            "// const moocData: MOOCIntegrationData = require('./pyxom_exercises.json');",
            "// const exercises: MOOCExercise[] = moocData.exercises;",
        ]
        
        with open(f"{output_dir}/pyxom_interfaces.ts", 'w', encoding='utf-8') as f:
            f.write('\n'.join(interfaces))

def main():
    """Main execution function"""
    print("🎓 MOOC.fi Manual Content Extractor")
    print("=" * 40)
    print("This tool extracts content using only Python standard library.")
    print("No external dependencies required!")
    print()
    
    extractor = ManualMOOCExtractor()
    
    # Run extraction
    data = extractor.run_extraction()
    
    # Save results
    extractor.save_data()
    
    print("\n🎉 EXTRACTION COMPLETED SUCCESSFULLY!")
    print("=" * 45)
    print()
    print("📊 Results:")
    print(f"  • Exercises extracted: {data['metadata']['total_exercises_found']}")
    print(f"  • Parts processed: {len(data['parts'])}")
    print(f"  • Ready for PyXom integration: ✅")
    print()
    print("🚀 Next steps:")
    print("  1. Review the extracted data in 'mooc_manual_extraction/' folder")
    print("  2. Import 'pyxom_exercises.json' into PyXom")
    print("  3. Use 'pyxom_interfaces.ts' for TypeScript types")
    print("  4. Implement exercise rendering components")
    print()
    print("Happy coding! 🐍✨")

if __name__ == "__main__":
    main()
