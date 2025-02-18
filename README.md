# AI-Powered Automated Code Reviewer & Test Generator

## **Overview**
This project is an **AI-powered automated code reviewer and unit test generator** that leverages **OpenAI's GPT-4** to generate unit tests for Python, Java, and JavaScript functions. The system ensures that test files are:
- Fully executable
- Free of errors
- Cover valid inputs, edge cases, and exceptions
- Generated in a structured format based on best testing practices

Additionally, the project includes a **test runner** that executes the generated tests using `pytest` (for Python), `Maven` (for Java), and `Jest` (for JavaScript).

---

## **Features**
✔️ Generates **fully executable** unit tests for Python, Java, and JavaScript  
✔️ Uses **GPT-4** to generate high-quality tests with appropriate assertions  
✔️ Covers **valid inputs, boundary cases, and exception handling**  
✔️ Executes the generated test cases and returns test results  

---

## **Installation**

### **1. Clone the Repository**
```sh
git clone https://github.com/kamalsrivastava/code_reviewer.git
cd code_reviewer
```

### **2. Set Up a Virtual Environment**
```sh
cd backend
python -m venv venv
source venv/bin/activate  # On Mac/Linux
venv\Scripts\activate     # On Windows
```

### **3. Install Dependencies**
- **Frontend**:
     ```bash
     cd frontend
     npm install
     ```
- **Backend**:
  ```bash
  venv\scripts\activate
  cd backend
  pip install -r requirements.txt
  ```
### **4. Set Up OpenAI API Key**
Create a `.env` file in the project root and add your OpenAI API key:
```
OPENAI_API_KEY=your-api-key-here
```
Alternatively, update `config.py`:
```python
OPENAI_API_KEY = "your-api-key-here"
```

### **5. Run the Application**
- **Backend**:
     ```bash
     cd backend
     python -m flask run
     ```
 - **Frontend**:
   ```bash
   cd frontend
   npm start
   ```

---

## **Project Structure**
### Backend
```
📂 backend
│── 📂 config          # Configuration files (API keys, environment variables)
│── test_generator.py  # AI-powered test case generator using OpenAI API
│── test_runner.py     # Executes test cases and generates reports
│── code_reviewer.py   # AI-powered code-review
│── app.py             # Flask-based API for test generation and execution and code-review
│── requirements.txt   # Python dependencies
│── README.md          # Project documentation
│── .env               # Environment variables (OpenAI API key)
```

### Frontend
```plaintext
/frontend
├── /public
│   └── index.html                # Main HTML file
├── /src
│   ├── /components
│   │   ├── LeftSide.js       
│   │   ├── RightSide.js    
│   ├── App.js                    # Main React app component
│   ├── index.js                  # React entry point
│   └── /styles
│       └── App.css               # Styling file
├── package.json                  # React project dependencies
└── .env                          # Environment variables (API keys, etc.)
```


---

## **How It Works**
1. **Test Generation**:
   - `CodeReviewer` sends a structured prompt to **GPT-4**.
   - GPT-4 responds with a **Code Review suggesting changes if required**.
   - `TestGenerator` sends a structured prompt to **GPT-4**.
   - GPT-4 responds with a **fully executable test file**.
   - The test file includes all necessary imports, test cases, and edge case handling.

2. **Test Execution**:
   - `TestRunner` writes the generated test cases to a temporary file.
   - Runs the test using:
     - `pytest` for Python
     - `mvn test` for Java
     - `jest` for JavaScript
   - Returns the test results and code coverage.

---

## **Troubleshooting**
### **1. Test Cases Are Not Being Generated**
- Ensure that the OpenAI API key is set in `.env` or `config.py`.
- Verify that you have an active internet connection.

### **2. Test Execution Fails**
- Make sure `pytest`, `mvn`, or `jest` is installed.
- Check the `test_cases` output to ensure it contains valid code.
- If using a temporary directory, print the test file path for debugging.

### **3. OpenAI API Rate Limits**
- If your API calls exceed the limit, wait a few minutes and try again.
- Consider upgrading your OpenAI API plan for higher rate limits.

---

## **Contributing**
If you'd like to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to your branch (`git push origin feature-branch`).
5. Create a Pull Request.

---

## **License**
This project is licensed under the **MIT License**.

---

## **Contact**
📧 Email: krishnakamal2908@gmail.com  
🐙 GitHub: kamalsrivastava  
```

