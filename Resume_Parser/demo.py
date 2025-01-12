import spacy

# Load the saved model
model_path = "TrainedModel/Model1"  # Adjust path if necessary
nlp = spacy.load(model_path)

# Test text
text = "Proficient in Python, Java, and C++"
# Process the text through the model
doc = nlp(text)

# Print the extracted entities
print("Entities detected:")
for ent in doc.ents:
    print(f"Text: {ent.text}, Label: {ent.label_}")