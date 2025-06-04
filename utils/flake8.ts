import { getPyodideInstance } from '@/utils/pythonRunner';

export async function runFlake8(code: string): Promise<string[]> {
  try {
    const py = await getPyodideInstance();
    
    // Set up capture for output
    py.runPython(`
import sys
from io import StringIO
output_capture = StringIO()
`);

    await py.runPython(`
import micropip
try:
    import flake8
except ImportError:
    await micropip.install('flake8==6.1.0')
    import flake8

from flake8.api import legacy as flk
import json
import textwrap

style_guide = flk.get_style_guide(max_line_length=120)
code_to_check = textwrap.dedent("""${code.replace(/"/g, '\\"')}""")

# Redirect stdout to capture
original_stdout = sys.stdout
sys.stdout = output_capture

try:
    report = style_guide.input_file('-', code_to_check)
    violations = []
    # Get violations from the report
    if hasattr(report, '_application') and hasattr(report._application, 'file_checker_manager'):
        for result in report._application.file_checker_manager.report._results:
            violations.append(f"{result[0]}:{result[1]} {result[2]}")
    
    print(json.dumps(violations))
finally:
    sys.stdout = original_stdout
`);

    const output = py.runPython('output_capture.getvalue()');
    return JSON.parse(output || '[]');
  } catch (error) {
    console.error('Error running flake8:', error);
    return [];
  }
}
