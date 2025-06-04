#!/usr/bin/env python3
"""
MOOC.fi Python Programming 2024 - Complete Data Extraction Tool

This script extracts all exercises, content, learning objectives, and pedagogical 
features from the University of Helsinki's Python Programming MOOC 2024.

Repository: https://github.com/rage/programming-24

The extracted data will be saved in multiple formats for backup and integration
with PyXom's learning platform.
"""

import requests
import json
import re
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
import time

class MOOCDataExtractor:
    def __init__(self):
        self.base_url = "https://api.github.com/repos/rage/programming-24"
        self.raw_base_url = "https://raw.githubusercontent.com/rage/programming-24/main"
        self.headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'PyXom-MOOC-Extractor/1.0'
        }
        self.extracted_data = {
            'metadata': {
                'extraction_date': datetime.now().isoformat(),
                'repository': 'rage/programming-24',
                'total_parts': 14,
                'extraction_version': '1.0'
            },
            'course_structure': {},
            'exercises': {},
            'learning_objectives': {},
            'content': {},
            'technical_features': {},
            'pedagogical_features': {}
        }
        
    def rate_limit_sleep(self):
        """Sleep to respect GitHub API rate limits"""
        time.sleep(1)
        
    def fetch_github_content(self, path: str) -> Optional[str]:
        """Fetch content from GitHub repository"""
        try:
            url = f"{self.raw_base_url}/{path}"
            response = requests.get(url, headers=self.headers)
            if response.status_code == 200:
                return response.text
            else:
                print(f"Failed to fetch {path}: {response.status_code}")
                return None
        except Exception as e:
            print(f"Error fetching {path}: {e}")
            return None
    
    def extract_course_structure(self):
        """Extract the complete course structure"""
        print("Extracting course structure...")
        
        # Extract main course structure from all-exercises.md
        content = self.fetch_github_content("data/all-exercises.md")
        if content:
            self.extracted_data['course_structure']['all_exercises'] = content
            
        # Extract grading and exam information
        grading_content = self.fetch_github_content("data/grading-and-exams.md")
        if grading_content:
            self.extracted_data['course_structure']['grading_system'] = grading_content
            
        self.rate_limit_sleep()
    
    def extract_part_content(self, part_number: int):
        """Extract content for a specific part"""
        print(f"Extracting Part {part_number} content...")
        
        part_paths = [
            f"data/part-{part_number}/index.md",
            f"data/part-{part_number}/1-getting-started.md",
            f"data/part-{part_number}/2-information-from-user.md",
            f"data/part-{part_number}/3-more-about-variables.md",
            f"data/part-{part_number}/4-arithmetic-operations.md",
            f"data/part-{part_number}/5-conditional-statements.md"
        ]
        
        part_data = {
            'part_number': part_number,
            'content_files': {},
            'exercises': [],
            'learning_objectives': [],
            'sections': []
        }
        
        # Try to fetch all possible content files for this part
        for i in range(1, 10):  # Most parts have up to 8-9 sections
            section_paths = [
                f"data/part-{part_number}/{i}-*.md",
                f"data/part-{part_number}/part-{i}.md",
                f"data/part-{part_number}/section-{i}.md"
            ]
            
            # Try different naming patterns
            potential_files = [
                f"data/part-{part_number}/index.md",
                f"data/part-{part_number}/1-getting-started.md",
                f"data/part-{part_number}/2-programming-terminology.md",
                f"data/part-{part_number}/3-more-loops.md",
                f"data/part-{part_number}/4-definite-iteration.md",
                f"data/part-{part_number}/5-lists.md",
                f"data/part-{part_number}/6-reading-files.md",
                f"data/part-{part_number}/7-modules.md",
                f"data/part-{part_number}/8-objects-and-methods.md"
            ]
            
        # Fetch main index file
        index_content = self.fetch_github_content(f"data/part-{part_number}/index.md")
        if index_content:
            part_data['content_files']['index'] = index_content
            # Extract learning objectives from index
            objectives = self.extract_learning_objectives(index_content)
            part_data['learning_objectives'] = objectives
            
        self.extracted_data['content'][f'part_{part_number}'] = part_data
        self.rate_limit_sleep()
    
    def extract_learning_objectives(self, content: str) -> List[str]:
        """Extract learning objectives from content"""
        objectives = []
        
        # Pattern for learning objectives
        patterns = [
            r"After this part you will.*?(?=\n\n|\n#)",
            r"You will.*?(?=\n\n|\n#)",
            r"Learning objectives.*?(?=\n\n|\n#)",
            r"In this part.*?(?=\n\n|\n#)"
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, content, re.DOTALL | re.IGNORECASE)
            for match in matches:
                # Split into individual objectives
                lines = [line.strip() for line in match.split('\n') if line.strip()]
                for line in lines:
                    if line and not line.startswith('#'):
                        objectives.append(line)
        
        return objectives
    
    def extract_exercises_from_content(self, content: str) -> List[Dict]:
        """Extract exercise information from content"""
        exercises = []
        
        # Pattern for programming exercises
        exercise_pattern = r'<programming-exercise.*?tmcname=["\']([^"\']+)["\'].*?>(.*?)</programming-exercise>'
        
        matches = re.findall(exercise_pattern, content, re.DOTALL)
        
        for tmcname, exercise_content in matches:
            exercise = {
                'tmcname': tmcname,
                'content': exercise_content.strip(),
                'title': self.extract_title(exercise_content),
                'description': self.extract_description(exercise_content),
                'points': self.extract_points(exercise_content)
            }
            exercises.append(exercise)
            
        return exercises
    
    def extract_title(self, content: str) -> str:
        """Extract exercise title"""
        title_match = re.search(r'<h2[^>]*>(.*?)</h2>', content, re.IGNORECASE)
        if title_match:
            return title_match.group(1).strip()
        return "Untitled Exercise"
    
    def extract_description(self, content: str) -> str:
        """Extract exercise description"""
        # Remove HTML tags and get clean text
        clean_content = re.sub(r'<[^>]+>', '', content)
        # Get first paragraph as description
        paragraphs = clean_content.split('\n\n')
        return paragraphs[0].strip() if paragraphs else ""
    
    def extract_points(self, content: str) -> int:
        """Extract point value from exercise"""
        # Default point value
        return 1
    
    def extract_technical_features(self):
        """Extract technical implementation details"""
        print("Extracting technical features...")
        
        # Extract TMC configuration
        tmc_config = self.fetch_github_content(".tmcproject.yml")
        if tmc_config:
            self.extracted_data['technical_features']['tmc_config'] = tmc_config
            
        # Extract package.json for frontend features
        package_json = self.fetch_github_content("package.json")
        if package_json:
            self.extracted_data['technical_features']['package_json'] = package_json
            
        # Extract service configurations
        moocfi_service = self.fetch_github_content("src/services/moocfi.js")
        if moocfi_service:
            self.extracted_data['technical_features']['moocfi_service'] = moocfi_service
            
        self.rate_limit_sleep()
    
    def extract_pedagogical_features(self):
        """Extract pedagogical and educational features"""
        print("Extracting pedagogical features...")
        
        # Extract programming exercise component
        prog_exercise = self.fetch_github_content("src/partials/ProgrammingExercise/index.js")
        if prog_exercise:
            self.extracted_data['pedagogical_features']['programming_exercise_component'] = prog_exercise
            
        # Extract quiz components
        quiz_content = self.fetch_github_content("src/partials/Quiz/index.js")
        if quiz_content:
            self.extracted_data['pedagogical_features']['quiz_component'] = quiz_content
            
        # Extract Python tutor integration
        python_tutor = self.fetch_github_content("static/python-tutor.html")
        if python_tutor:
            self.extracted_data['pedagogical_features']['python_tutor'] = python_tutor
            
        self.rate_limit_sleep()
    
    def extract_debugging_tools(self):
        """Extract debugging tools and features"""
        print("Extracting debugging tools...")
        
        # Extract VS Code configuration
        vscode_config = self.fetch_github_content(".vscode/settings.json")
        if vscode_config:
            self.extracted_data['technical_features']['vscode_settings'] = vscode_config
            
        # Extract debugging examples
        debug_examples = self.fetch_github_content("data/part-4/2-debugging.md")
        if debug_examples:
            self.extracted_data['pedagogical_features']['debugging_guide'] = debug_examples
            
        self.rate_limit_sleep()
    
    def extract_all_data(self):
        """Main method to extract all data"""
        print("Starting MOOC.fi data extraction...")
        print("=" * 50)
        
        # Extract course structure
        self.extract_course_structure()
        
        # Extract content for all 14 parts
        for part_num in range(1, 15):
            self.extract_part_content(part_num)
            
        # Extract technical features
        self.extract_technical_features()
        
        # Extract pedagogical features
        self.extract_pedagogical_features()
        
        # Extract debugging tools
        self.extract_debugging_tools()
        
        print("Data extraction completed!")
        return self.extracted_data
    
    def save_data(self, output_dir: str = "mooc_extracted_data"):
        """Save extracted data to files"""
        os.makedirs(output_dir, exist_ok=True)
        
        # Save complete data as JSON
        with open(f"{output_dir}/complete_mooc_data.json", 'w', encoding='utf-8') as f:
            json.dump(self.extracted_data, f, indent=2, ensure_ascii=False)
        
        # Save exercises separately
        with open(f"{output_dir}/exercises_database.json", 'w', encoding='utf-8') as f:
            json.dump(self.extracted_data['exercises'], f, indent=2, ensure_ascii=False)
        
        # Save learning objectives
        with open(f"{output_dir}/learning_objectives.json", 'w', encoding='utf-8') as f:
            json.dump(self.extracted_data['learning_objectives'], f, indent=2, ensure_ascii=False)
        
        # Save technical features
        with open(f"{output_dir}/technical_features.json", 'w', encoding='utf-8') as f:
            json.dump(self.extracted_data['technical_features'], f, indent=2, ensure_ascii=False)
        
        # Save pedagogical features
        with open(f"{output_dir}/pedagogical_features.json", 'w', encoding='utf-8') as f:
            json.dump(self.extracted_data['pedagogical_features'], f, indent=2, ensure_ascii=False)
        
        # Generate summary report
        self.generate_summary_report(output_dir)
        
        print(f"Data saved to {output_dir}/")
    
    def generate_summary_report(self, output_dir: str):
        """Generate a summary report of extracted data"""
        report = []
        report.append("MOOC.fi Python Programming 2024 - Data Extraction Report")
        report.append("=" * 60)
        report.append(f"Extraction Date: {self.extracted_data['metadata']['extraction_date']}")
        report.append(f"Repository: {self.extracted_data['metadata']['repository']}")
        report.append("")
        
        # Course structure summary
        report.append("COURSE STRUCTURE:")
        report.append("-" * 20)
        report.append(f"Total Parts: {self.extracted_data['metadata']['total_parts']}")
        
        # Content summary
        content_count = len(self.extracted_data['content'])
        report.append(f"Parts with extracted content: {content_count}")
        
        # Technical features summary
        tech_features = len(self.extracted_data['technical_features'])
        report.append(f"Technical features extracted: {tech_features}")
        
        # Pedagogical features summary
        ped_features = len(self.extracted_data['pedagogical_features'])
        report.append(f"Pedagogical features extracted: {ped_features}")
        
        report.append("")
        report.append("TECHNICAL FEATURES FOUND:")
        report.append("-" * 25)
        for feature in self.extracted_data['technical_features'].keys():
            report.append(f"- {feature}")
        
        report.append("")
        report.append("PEDAGOGICAL FEATURES FOUND:")
        report.append("-" * 28)
        for feature in self.extracted_data['pedagogical_features'].keys():
            report.append(f"- {feature}")
        
        report.append("")
        report.append("INTEGRATION RECOMMENDATIONS:")
        report.append("-" * 30)
        report.append("1. Import exercises into PyXom's exercise database")
        report.append("2. Implement TMC-style testing system")
        report.append("3. Add Python Tutor visualization")
        report.append("4. Implement VS Code integration features")
        report.append("5. Add breakpoint debugging tools")
        report.append("6. Create progress tracking system")
        report.append("7. Implement hint and feedback systems")
        
        # Save report
        with open(f"{output_dir}/extraction_report.txt", 'w', encoding='utf-8') as f:
            f.write('\n'.join(report))

def main():
    """Main function to run the extraction"""
    extractor = MOOCDataExtractor()
    
    # Extract all data
    data = extractor.extract_all_data()
    
    # Save to files
    extractor.save_data()
    
    print("\n" + "=" * 50)
    print("EXTRACTION COMPLETE!")
    print("=" * 50)
    print("Data saved to: mooc_extracted_data/")
    print("Files created:")
    print("- complete_mooc_data.json (Complete dataset)")
    print("- exercises_database.json (All exercises)")
    print("- learning_objectives.json (Learning objectives)")
    print("- technical_features.json (Technical implementation)")
    print("- pedagogical_features.json (Educational features)")
    print("- extraction_report.txt (Summary report)")
    print("\nNext steps:")
    print("1. Review extracted data")
    print("2. Integrate with PyXom's existing database")
    print("3. Implement missing features")
    print("4. Test integration")

if __name__ == "__main__":
    main()
