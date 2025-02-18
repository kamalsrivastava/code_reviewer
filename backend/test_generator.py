import openai
from config import OPENAI_API_KEY
import re

class TestGenerator:
    def __init__(self):
        self.client = openai.OpenAI(api_key=OPENAI_API_KEY)

    def generate_tests(self, code, language, functions):
        prompt = f"""
            You are an expert unit test generator.

            Generate a complete and fully executable test file in {language} for the following functions:

            {functions}

            - The test file should be valid and free of errors.
            - It should contain all necessary imports and setup.
            - Include tests covering valid inputs, edge cases, and exceptions.
            - Ensure proper assertions and best practices for testing in {language}.
            - Return only the test file as plain text. Do not include any explanations, comments, or markdown formatting.

            IMPORTANT: Ensure the response contains only valid, runnable {language} code.
        """

        try:
            ai_response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "system", "content": "You are an expert unit test generator."},
                        {"role": "user", "content": prompt}]
            )
            test_code = ai_response.choices[0].message.content

            # **Step 1: Remove Markdown formatting (if present)**
            test_code_cleaned = re.sub(r"^```[\w+]*\n?|```$", "", test_code, flags=re.MULTILINE)

            # **Step 2: Remove any text after 'unittest.main()'**
            test_code_cleaned = re.sub(r'if __name__ == ["\']__main__["\']:\s*unittest\.main\(\)\s*.*', 
                                    'if __name__ == "__main__":\n    unittest.main()', 
                                    test_code_cleaned, 
                                    flags=re.DOTALL)

            # **Step 3: Remove any additional text (heuristic cleanup)**
            test_code_cleaned = test_code_cleaned.strip()
            test_code_cleaned = re.split(r'\n(?=[A-Z])', test_code_cleaned)[0]  # Remove trailing non-code lines

            return test_code_cleaned

        except Exception as e:
            return {"error": f"Error generating test cases: {str(e)}"}
