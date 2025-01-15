from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
from processor import process_all_pdfs, extract_resume_info

def calculate_skill_score(resume_skills, jd_skills):
    vectorizer = CountVectorizer().fit_transform([" ".join(resume_skills), " ".join(jd_skills)])
    vectors = vectorizer.toarray()
    return cosine_similarity(vectors)[0][1] * 100  # Percentage

def calculate_matching_scores(job_description, resumes):
    jd_skills = job_description['skills']
    results = []

    for resume in resumes:
        resume_skills = resume['resume_info']['skills']
        score = calculate_skill_score(resume_skills, jd_skills)
        results.append({
            'filename': resume['filename'],
            'matching_score': round(score, 2),
            'skills_matched': list(set(resume_skills) & set(jd_skills)),
            'reference_id': resume['document_id'],  # Add reference
            'url': resume.get('url', 'URL not available'),
        })

    return results

# Example Usage
if __name__ == "__main__":
    input_folder = 'input'
    api_url = "http://localhost:3000/resumes"

    # Extract info using process_all_pdfs from processor.py
    print("Extracting resumes and job description...")
    job_description_doc, resumes = process_all_pdfs(input_folder, api_url)

    # Convert job description doc to structured data
    job_description = extract_resume_info(job_description_doc)

    # Calculate Scores
    print("Calculating matching scores...")
    scores = calculate_matching_scores(job_description, resumes)