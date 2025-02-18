import openai
from config import OPENAI_API_KEY

class TestGenerator:
    def __init__(self):
        self.client = openai.OpenAI(api_key=OPENAI_API_KEY)

    def generate_tests(self, code, language, functions):

        # prompt = f"""
        #     You are an expert unit test generator.

        #     Generate a complete and fully executable test file in {language} for the following functions:

        #     {functions}

        #     - The test file should be valid and free of errors.
        #     - It should contain all necessary imports and setup.
        #     - Include tests covering valid inputs, edge cases, and exceptions.
        #     - Ensure proper assertions and best practices for testing in {language}.
        #     - Do not include any explanations, comments, theory, or Markdown formatting—only raw {language} code.

        #     Return only the test file as plain text.
        # """

        # prompt = f"""
        # You are an expert unit test generator.

        # Generate unit tests for the following functions in {language}:

        # {functions}

        # ### Output Format:
        # Return a JSON structure representing the test file with these fields:
        # ```json
        # {
        #     "imports": ["unittest", "my_module"],
        #     "setup": "class TestSetup: ...",
        #     "tests": [
        #         {
        #             "class_name": "Test_MyFunction",
        #             "methods": [
        #                 {
        #                     "name": "test_valid_input",
        #                     "code": "self.assertEqual(my_function(5), expected_result)"
        #                 },
        #                 {
        #                     "name": "test_invalid_input",
        #                     "code": "with self.assertRaises(ValueError): my_function(-1)"
        #                 }
        #             ]
        #         }
        #     ],
        #     "execution": "if __name__ == '__main__': unittest.main()"
        # }
        # """
        prompt = (
            "You are an expert unit test generator.\n\n"
            f"Generate unit tests for the following functions in {language}:\n\n"
            f"{functions}\n\n"
            "### Output Format:\n"
            "Return a JSON structure representing the test file with these fields:\n"
            "{\n"
            '    "imports": ["unittest", "my_module"],\n'
            '    "setup": "class TestSetup: ...",\n'
            '    "tests": [\n'
            "        {\n"
            '            "class_name": "Test_MyFunction",\n'
            '            "methods": [\n'
            "                {\n"
            '                    "name": "test_valid_input",\n'
            '                    "code": "self.assertEqual(my_function(5), expected_result)"\n'
            "                },\n"
            "                {\n"
            '                    "name": "test_invalid_input",\n'
            '                    "code": "with self.assertRaises(ValueError): my_function(-1)"\n'
            "                }\n"
            "            ]\n"
            "        }\n"
            "    ],\n"
            '    "execution": "if __name__ == \'__main__\': unittest.main()"\n'
            "}"
        )


        try:
            ai_response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "system", "content": "You are an expert unit test generator."},
                        {"role": "user", "content": prompt}]
            )
            return ai_response.choices[0].message.content
        
        except Exception as e:
            return {"error": f"Error generating test cases: {str(e)}"}
