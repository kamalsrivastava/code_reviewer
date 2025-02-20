import openai
from config import OPENAI_API_KEY
import re

class TestGenerator:
    def __init__(self):
        self.client = openai.OpenAI(api_key=OPENAI_API_KEY)

    def extract_class_name(self, code):
        """Extracts the Java class name from the provided Java code."""
        match = re.search(r"\bclass\s+(\w+)", code)
        return match.group(1) if match else None
    
    def generate_tests(self, code, language, functions):
        if(language == 'python'):
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
        elif language == 'java':
            class_name = self.extract_class_name(code)
            prompt = f"""
                You are an expert Java unit test generator.

                **Task:**
                Generate a complete and fully executable JUnit 5 test file for the given Java class.

                **Instructions:**
                - The test file should contain **only valid Java code**.
                - The provided class **must be embedded inside the test file**.
                - The class **must not be static** to avoid compilation issues.
                - Each assertion **must be inside its own `@Test` method**.
                - Ensure **all edge cases and exception handling** are tested.
                - Use proper **JUnit 5 annotations** (`@Test`, `@BeforeEach`, etc.).
                - Import necessary **JUnit libraries** (`org.junit.jupiter.api.*`).
                - Do not include **explanations, comments, or markdown formatting**.
                
                **Expected Output Format:**
                ```java
                import org.junit.jupiter.api.Test;
                import static org.junit.jupiter.api.Assertions.*;

                public class {class_name}Test {{

                    // ✅ Embed the provided class here
                    {code}

                    @Test
                    public void testValidInput() {{
                        {class_name} obj = new {class_name}();
                        assertEquals(expectedOutput, obj.methodName(validInput));
                    }}

                    @Test
                    public void testEdgeCase() {{
                        {class_name} obj = new {class_name}();
                        assertEquals(expectedOutput, obj.methodName(edgeCaseInput));
                    }}

                    @Test
                    public void testInvalidInput() {{
                        {class_name} obj = new {class_name}();
                        assertThrows(ExpectedException.class, () -> obj.methodName(invalidInput));
                    }}
                }}
                ```
            """

        else:
            prompt = f"""
                You are an expert JavaScript unit test generator.

                Generate a complete and fully executable test file for the given JavaScript code using Mocha and Chai.

                **Code to be tested:**
                ```javascript
                {code}
                ```

                **Instructions:**
                - The test file must **embed the provided code inside it**.
                - Use Mocha (`describe`, `it`) and Chai (`expect`).
                - Do not use require use only ES6 conventions
                - Include tests for **valid inputs, edge cases, and exceptions**.
                - Use Sinon.js for spies/mocks where needed.
                - Return **only valid JavaScript code** (no explanations, comments, or markdown formatting).

                **Example Test File Output Format:**
                ```javascript
                import describe, it from "mocha";
                import expect from "chai";
                import sinon from "sinon";

                // Embed the provided code
                {code}

                describe('Functionality Tests', () => {{

                    it('Valid case', () => {{
                        expect(functionName(validInput)).to.equal(expectedOutput);
                    }});

                    it('Edge case', () => {{
                        expect(functionName(edgeCaseInput)).to.equal(expectedOutput);
                    }});

                    it('Exception case', () => {{
                        expect(() => functionName(invalidInput)).to.throw();
                    }});

                }});
                ```

                **Return only valid JavaScript code, nothing else.**
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
