import { getPyodideInstance } from '@/utils/pythonRunner';

export async function runFlake8(code: string): Promise<string[]> {
  const py = await getPyodideInstance();
  await py.runPythonAsync(`
import micropip, sys, json, textwrap
try:
    import flake8
except ImportError:
    await micropip.install('flake8==6.1.0')
from flake8.api import legacy as flk
style_guide = flk.get_style_guide(max_line_length=120)
report = style_guide.input_file('-', textwrap.dedent("""${code}"""))
violations = [f"{v[0]}:{v[1]} {v[2]}" for v in report._application.file_checker_manager.report._results]
sys.stdout.write(json.dumps(violations))
`);
  return JSON.parse(py.stdout);
}
