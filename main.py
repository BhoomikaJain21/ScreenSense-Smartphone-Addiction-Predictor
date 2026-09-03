import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware

class PredictionInput(BaseModel):
    daily_screen_time_hours: float = Field(..., ge=0, le=24)
    social_media_hours: float = Field(..., ge=0, le=24)
    gaming_hours: float = Field(..., ge=0, le=24)
    work_study_hours: float = Field(..., ge=0, le=24)
    weekend_screen_time: float = Field(..., ge=0)
    gender: str = Field(..., pattern="^(Male|Female|Other)$")
    stress_level: str = Field(..., pattern="^(Low|Medium|High)$")
    academic_work_impact: str = Field(..., pattern="^(Yes|No)$")


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("SmartPhone_Addiction_Model.pkl")

@app.get("/")
async def root():
    return {"message": "Welcome to the SmartPhone Addiction Prediction API!"}

@app.post("/predict")
async def predict(data: PredictionInput):
    input_data = pd.DataFrame([data.model_dump()])

    prediction = model.predict(input_data)
    probabilities = model.predict_proba(input_data)

    addiction_probability = probabilities[0][1]
    prediction_label = "Addicted" if prediction[0] == 1 else "Not Addicted"

    return {
        "prediction": prediction_label,
        "addiction_probability": round(float(addiction_probability)*100, 2)
    }
