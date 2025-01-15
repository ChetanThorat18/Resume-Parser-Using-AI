from flask import Flask, jsonify, request
from calculate_score import calculate_matching_scores
from processor import process_all_pdfs, extract_resume_info
from flask_cors import CORS
import os
from init import download_resumes_and_jd 

app = Flask(__name__)
CORS(app)  # This will allow all domains. 

@app.route('/calculate-matching-scores', methods=['POST'])
def calculate_matching_scores_api():
    try:
        download_resumes_and_jd()

        # Explicitly set input_folder to 'input'
        input_folder = 'input'
        
        # Define the api_url for the request
        api_url = "http://localhost:3000/resumes"

        # Ensure the input folder exists
        if not os.path.exists(input_folder):
            raise FileNotFoundError(f"Input folder '{input_folder}' does not exist")

        # Process resumes and job description
        job_description_doc, resumes = process_all_pdfs(input_folder, api_url)  # api_url passed here
        job_description = extract_resume_info(job_description_doc)

        # Calculate matching scores
        scores = calculate_matching_scores(job_description, resumes)

        # Log and return the calculated scores
        print("Calculated scores:", scores)
        return jsonify(scores), 200

    except Exception as e:
        # Log and handle errors
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
