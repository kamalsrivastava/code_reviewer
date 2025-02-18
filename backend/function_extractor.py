import ast
import re

class FunctionExtractor:
    def extract_functions(self, code, language):
        if language == "python":
            return self.extract_python_functions(code)
        elif language == "java":
            return self.extract_java_methods(code)
        elif language == "javascript":
            return self.extract_js_functions(code)
        return []

    def extract_python_functions(self, code):
        functions = []
        tree = ast.parse(code)
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                functions.append({"name": node.name, "parameters": [arg.arg for arg in node.args.args]})
        return functions

    def extract_java_methods(self, code):
        pattern = r"public\s+[\w<>\[\]]+\s+(\w+)\s*\((.*?)\)"
        matches = re.findall(pattern, code)
        return [{"name": match[0], "parameters": match[1].split(',') if match[1] else []} for match in matches]

    def extract_js_functions(self, code):
        pattern = r"function\s+(\w+)\s*\((.*?)\)"
        matches = re.findall(pattern, code)
        return [{"name": match[0], "parameters": match[1].split(',') if match[1] else []} for match in matches]
