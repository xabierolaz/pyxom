#!/usr/bin/env python3
"""
MOOC.fi Extraction Runner

This script installs dependencies and runs the comprehensive data extraction.
"""

import subprocess
import sys
import os
from pathlib import Path

def install_dependencies():
    """Install required Python packages"""
    print("Installing required dependencies...")
    
    packages = [
        'aiohttp',
        'asyncio',
        'pathlib'
    ]
    
    for package in packages:
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
            print(f"✅ Installed {package}")
        except subprocess.CalledProcessError:
            print(f"❌ Failed to install {package}")
            return False
    
    return True

def run_extraction():
    """Run the comprehensive extraction script"""
    script_dir = Path(__file__).parent
    extractor_script = script_dir / "comprehensive-mooc-extractor.py"
    
    if not extractor_script.exists():
        print("❌ Extraction script not found!")
        return False
    
    try:
        print("🚀 Running comprehensive MOOC extraction...")
        subprocess.check_call([sys.executable, str(extractor_script)])
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Extraction failed: {e}")
        return False

def main():
    print("MOOC.fi Data Extraction Setup and Runner")
    print("=" * 45)
    print()
    
    # Install dependencies
    if not install_dependencies():
        print("Failed to install dependencies")
        return 1
    
    print()
    print("Dependencies installed successfully!")
    print()
    
    # Run extraction
    if not run_extraction():
        print("Extraction failed")
        return 1
    
    print()
    print("🎉 Complete! Data extraction finished successfully.")
    print()
    print("Check the 'mooc_complete_extraction' folder for all extracted data.")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
