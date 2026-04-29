from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load model + symptom list
model, symptom_list = pickle.load(open('model/model.pkl', 'rb'))

# Load datasets
desc = pd.read_csv('data/disease_description.csv')
prec = pd.read_csv('data/disease_precaution.csv')
severity = pd.read_csv('data/symptom_severity.csv')

# Normalize columns
desc.columns = desc.columns.str.strip()
prec.columns = prec.columns.str.strip()
severity.columns = severity.columns.str.strip()

# -------------------------------
# Health Check Route (optional but useful)
# -------------------------------
@app.route('/')
def home():
    return jsonify({"message": "Backend is running 🚀"})


# -------------------------------
# Predict Route
# -------------------------------
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json

        user_symptoms = [s.strip().lower() for s in data['symptoms']]

        input_data = [1 if symptom in user_symptoms else 0 for symptom in symptom_list]

        prediction = model.predict([input_data])[0]

        probs = model.predict_proba([input_data])[0]
        confidence = float(max(probs))

        top_indices = probs.argsort()[-3:][::-1]
        top_diseases = [
            {
                "disease": model.classes_[i],
                "confidence": float(probs[i])
            }
            for i in top_indices
        ]

        # Description
        description_row = desc[desc['Disease'].str.lower() == prediction.lower()]
        description = (
            description_row['Description'].values[0]
            if not description_row.empty else "No description available"
        )

        # Precautions
        precaution_row = prec[prec['Disease'].str.lower() == prediction.lower()]
        precautions = (
            precaution_row.iloc[0, 1:].dropna().tolist()
            if not precaution_row.empty else []
        )

        # Severity
        severity_score = 0
        for symptom in user_symptoms:
            match = severity[severity['Symptom'].str.lower() == symptom]
            if not match.empty:
                severity_score += int(match['weight'].values[0])

        warning = None
        if severity_score > 10:
            warning = "⚠️ High severity detected. Please consult a doctor."

        return jsonify({
            "disease": prediction,
            "confidence": round(confidence, 2),
            "top_predictions": top_diseases,
            "description": description,
            "precautions": precautions,
            "severity_score": severity_score,
            "warning": warning
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# Symptoms API
# -------------------------------
@app.route('/symptoms', methods=['GET'])
def get_symptoms():
    return jsonify({
        "symptoms": symptom_list
    })


if __name__ == "__main__":
    app.run(debug=True)