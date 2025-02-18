import subprocess
import tempfile
import os
import json

class TestRunner:

    def run_tests(self, code, test_cases, language):
        with tempfile.TemporaryDirectory() as temp_dir:
            if language == "python":
                test_file_path = os.path.join(temp_dir, "test_generated.py")
            else:
                test_file_path = os.path.join(temp_dir, f"test_script.{language}")
            
            print(test_cases)
            with open(test_file_path, "w") as test_file:
                test_file.write(test_cases)

            try:
                if language == "python":
                    run_cmd = f"pytest --rootdir={temp_dir} {test_file_path} --disable-warnings"
                elif language == "java":
                    run_cmd = f"mvn test"
                elif language == "javascript":
                    run_cmd = f"jest {test_file_path} --coverage"
                else:
                    return {"error": "Unsupported language for test execution"}
                
                print(f"Running tests in: {temp_dir}")
                print(f"Test file path: {test_file_path}")
                
                result = subprocess.run(
                    run_cmd, shell=True, capture_output=True, text=True, timeout=10
                )
                return result.stdout or result.stderr, {"coverage": "Generated coverage report"}
            except subprocess.TimeoutExpired:
                return {"error": "Test execution timed out"}

