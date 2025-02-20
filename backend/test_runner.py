import subprocess
import tempfile
import os
import json
import re

class TestRunner:

    def run_tests(self, code, test_cases, language):
        with tempfile.TemporaryDirectory() as temp_dir:
            if language == "python":
                test_file_path = os.path.join(temp_dir, "test_generated.py")
            elif language == "javascript":
                # Ensure tests are inside __tests__
                test_dir = os.path.join(temp_dir, "__tests__")
                os.makedirs(test_dir, exist_ok=True)
                test_file_path = os.path.join(test_dir, "test_script.test.mjs")
            else:
                test_file_path = os.path.join(temp_dir, f"test_script.{language}")
            
            print("The code being tested is: \n", test_cases)
            with open(test_file_path, "w") as test_file:
                test_file.write(test_cases)

            try:
                if language == "python":
                    run_cmd = f"pytest --rootdir={temp_dir} {test_file_path} --disable-warnings"
                elif language == "java":
                    # Create a basic Maven project structure
                    os.makedirs(os.path.join(temp_dir, "src", "test", "java"), exist_ok=True)
                    
                    # Create a minimal pom.xml
                    pom_content = """<project xmlns="http://maven.apache.org/POM/4.0.0"
                                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
                        <modelVersion>4.0.0</modelVersion>
                        <groupId>com.example</groupId>
                        <artifactId>test-project</artifactId>
                        <version>1.0-SNAPSHOT</version>
                        <dependencies>
                            <dependency>
                                <groupId>org.junit.jupiter</groupId>
                                <artifactId>junit-jupiter-api</artifactId>
                                <version>5.8.1</version>
                                <scope>test</scope>
                            </dependency>
                            <dependency>
                                <groupId>org.junit.jupiter</groupId>
                                <artifactId>junit-jupiter-engine</artifactId>
                                <version>5.8.1</version>
                            </dependency>
                        </dependencies>
                        <build>
                            <plugins>
                                <plugin>
                                    <groupId>org.apache.maven.plugins</groupId>
                                    <artifactId>maven-surefire-plugin</artifactId>
                                    <version>3.0.0-M5</version>
                                </plugin>
                            </plugins>
                        </build>
                    </project>"""

                    # Write the pom.xml file
                    pom_file_path = os.path.join(temp_dir, "pom.xml")
                    with open(pom_file_path, "w") as pom_file:
                        pom_file.write(pom_content)

                    match = re.search(r"public\s+class\s+(\w+)", test_cases)
                    test_class_name = match.group(1) if match else "TestClass"

                    # Write the test file inside the proper directory
                    java_test_dir = os.path.join(temp_dir, "src", "test", "java")
                    os.makedirs(java_test_dir, exist_ok=True)
                    test_file_path = os.path.join(java_test_dir, f"{test_class_name}.java")
                    
                    with open(test_file_path, "w") as test_file:
                        test_file.write(test_cases)

                    # run_cmd = f"cd {temp_dir} && mvn test"
                    run_cmd = ["mvn", "test"]

                elif language == "javascript":
                    print("[INFO] Setting up JavaScript test environment.")

                    # Initialize an npm project first to ensure package.json exists
                    npm_init_cmd = "npm init -y"
                    subprocess.run(npm_init_cmd, shell=True, cwd=temp_dir, capture_output=True, text=True)

                    # Install Mocha and Chai properly
                    npm_install_cmd = "npm install mocha chai sinon --save-dev"
                    npm_result = subprocess.run(npm_install_cmd, shell=True, cwd=temp_dir, capture_output=True, text=True)

                    if npm_result.returncode != 0:
                        print(f"[ERROR] Failed to install Mocha/Chai: {npm_result.stderr}")
                        return f"NPM setup failed: {npm_result.stderr}", {"coverage": "No coverage report Generated"}

                    print("[SUCCESS] Mocha and Chai installed successfully.")

                    # Run Mocha on the test file
                    run_cmd = f"npx mocha {test_file_path} --reporter=json"

                    print(f"[INFO] Running JavaScript tests with command: {run_cmd}")
                else:
                    return {"error": "Unsupported language for test execution"}, {"coverage": "No coverage report Generated"}
                
                print(f"Running tests in: {temp_dir}")
                print(f"Test file path: {test_file_path}")
                
                print(f"[INFO] Executing command: {run_cmd}")
                if(language != "javascript"):
                    result = subprocess.run(
                        run_cmd, cwd=temp_dir, shell=True, capture_output=True, text=True, timeout=10
                    )
                else:
                    result = subprocess.run(
                        run_cmd, cwd=temp_dir, shell=True, capture_output=True, text=True, timeout=30
                    )

                print(f"[INFO] Test execution completed.")
                return result.stdout or result.stderr if(result.stdout or result.stderr) else "No Output", {"coverage": "Generated coverage report"}
            except subprocess.TimeoutExpired:
                print("[ERROR] Test execution timed out after 10 seconds.")
                return "Test execution timed out", {"coverage": "No coverage report Generated"}
            except Exception as e:
                print(f"[ERROR] Exception occurred during test execution: {e}")
                return f"Error executing tests: {str(e)}", {"coverage": "No coverage report Generated"}


