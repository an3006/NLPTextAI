from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import spacy


# Load the spaCy English language model
nlp = spacy.load('en_core_web_sm')

app = Flask(__name__)
CORS(app)

app = Flask(__name__, static_folder='static')
CORS(app)

def levenshtein_distance(s1, s2):
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)

    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, char1 in enumerate(s1):
        current_row = [i + 1]
        for j, char2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (char1 != char2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]

def summarize_text(text):
    # Use spaCy to process the text and extract key sentences for summarization
    doc = nlp(text)

    # Extract the sentences with highest rank (using TextRank)
    # You can modify this as per your summarization needs
    sentences = [sent.text for sent in doc.sents]
    ranked_sentences = sorted(sentences, key=lambda x: len(x), reverse=True)
    summary = " ".join(ranked_sentences[:2])  # Extract the top 2 sentences as the summary

    return summary

@app.route("/compare", methods=["POST"])
def compare():
    data = request.get_json()
    text1 = data["text1"]
    text2 = data["text2"]

    # Calculate similarity (using Levenshtein distance for simplicity)
    distance = levenshtein_distance(text1, text2)
    max_length = max(len(text1), len(text2))
    similarity = (1 - (distance / max_length)) * 100

    # Calculate word count for text1 and text2
    word_count_text1 = len(text1.split())
    word_count_text2 = len(text2.split())
   # Perform text summarization using spaCy
    summary_text1 = summarize_text(text1)
    summary_text2 = summarize_text(text2)

    return jsonify({
        "similarity": similarity,
        "word_count_text1": word_count_text1,
        "word_count_text2": word_count_text2,
        "summary_text1": summary_text1,
        "summary_text2": summary_text2
    })
@app.route("/")
def index():
    return render_template("index.html")

  
if __name__ == "__main__":
    app.run(debug=False,host="0.0.0.0")
