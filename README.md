# 🩺 MediPredict – AI Disease Prediction System

An end-to-end **AI-powered disease prediction web application** that analyzes user-selected symptoms and predicts possible diseases using a trained Machine Learning model.

🔗 **Live Demo:** https://medipredict-pearl.vercel.app/
⚙️ **Backend API:** https://medipredict-backend-4oad.onrender.com

---

## 🚀 Features

* 🔍 Select multiple symptoms dynamically
* 🤖 Predict diseases using ML model
* 📊 Confidence score + Top 3 predictions
* ⚠️ Severity analysis based on symptoms
* 💊 Disease description & precautions
* 🌐 Fully deployed (Frontend + Backend)

---

## 🧠 How It Works

```text
User selects symptoms
        ↓
Frontend (React UI)
        ↓
API Request (/predict)
        ↓
Backend (Flask)
        ↓
ML Model (Scikit-learn)
        ↓
Prediction + Confidence + Severity
        ↓
Results displayed on UI
```

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* TypeScript
* Tailwind CSS
* Bun / npm

### Backend

* Python (Flask)
* Flask-CORS
* Pandas, NumPy

### Machine Learning

* Scikit-learn (Random Forest)
* Custom dataset (symptoms → diseases)

### Deployment

* Frontend → Vercel
* Backend → Render

---

## 📂 Project Structure

```text
MediPredict/
│
├── Backend/
│   ├── app.py
│   ├── model/
│   ├── data/
│   └── requirements.txt
│
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## ▶️ Run Locally

### 🔹 Backend

```bash
cd Backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
python app.py
```

Runs on: `http://127.0.0.1:5000`

---

### 🔹 Frontend

```bash
cd Frontend
bun install   # or npm install
bun run dev   # or npm run dev
```

Runs on: `http://localhost:8080`

---

## 🔗 API Endpoints

### Get all symptoms

```http
GET /symptoms
```

### Predict disease

```http
POST /predict
Content-Type: application/json

{
  "symptoms": ["itching", "fever"]
}
```

---

## ⚠️ Notes

* First backend request may be slow (Render cold start)
* This tool is for **educational purposes only**, not medical advice

---

## 📸 Screenshots

### Home Page
<img width="1118" height="603" alt="image" src="https://github.com/user-attachments/assets/d744b20e-cfa3-4686-af01-3e0d991b2baa" />

### Prediction Page 
<img width="919" height="608" alt="image" src="https://github.com/user-attachments/assets/e3267c94-e45b-4225-a9ce-28b7e084a1a4" />


---

## 🎯 Future Improvements

* 📊 Visualization of predictions (charts/graphs)
* 👤 User authentication & history tracking
* 🧠 Improved ML model accuracy
* 📱 Mobile responsiveness enhancements

---

## 💼 Resume Highlight

> Developed and deployed a full-stack AI-powered disease prediction system using React, Flask, and Scikit-learn, enabling real-time predictions based on user-selected symptoms. Integrated a machine learning model with REST APIs and deployed using Vercel and Render.

---

## 🤝 Contributing

Feel free to fork the repo and improve it 🚀

---

## 📜 License

This project is open-source and available under the MIT License.

---

## ⭐ Show your support

If you like this project, give it a ⭐ on GitHub!



