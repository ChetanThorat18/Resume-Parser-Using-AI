import os
import spacy
import fitz
import requests
from init import download_resumes_and_jd
from extractors import (
    extract_name,
    extract_email,
    extract_contact_number_from_resume,
    extract_education_from_resume,
    extract_skills,
    extract_experience
)

# Execute the init function to download resumes and job description
print("Starting download of resumes and job description...")
download_resumes_and_jd()
print("Download complete.")
# Load the SpaCy model at the beginning
nlp = spacy.load('en_core_web_sm')

# Function to call Node.js API and fetch resumes collection
def fetch_resumes_collection(api_url):
    try:
        response = requests.get(api_url)
        response.raise_for_status()  # Raise an error for HTTP codes like 4xx/5xx
        return response.json()  # Return the JSON response as Python dictionary/list
    except requests.exceptions.RequestException as e:
        raise Exception(f"Error fetching resumes collection: {e}")

def extract_resume_info_from_pdf(uploaded_file):
    doc = fitz.open(stream=uploaded_file.read(), filetype="pdf")
    text = "".join([page.get_text() for page in doc])
    return nlp(text)

def extract_resume_info(doc):
    first_name, last_name = extract_name(doc)
    email = extract_email(doc)
    contact_number = extract_contact_number_from_resume(doc)
    education = extract_education_from_resume(doc)
    skills = extract_skills(doc)
    experience = extract_experience(doc)
    return {
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'contact_number': contact_number,
        'education': education,
        'skills': skills,
        'experience': experience
    }

def process_all_pdfs(input_folder, api_url):
    
    resumes_collection = fetch_resumes_collection(api_url)
    print("Resumes collection fetched from API:", resumes_collection)

    job_description_file = os.path.join(input_folder, 'job_description.pdf')

    # Load Job Description
    with open(job_description_file, 'rb') as f:
        job_description_doc = extract_resume_info_from_pdf(f)

    resumes = []
    for file_name in os.listdir(input_folder):
        if file_name.endswith('.pdf') and file_name != 'job_description.pdf':
            resume_file_path = os.path.join(input_folder, file_name)
            with open(resume_file_path, 'rb') as f:
                resume_doc = extract_resume_info_from_pdf(f)
                resume_info = extract_resume_info(resume_doc)

                # Retrieve the matching document from the API response
                existing_document = next(
                    (doc for doc in resumes_collection if doc['filename'] == file_name), None
                )

                if existing_document:
                    document_id = str(existing_document['_id'])
                    resume_url = existing_document.get('url', None)
                else:
                    raise Exception(f"No existing document found for {file_name}")

                resumes.append({
                    'filename': file_name,
                    'resume_info': resume_info,
                    'document_id': document_id,
                    'url': resume_url  # Add URL to resume data
                })

    return job_description_doc, resumes
