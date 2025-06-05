import subprocess
import tempfile
import os
import openai
from config import OPENAI_API_KEY

class CodeReviewer:
    def __init__(self):
        self.api_key = OPENAI_API_KEY
        self.client = openai.OpenAI(api_key=OPENAI_API_KEY)

        self.LANG_TO_LINTER = {
            "python": "pylint",
            "javascript": "eslint",
            "java": "checkstyle",
        }

    def run_static_analysis(self, code, language):
        """Runs static analysis using pylint, eslint, or checkstyle."""
        if language not in self.LANG_TO_LINTER:
            return "Unsupported language for static analysis."

        with tempfile.NamedTemporaryFile(suffix=f".{language}", delete=False) as temp_file:
            temp_file.write(code.encode())
            temp_file_path = temp_file.name

        try:
            if language == "python":
                lint_cmd = f"pylint {temp_file_path} --disable=all --enable=E,W,C,R"
            elif language == "javascript":
                lint_cmd = f"eslint {temp_file_path}"
            elif language == "java":
                lint_cmd = f"checkstyle -c /google_checks.xml {temp_file_path}"

            lint_result = subprocess.run(lint_cmd, shell=True, capture_output=True, text=True)
            return lint_result.stdout or lint_result.stderr

        except Exception as e:
            return f"Error running linter: {str(e)}"

        finally:
            os.remove(temp_file_path)  # Cleanup temp file

    def run_ai_review(self, code, language):
        prompt = f"""
            You are an expert {language} code reviewer. Analyze the following code for:
            - Best practices
            - Efficiency
            - Potential improvements (if necessary)
            
            If the code already follows best practices, is well-optimized, and does not require improvements, respond with exactly:
            "The code is well-optimized and follows best practices. No improvements are necessary."
            
            Otherwise, suggest necessary improvements concisely.
            
            Here is the code:\n\n{code}
        """
        
        try:
            ai_response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "system", "content": "You are an expert code reviewer."},
                        {"role": "user", "content": prompt}]
            )
            return ai_response.choices[0].message.content
        
        except Exception as e:
            return f"Error with AI review: {str(e)}"

    def review_code(self, code, language):
        """Runs both static analysis and AI-based review."""
        lint_results = self.run_static_analysis(code, language)
        ai_suggestions = self.run_ai_review(code, language)

        return {
            "lint_results": lint_results,
            "ai_suggestions": ai_suggestions
        }
