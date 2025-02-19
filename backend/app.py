import re
from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import tempfile
import os
from code_reviewer import CodeReviewer
from test_generator import TestGenerator
from test_runner import TestRunner
from function_extractor import FunctionExtractor

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

LANGUAGES = {
    "python": {"extension": ".py", "command": "python"},
    "java": {"extension": ".java", "command": "javac"},
    "javascript": {"extension": ".js", "command": "node"},
}

def extract_java_class_name(code):
    """Extracts the Java class name using regex"""
    match = re.search(r"\bclass\s+(\w+)", code)
    return match.group(1) if match else None

@app.route("/", methods=["GET"])
def hello():
    return jsonify({ "output": "Welcome to the Flask API" })

@app.route("/review", methods=["POST"])
def code_review():
    code_reviewer = CodeReviewer()
    data = request.json
    code = data.get("code", "")
    language = data.get("language", "python")

    if not code or not language:
        return jsonify({"error": "Code and language are required"}), 400

    review_results = code_reviewer.review_code(code, language)
    return jsonify(review_results)

@app.route("/execute", methods=["POST"])
def execute_code():
    data = request.json
    code = data.get("code", "")
    language = data.get("language", "python")

    if language not in LANGUAGES:
        return jsonify({"error": "Unsupported language"}), 400

    ext = LANGUAGES[language]["extension"]

    with tempfile.TemporaryDirectory() as temp_dir:
        if language == "java":
            class_name = extract_java_class_name(code)
            print(class_name)
            if not class_name:
                return jsonify({"error": "No valid Java class found."}), 400

            file_path = os.path.join(temp_dir, f"{class_name}{ext}")
        else:
            file_path = os.path.join(temp_dir, f"temp_script{ext}")

        # Write the code to a temporary file
        with open(file_path, "w") as temp_file:
            temp_file.write(code)

        try:
            if language == "java":
                class_name = extract_java_class_name(code)
                if not class_name:
                    return jsonify({"error": "No valid Java class found."}), 400

                compile_cmd = f"javac {file_path}"
                compile_proc = subprocess.run(
                    compile_cmd, shell=True, capture_output=True, text=True
                )

                if compile_proc.returncode != 0:
                    return jsonify({"output": compile_proc.stderr})

                run_cmd = f"java -cp {temp_dir} {class_name}"

            elif language == "javascript":
                run_cmd = f"node {file_path}"

            else:
                run_cmd = f"{LANGUAGES[language]['command']} {file_path}"

            result = subprocess.run(
                run_cmd, shell=True, capture_output=True, text=True, timeout=5
            )

            return jsonify({"output": result.stdout or result.stderr})

        except subprocess.TimeoutExpired:
            return jsonify({"error": "Code execution timed out"}), 400

@app.route("/test", methods=["POST"])
def test_code():
    data = request.json
    code = data.get("code", "")  
    language = data.get("language", "python")

    if not code or not language:
        return jsonify({"error": "Code and language are required"}), 400
    
    # Step 1: Extract Functions from Code
    function_extractor = FunctionExtractor()
    functions = function_extractor.extract_functions(code, language)
    
    # Step 3: Generate AI-Powered Unit Tests
    test_generator = TestGenerator()
    test_cases = test_generator.generate_tests(code, language, functions)
    
    if isinstance(test_cases, dict) and "error" in test_cases:
        return jsonify({"error": test_cases["error"]}), 400
    
    # Step 4: Execute the Generated Tests
    test_runner = TestRunner()
    # test_results, coverage_report = test_runner.run_tests(code, test_cases, language)
    test_results, coverage_report = test_runner.run_tests(code, test_cases, language)
    
    # Step 5: Return Unified JSON Response
    return jsonify({
        "test_cases": test_cases,
        "test_results": test_results,
        "coverage_report": coverage_report
    })

if __name__ == "__main__":
    app.run(debug=True)
