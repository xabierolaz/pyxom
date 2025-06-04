#!/usr/bin/env python3
"""
Advanced MOOC.fi Exercise Content Extractor

This script focuses on extracting the actual exercise content from individual
exercise files in the MOOC.fi repository, going beyond the index files.

The goal is to find and extract:
1. Individual exercise descriptions
2. Starter code and templates
3. Test cases and requirements
4. Hints and examples
5. Full exercise specifications

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

class AdvancedMOOCExtractor:
    def __init__(self):
        self.repo_owner = "rage"
        self.repo_name = "programming-24"
        self.api_base = f"https://api.github.com/repos/{self.repo_owner}/{self.repo_name}"
        self.raw_base = f"https://raw.githubusercontent.com/{self.repo_owner}/{self.repo_name}/main"
        
        self.headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'PyXom-Advanced-MOOC-Extractor/1.0'
        }
        
        self.extracted_data = {
            'metadata': {
                'extraction_date': datetime.now().isoformat(),
                'repository': f'{self.repo_owner}/{self.repo_name}',
                'extraction_method': 'advanced_content_extraction',
                'total_files_analyzed': 0,
                'total_exercises_found': 0,
                'extraction_strategy': 'comprehensive_file_analysis'
            },
            'repository_files': [],
            'exercise_content': {},  # Full exercise content by tmcname
            'starter_code': {},     # Starter code templates
            'test_cases': {},       # Test case data
            'exercise_metadata': {} # Additional metadata
        }
        
        self.exercise_patterns = [
            # Common exercise file patterns
            r'part\d+-\d+.*\.md$',
            r'.*exercise.*\.md$',
            r'.*programming.*\.md$',
            r'.*assignment.*\.md$'
        ]
        
        self.content_files = []
        self.all_files = []

    async def fetch_repository_tree(self, session: aiohttp.ClientSession):
        """Get complete repository file structure"""
        print("🔍 Fetching complete repository structure...")
        
        url = f"{self.api_base}/git/trees/main?recursive=1"
        async with session.get(url, headers=self.headers) as response:
            if response.status == 200:
                data = await response.json()
                self.all_files = data['tree']
                self.extracted_data['metadata']['total_files_analyzed'] = len(self.all_files)
                print(f"📁 Found {len(self.all_files)} files in repository")
                return True
            else:
                print(f"❌ Failed to fetch repository tree: {response.status}")
                return False

    def categorize_content_files(self):
        """Categorize files to identify exercise content"""
        print("📋 Categorizing content files...")
        
        categories = {
            'part_directories': [],
            'markdown_files': [],
            'exercise_files': [],
            'data_files': [],
            'programming_exercises': [],
            'test_files': [],
            'src_files': []
        }
        
        for file_obj in self.all_files:
            path = file_obj['path']
            
            # Part directories
            if path.startswith('data/part-') and file_obj['type'] == 'tree':
                categories['part_directories'].append(path)
            
            # Markdown files in parts
            elif path.startswith('data/part-') and path.endswith('.md'):
                categories['markdown_files'].append(path)
                
                # Check if it matches exercise patterns
                for pattern in self.exercise_patterns:
                    if re.search(pattern, path):
                        categories['exercise_files'].append(path)
                        break
            
            # Programming exercise indicators
            elif 'programming-exercise' in path.lower():
                categories['programming_exercises'].append(path)
            
            # Test files
            elif 'test' in path.lower() and path.endswith('.py'):
                categories['test_files'].append(path)
            
            # Source files
            elif path.startswith('src/') and path.endswith(('.py', '.js', '.ts')):
                categories['src_files'].append(path)
        
        # Print categorization results
        for category, files in categories.items():
            print(f"  {category}: {len(files)} files")
            if files and len(files) <= 10:  # Show examples for small lists
                for file in files[:5]:
                    print(f"    - {file}")
        
        self.content_categories = categories
        return categories

    async def fetch_file_content(self, session: aiohttp.ClientSession, file_path: str) -> Optional[str]:
        """Fetch content of a specific file"""
        url = f"{self.raw_base}/{file_path}"
        try:
            async with session.get(url) as response:
                if response.status == 200:
                    return await response.text()
                else:
                    print(f"⚠️  Failed to fetch {file_path}: {response.status}")
                    return None
        except Exception as e:
            print(f"❌ Error fetching {file_path}: {e}")
            return None

    async def analyze_part_structure(self, session: aiohttp.ClientSession):
        """Analyze the structure of each part directory"""
        print("🔬 Analyzing part structure for exercise discovery...")
        
        # Get all markdown files in part directories
        part_files = [f for f in self.content_categories['markdown_files'] if f.startswith('data/part-')]
        
        exercises_found = 0
        
        for file_path in part_files:
            print(f"📄 Analyzing: {file_path}")
            content = await self.fetch_file_content(session, file_path)
            
            if content:
                # Extract exercises from this file
                exercises = self.extract_exercises_from_markdown(content, file_path)
                
                if exercises:
                    exercises_found += len(exercises)
                    print(f"  ✅ Found {len(exercises)} exercises")
                    
                    # Store exercise content
                    for exercise in exercises:
                        self.extracted_data['exercise_content'][exercise['tmcname']] = exercise
                else:
                    print(f"  ℹ️  No exercises found in this file")
            
            # Rate limiting
            await asyncio.sleep(0.2)
        
        print(f"🎯 Total exercises extracted: {exercises_found}")
        self.extracted_data['metadata']['total_exercises_found'] = exercises_found
        
        return exercises_found

    def extract_exercises_from_markdown(self, content: str, file_path: str) -> List[Dict]:
        """Extract programming exercises from markdown content"""
        exercises = []
        
        # Pattern for programming exercises with tmcname
        exercise_pattern = r'<programming-exercise[^>]*?tmcname=["\']([^"\']+)["\'][^>]*?>(.*?)</programming-exercise>'
        matches = re.findall(exercise_pattern, content, re.DOTALL | re.IGNORECASE)
        
        for tmcname, exercise_content in matches:
            exercise = {
                'tmcname': tmcname,
                'source_file': file_path,
                'raw_content': exercise_content.strip(),
                'title': self.extract_title(exercise_content),
                'description': self.extract_description(exercise_content),
                'requirements': self.extract_requirements(exercise_content),
                'hints': self.extract_hints(exercise_content),
                'examples': self.extract_examples(exercise_content),
                'starter_code': self.extract_starter_code(exercise_content),
                'test_cases': self.extract_test_cases(exercise_content),
                'points': self.extract_points(exercise_content),
                'difficulty': self.determine_difficulty(tmcname),
                'part_number': self.extract_part_number(file_path),
                'extraction_timestamp': datetime.now().isoformat()
            }
            exercises.append(exercise)
        
        # Also look for exercise blocks without programming-exercise tags
        # Look for tmcname references in various formats
        tmcname_pattern = r'tmcname[:\s]*["\']?([a-zA-Z0-9_-]+)["\']?'
        tmcname_matches = re.findall(tmcname_pattern, content)
        
        for tmcname in tmcname_matches:
            if tmcname not in [ex['tmcname'] for ex in exercises]:
                # Try to extract context around this tmcname
                context = self.extract_context_around_tmcname(content, tmcname)
                if context:
                    exercise = {
                        'tmcname': tmcname,
                        'source_file': file_path,
                        'raw_content': context,
                        'title': tmcname.replace('_', ' ').title(),
                        'description': self.extract_description(context),
                        'requirements': [],
                        'hints': [],
                        'examples': [],
                        'starter_code': '',
                        'test_cases': [],
                        'points': 1,
                        'difficulty': self.determine_difficulty(tmcname),
                        'part_number': self.extract_part_number(file_path),
                        'extraction_timestamp': datetime.now().isoformat()
                    }
                    exercises.append(exercise)
        
        return exercises

    def extract_context_around_tmcname(self, content: str, tmcname: str) -> str:
        """Extract context around a tmcname reference"""
        lines = content.split('\n')
        tmcname_line = -1
        
        for i, line in enumerate(lines):
            if tmcname in line:
                tmcname_line = i
                break
        
        if tmcname_line >= 0:
            # Extract context (10 lines before and after)
            start = max(0, tmcname_line - 10)
            end = min(len(lines), tmcname_line + 10)
            return '\n'.join(lines[start:end])
        
        return ""

    def extract_title(self, content: str) -> str:
        """Extract exercise title"""
        # Look for title in various formats
        patterns = [
            r'<h[1-6][^>]*>(.*?)</h[1-6]>',
            r'#{1,6}\s*(.+?)$',
            r'title[:\s]*["\']?([^"\'\n]+)["\']?',
            r'<title[^>]*>(.*?)</title>'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, content, re.MULTILINE | re.IGNORECASE)
            if match:
                title = match.group(1).strip()
                if title and len(title) < 100:  # Reasonable title length
                    return title
        
        return "Untitled Exercise"

    def extract_description(self, content: str) -> str:
        """Extract exercise description"""
        # Remove HTML tags and get text content
        text = re.sub(r'<[^>]+>', '', content)
        
        # Split into paragraphs and find meaningful content
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        
        if paragraphs:
            # Return first substantial paragraph as description
            for para in paragraphs:
                if len(para) > 20 and not para.startswith('#'):
                    return para[:500] + ("..." if len(para) > 500 else "")
        
        return "No description available"

    def extract_requirements(self, content: str) -> List[str]:
        """Extract exercise requirements"""
        requirements = []
        
        # Look for bullet points or numbered lists
        patterns = [
            r'[-*]\s*(.+?)(?=\n|$)',
            r'\d+\.\s*(.+?)(?=\n|$)',
            r'•\s*(.+?)(?=\n|$)'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, content, re.MULTILINE)
            requirements.extend([m.strip() for m in matches if len(m.strip()) > 10])
        
        return requirements[:10]  # Limit to 10 requirements

    def extract_hints(self, content: str) -> List[str]:
        """Extract hints from content"""
        hints = []
        
        # Look for hint sections
        hint_patterns = [
            r'hint[:\s]*(.+?)(?=\n\n|\n[A-Z]|$)',
            r'tip[:\s]*(.+?)(?=\n\n|\n[A-Z]|$)',
            r'note[:\s]*(.+?)(?=\n\n|\n[A-Z]|$)'
        ]
        
        for pattern in hint_patterns:
            matches = re.findall(pattern, content, re.MULTILINE | re.IGNORECASE)
            hints.extend([m.strip() for m in matches])
        
        return hints

    def extract_examples(self, content: str) -> List[str]:
        """Extract code examples"""
        examples = []
        
        # Look for code blocks
        code_patterns = [
            r'```python\n(.*?)\n```',
            r'```\n(.*?)\n```',
            r'<code[^>]*>(.*?)</code>'
        ]
        
        for pattern in code_patterns:
            matches = re.findall(pattern, content, re.DOTALL)
            examples.extend([m.strip() for m in matches if m.strip()])
        
        return examples

    def extract_starter_code(self, content: str) -> str:
        """Extract starter code template"""
        # Look for starter code or template sections
        starter_patterns = [
            r'starter[^:]*:(.*?)(?=\n\n|\n[A-Z]|$)',
            r'template[^:]*:(.*?)(?=\n\n|\n[A-Z]|$)',
            r'```python\n(.*?)\n```'
        ]
        
        for pattern in starter_patterns:
            match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return ""

    def extract_test_cases(self, content: str) -> List[str]:
        """Extract test cases from content"""
        test_cases = []
        
        # Look for test or example sections
        test_patterns = [
            r'test[^:]*:(.*?)(?=\n\n|\n[A-Z]|$)',
            r'example[^:]*:(.*?)(?=\n\n|\n[A-Z]|$)',
            r'output[^:]*:(.*?)(?=\n\n|\n[A-Z]|$)'
        ]
        
        for pattern in test_patterns:
            matches = re.findall(pattern, content, re.MULTILINE | re.IGNORECASE)
            test_cases.extend([m.strip() for m in matches])
        
        return test_cases

    def extract_points(self, content: str) -> int:
        """Extract point value"""
        point_pattern = r'points?[:\s]*(\d+)'
        match = re.search(point_pattern, content, re.IGNORECASE)
        if match:
            return int(match.group(1))
        return 1  # Default

    def determine_difficulty(self, tmcname: str) -> str:
        """Determine difficulty based on tmcname"""
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

    def extract_part_number(self, file_path: str) -> int:
        """Extract part number from file path"""
        match = re.search(r'part-(\d+)', file_path)
        if match:
            return int(match.group(1))
        return 1

    async def save_extraction_results(self):
        """Save extraction results to files"""
        print("💾 Saving extraction results...")
        
        # Ensure output directory exists
        output_dir = Path("c:/Users/xabie/Desktop/pyxom/mooc_advanced_extraction")
        output_dir.mkdir(exist_ok=True)
        
        # Save complete extraction data
        with open(output_dir / "advanced_extraction.json", 'w', encoding='utf-8') as f:
            json.dump(self.extracted_data, f, indent=2, ensure_ascii=False)
        
        # Save just the exercises for easy access
        exercises_only = {
            'metadata': self.extracted_data['metadata'],
            'exercises': self.extracted_data['exercise_content']
        }
        with open(output_dir / "exercises_complete.json", 'w', encoding='utf-8') as f:
            json.dump(exercises_only, f, indent=2, ensure_ascii=False)
        
        # Generate summary report
        self.generate_summary_report(output_dir)
        
        print(f"✅ Results saved to: {output_dir}")

    def generate_summary_report(self, output_dir: Path):
        """Generate human-readable summary report"""
        exercises = self.extracted_data['exercise_content']
        
        report = f"""Advanced MOOC.fi Exercise Extraction Report
===========================================
Extraction Date: {self.extracted_data['metadata']['extraction_date']}
Repository: {self.extracted_data['metadata']['repository']}
Method: {self.extracted_data['metadata']['extraction_method']}

📊 EXTRACTION SUMMARY:
  • Total Files Analyzed: {self.extracted_data['metadata']['total_files_analyzed']}
  • Total Exercises Found: {self.extracted_data['metadata']['total_exercises_found']}
  • Extraction Strategy: {self.extracted_data['metadata']['extraction_strategy']}

📚 EXERCISE BREAKDOWN BY PART:
"""
        
        # Group exercises by part
        part_exercises = {}
        for tmcname, exercise in exercises.items():
            part = exercise['part_number']
            if part not in part_exercises:
                part_exercises[part] = []
            part_exercises[part].append(exercise)
        
        for part in sorted(part_exercises.keys()):
            exercises_in_part = part_exercises[part]
            report += f"  Part {part}: {len(exercises_in_part)} exercises\n"
            for ex in exercises_in_part[:3]:  # Show first 3 as examples
                report += f"    - {ex['tmcname']}: {ex['title']}\n"
            if len(exercises_in_part) > 3:
                report += f"    ... and {len(exercises_in_part) - 3} more\n"
        
        report += f"""
🔧 CONTENT ANALYSIS:
  • Exercises with descriptions: {sum(1 for ex in exercises.values() if ex['description'] != 'No description available')}
  • Exercises with requirements: {sum(1 for ex in exercises.values() if ex['requirements'])}
  • Exercises with hints: {sum(1 for ex in exercises.values() if ex['hints'])}
  • Exercises with examples: {sum(1 for ex in exercises.values() if ex['examples'])}
  • Exercises with starter code: {sum(1 for ex in exercises.values() if ex['starter_code'])}

✨ NEXT STEPS:
  1. Review exercises_complete.json for detailed content
  2. Integrate extracted exercises into PyXom
  3. Implement exercise rendering system
  4. Add missing content manually if needed
  5. Set up automated content updates
"""
        
        with open(output_dir / "advanced_extraction_report.txt", 'w', encoding='utf-8') as f:
            f.write(report)

async def main():
    """Main execution function"""
    print("🚀 Starting Advanced MOOC.fi Exercise Extraction")
    print("=" * 50)
    
    extractor = AdvancedMOOCExtractor()
    
    async with aiohttp.ClientSession() as session:
        # Step 1: Get repository structure
        success = await extractor.fetch_repository_tree(session)
        if not success:
            print("❌ Failed to fetch repository structure")
            return
        
        # Step 2: Categorize files
        extractor.categorize_content_files()
        
        # Step 3: Analyze parts and extract exercises
        exercises_found = await extractor.analyze_part_structure(session)
        
        # Step 4: Save results
        await extractor.save_extraction_results()
        
        print(f"\n🎉 Extraction completed!")
        print(f"📈 Found {exercises_found} exercises")
        print(f"📁 Results saved to mooc_advanced_extraction/")

if __name__ == "__main__":
    asyncio.run(main())
