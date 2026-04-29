import pandas as pd
import numpy as np
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Load dataset
df = pd.read_csv('data/dataset.csv')

# Clean data
df.fillna('', inplace=True)
df = df.apply(lambda col: col.str.strip().str.lower())

# Target (Disease)
y = df.iloc[:, 0]

# All symptoms (from columns 1 onward)
all_symptoms = set()
for col in df.columns[1:]:
    all_symptoms.update(df[col].unique())

all_symptoms.discard('')
all_symptoms = sorted(list(all_symptoms))

# Create feature matrix
X = []
for _, row in df.iterrows():
    row_symptoms = set(row[1:])
    vector = [1 if symptom in row_symptoms else 0 for symptom in all_symptoms]
    X.append(vector)

X = np.array(X)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=200)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))

# Save model + symptom list
pickle.dump((model, all_symptoms), open('model/model.pkl', 'wb'))

print("✅ Model trained correctly!")