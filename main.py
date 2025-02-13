from flask import Flask, render_template, request, jsonify
import subprocess
import os

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/compile", methods=["POST"])
def compile_code():
    data = request.json
    code = data.get("code", "")
    user_input = data.get("input", "")

    file_path = os.path.join(UPLOAD_FOLDER, "Main.java")
    with open(file_path, "w") as file:
        file.write(code)

    try:
        # Compile Java code
        compile_result = subprocess.run(["javac", file_path], capture_output=True, text=True)
        if compile_result.returncode != 0:
            return jsonify({"output": compile_result.stderr})

        # Run Java program
        run_result = subprocess.run(["java", "-cp", UPLOAD_FOLDER, "Main"], input=user_input,
                                    capture_output=True, text=True)
        return jsonify({"output": run_result.stdout if run_result.returncode == 0 else run_result.stderr})

    except Exception as e:
        return jsonify({"output": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
