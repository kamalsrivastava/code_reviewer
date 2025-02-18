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
            
            if language != "python":
                with open(test_file_path, "w") as test_file:
                    test_file.write(test_cases)
            
            if language == "python":
                try:
                    test_json = json.loads(test_cases)  # Ensure it's a dictionary
                except json.JSONDecodeError:
                    return {"error": "Invalid JSON format in test cases"}
                
                test_code = self.generate_python_test(test_json)
                with open(test_file_path, "w") as test_file:
                    test_file.write(test_code)

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
            
    def generate_python_test(self, json_data):
        imports = "\n".join(f"import {imp}" for imp in json_data.get("imports", []))
        setup_code = json_data.get("setup", "")

        test_classes = []
        for test in json_data.get("tests", []):
            class_name = test.get("class_name", "TestClass")
            methods = "\n".join(
                f"    def {method.get('name', 'test_case')}(self):\n        {method.get('code', 'pass')}"
                for method in test.get("methods", [])
            )
            test_classes.append(f"class {class_name}(unittest.TestCase):\n{methods}")

        execution_code = json_data.get("execution", "")
        
        test_script = (
            f"{imports}\n\n"
            f"{setup_code}\n\n"
            + "\n\n".join(test_classes) + "\n\n"
            f"{execution_code}"
        )

        return test_script
