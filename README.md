# MediPredict 🩺

AI-powered disease prediction web app using Machine Learning.

## 🚀 Features
- Predict diseases from symptoms
- Confidence score + severity level
- Top 3 possible diseases
- Precautions & description

## 🛠 Tech Stack
- Frontend: React + Vite + Bun
- Backend: Flask (Python)
- ML: Scikit-learn

## 🧠 How it works
1. User selects symptoms
2. Frontend sends request to Flask API
3. ML model predicts disease
4. Backend returns structured JSON
5. UI displays results

## ▶️ Run Locally

### Backend
```
cd Backend
pip install -r requirements.txt
python app.py
```
### Frontend
```
cd Frontend
bun install
bun run dev
```

## 🌐 Live Demo
    https://medipredict-pearl.vercel.app/

## ⚙️ Backend API
    https://medipredict-backend-4oad.onrender.com

### API Endpoints

- GET /symptoms
- POST /predict

  
## Screenshot

### Home Page
<img width="1118" height="603" alt="image" src="https://github.com/user-attachments/assets/d744b20e-cfa3-4686-af01-3e0d991b2baa" />

### Prediction Page 
<img width="919" height="608" alt="image" src="https://github.com/user-attachments/assets/e3267c94-e45b-4225-a9ce-28b7e084a1a4" />

