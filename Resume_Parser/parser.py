import os
import fitz
import spacy
import csv
import nltk
import re

# Additional libraries
nltk.download('punkt')

# Load the spaCy model for English
nlp = spacy.load('en_core_web_sm')

def load_keywords(file_path):
    with open(file_path, 'r') as file:
        reader = csv.reader(file)
        return set(row[0] for row in reader)

# Extracting functions...

def extract_name(doc):
    for ent in doc.ents:
        if ent.label_ == 'PERSON':
            names = ent.text.split()
            if len(names) >= 2 and names[0].istitle() and names[1].istitle():
                return names[0], ' '.join(names[1:])
    return "", ""

def extract_email(doc):
    matcher = spacy.matcher.Matcher(nlp.vocab)
    email_pattern = [{'LIKE_EMAIL': True}]
    matcher.add('EMAIL', [email_pattern])

    matches = matcher(doc)
    for match_id, start, end in matches:
        if match_id == nlp.vocab.strings['EMAIL']:
            return doc[start:end].text
    return ""

def extract_contact_number_from_resume(doc):
    contact_number = None
    text = doc.text  # Extract text from SpaCy doc object
    pattern = r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b"
    match = re.search(pattern, text)
    if match:
        contact_number = match.group()
    return contact_number

def extract_education_from_resume(doc):
    universities = []
    doc = nlp(doc)
    for entity in doc.ents:
        if entity.label_ == "ORG" and ("university" in entity.text.lower() or "college" in entity.text.lower() or "institute" in entity.text.lower()):
            universities.append(entity.text)
    return universities

def csv_skills(doc):
    skills_keywords = load_keywords('data/newSkills.csv')
    skills = set()
    for keyword in skills_keywords:
        if keyword.lower() in doc.text.lower():
            skills.add(keyword)
    return skills

nlp_skills = spacy.load('TrainedModel/skills')

def extract_skills_from_ner(doc):
    non_skill_labels = {'DATE', 'TIME', 'PERCENT', 'MONEY', 'QUANTITY', 'ORDINAL', 'CARDINAL', 'EMAIL'}
    skills = set()
    for ent in nlp_skills(doc.text).ents:
        if ent.label_ == 'SKILL':
            if ent.label_ not in non_skill_labels and not ent.text.isdigit():
                skill_text = ''.join(filter(str.isalpha, ent.text))
                if skill_text:
                    skills.add(skill_text)
    return skills

def is_valid_skill(skill_text):
    return len(skill_text) > 1 and not any(char.isdigit() for char in skill_text)

def extract_skills(doc):
    skills_csv = csv_skills(doc)
    skills_ner = extract_skills_from_ner(doc)
    filtered_skills_csv = {skill for skill in skills_csv if is_valid_skill(skill)}
    filtered_skills_ner = {skill for skill in skills_ner if is_valid_skill(skill)}
    combined_skills = filtered_skills_csv.union(filtered_skills_ner)
    return list(combined_skills)

def extract_experience(doc):
    verbs = [token.text for token in doc if token.pos_ == 'VERB']
    senior_keywords = ['lead', 'manage', 'direct', 'oversee', 'supervise']
    mid_senior_keywords = ['develop', 'design', 'analyze']
    mid_junior_keywords = ['assist', 'support', 'collaborate']

    if any(keyword in verbs for keyword in senior_keywords):
        level_of_experience = "Senior"
    elif any(keyword in verbs for keyword in mid_senior_keywords):
        level_of_experience = "Mid-Senior"
    elif any(keyword in verbs for keyword in mid_junior_keywords):
        level_of_experience = "Mid-Junior"
    else:
        level_of_experience = "Entry Level"

    return level_of_experience

# Function to process PDF files
def extract_resume_info_from_pdf(uploaded_file):
    doc = fitz.open(stream=uploaded_file.read(), filetype="pdf")
    text = ""
    for page_num in range(doc.page_count):
        page = doc[page_num]
        text += page.get_text()
    return nlp(text)

def extract_resume_info(doc):
    first_lines = '\n'.join(doc.text.splitlines()[:10])
    first_name, last_name = extract_name(doc)
    email = extract_email(doc)
    skills = extract_skills(doc)
    education = extract_education_from_resume(doc)
    experience = extract_experience(doc)

    return {'first_name': first_name, 'last_name': last_name, 'email': email, 'education': education, 'skills': skills, 'experience': experience}

# Main Function to process all resumes and job description
def process_all_pdfs(input_folder):
    job_description_file = os.path.join(input_folder, 'job_description.pdf')
    job_description_doc = None

    # Load Job Description only once
    with open(job_description_file, 'rb') as f:
        job_description_doc = extract_resume_info_from_pdf(f)

    resumes = []
    for file_name in os.listdir(input_folder):
        if file_name.endswith('.pdf') and file_name != 'job_description.pdf':
            resume_file_path = os.path.join(input_folder, file_name)
            with open(resume_file_path, 'rb') as f:
                resume_doc = extract_resume_info_from_pdf(f)
                resume_info = extract_resume_info(resume_doc)
                resumes.append({'filename': file_name, 'resume_info': resume_info})

    # Now `job_description_doc` and `resumes` are ready to be used for further analysis
    return job_description_doc, resumes

# Example usage:
input_folder = 'input'
job_description, resumes = process_all_pdfs(input_folder)

# You can now process the job description and resumes as needed
print("Job Description processed.")
print(f"{len(resumes)} resumes processed.")