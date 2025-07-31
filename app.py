from flask import Flask, render_template, request, redirect, url_for
import os
import pandas as pd
from ml.processor import process_dataset

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files.get('dataset')
        if file and file.filename.endswith('.csv'):
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(filepath)
            return redirect(url_for('dashboard', filename=file.filename))
        else:
            return "Invalid file type. Please upload a CSV file.", 400
    return render_template('index.html')

@app.route('/dashboard/<filename>')
def dashboard(filename):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(filepath):
        return "File not found.", 404

    df = pd.read_csv(filepath)
    insights = process_dataset(df)

    return render_template('dashboard.html', insights=insights)

if __name__ == '__main__':
    app.run(debug=True)
