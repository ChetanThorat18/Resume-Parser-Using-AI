import os
import requests

# Folder to store downloaded PDFs
INPUT_FOLDER = './input/'

def download_pdf(url, filename):
    try:
        # Send GET request to download the PDF
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for bad responses (status code 4xx or 5xx)

        # Ensure the input directory exists
        if not os.path.exists(INPUT_FOLDER):
            os.makedirs(INPUT_FOLDER)

        # Write the content to a PDF file with the provided filename
        file_path = os.path.join(INPUT_FOLDER, filename)
        with open(file_path, 'wb') as f:
            f.write(response.content)

        print(f"Downloaded: {filename}")
        return file_path

    except requests.exceptions.RequestException as e:
        print(f"Error downloading {filename}: {e}")
        return None

def download_resumes_and_jd():
    # Fetch data from Node.js API (replace with your actual endpoint)
    api_url = "http://localhost:3000/resumes"
    response = requests.get(api_url)
    response.raise_for_status()  # Ensure a successful response
    
    resumes_data = response.json()

    # Download the job description once, and keep the same file for all resumes
    job_description_url = resumes_data[0]['jobDescription']
    job_description_filename = f"job_description.pdf"
    
    # Download job description
    jd_path = download_pdf(job_description_url, job_description_filename)

    # Now download each resume and save with its respective filename
    for resume in resumes_data:
        resume_url = resume['url']
        resume_filename = resume['filename']
        
        resume_path = download_pdf(resume_url, resume_filename)
        if resume_path:
            print(f"Downloaded resume: {resume_filename}")

# Call the function to download all files
download_resumes_and_jd()