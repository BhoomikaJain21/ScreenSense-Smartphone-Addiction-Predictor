# 📱 Smartphone Addiction Prediction

An end-to-end Machine Learning project that predicts whether a smartphone usage pattern is classified as **Addicted** or **Not Addicted**, along with the model's predicted probability.

The project includes the complete workflow from **data exploration and feature selection** to **model development, FastAPI integration, and an interactive web interface**.

> ⚠️ **Disclaimer:** This application provides a machine learning prediction based on patterns learned from the dataset. It is not a medical or clinical diagnosis.

---

## 🔗 Dataset

This project uses data from the Kaggle Playground competition:

**Playground Series – Season 6, Episode 8: Predicting Smartphone Addiction**

The competition objective is to predict the probability of:

```text
addicted_label
```

The evaluation metric used in the competition is **ROC-AUC**.

The dataset was inspired by the **Smartphone Addiction Prediction Dataset**.

---

# 🎯 Project Workflow

```text
Dataset
   ↓
Exploratory Data Analysis
   ↓
Visual Analysis
   ↓
Feature Selection
   ↓
Preprocessing Pipeline
   ↓
Model Comparison
   ↓
XGBoost Model
   ↓
Saved ML Pipeline
   ↓
FastAPI Backend
   ↓
Interactive Web Application
```

---

# 🔍 Exploratory Data Analysis

Before building the model, the dataset was explored to understand the available features and their relationship with smartphone addiction.

The following visualisations were used during analysis:

| Visual                 | Purpose                                                                         |
| ---------------------- | ------------------------------------------------------------------------------- |
| 📊 Bar Plots           | To examine categorical variables and compare their relationship with the target |
| 📈 Histograms          | To understand the distribution of numerical features                            |
| 📦 Box Plots           | To examine spread and identify potential outliers                               |
| 🔥 Correlation Heatmap | To examine relationships between numerical features                             |

The visual analysis helped in understanding the data and selecting a practical set of features for the final application.

---

# 📋 Final Feature Selection

The deployed model uses the following eight features.

| Column                    | What it tells us                                             | Kept? |
| ------------------------- | ------------------------------------------------------------ | ----- |
| `daily_screen_time_hours` | Overall smartphone screen time per day                       | Yes |
| `social_media_hours`      | Daily time spent on social media                             | Yes |
| `gaming_hours`            | Daily time spent gaming                                      | Yes |
| `work_study_hours`        | Daily smartphone usage for work or study                     | Yes |
| `weekend_screen_time`     | Smartphone screen time during weekends                       | Yes |
| `gender`                  | Gender category of the user                                  | Yes |
| `stress_level`            | Reported stress level                                        | Yes |
| `academic_work_impact`    | Whether smartphone usage affects academic or work activities | Yes |

These features were used in the final model and exposed as inputs in the web application.

---

# Why These Features Were Kept

The final features were selected after examining the dataset using **bar plots, histograms, box plots, and correlation analysis**, while also considering whether a feature could be practically collected from a user through the web application.

| Feature                   | Why it was kept                                                                               |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| `daily_screen_time_hours` | Provides an overall measure of smartphone usage                                               |
| `social_media_hours`      | Captures time spent on a major smartphone activity                                            |
| `gaming_hours`            | Captures gaming-related smartphone usage                                                      |
| `work_study_hours`        | Represents productive or academic smartphone usage                                            |
| `weekend_screen_time`     | Helps capture differences in smartphone usage patterns during weekends                        |
| `gender`                  | Categorical demographic information available in the dataset                                  |
| `stress_level`            | Adds a behavioural factor to the model                                                        |
| `academic_work_impact`    | Captures whether smartphone usage is associated with an impact on academic or work activities |

The goal was to build a model using features that were both meaningful for prediction and practical for users to provide in a real web application.

---

# 📈 Distribution and Skewness

During exploratory analysis, numerical feature distributions were examined.

The following features were included in the skewed-feature preprocessing pipeline:

```text
social_media_hours
gaming_hours
work_study_hours
```

These features are processed using:

```text
Median Imputation
       ↓
log1p Transformation
       ↓
Standard Scaling
```

Using `log1p` helps handle skewed numerical distributions while safely supporting zero values.

---

# ⚙️ Machine Learning Pipeline

Instead of manually preprocessing every prediction separately, preprocessing and the model are combined into a single pipeline.

```text
Raw User Input
      ↓
ColumnTransformer
      ↓
Feature-Specific Preprocessing
      ↓
XGBoost Classifier
      ↓
Prediction + Probability
```

This ensures that the same preprocessing used during model development is also applied when users make predictions through the web application.

---

## 🔢 Skewed Numerical Features

```text
social_media_hours
gaming_hours
work_study_hours
```

Pipeline:

```text
SimpleImputer(strategy="median")
        ↓
FunctionTransformer(log1p)
        ↓
StandardScaler()
```

---

## 🏷️ Categorical Features

```text
gender
stress_level
academic_work_impact
```

These features are handled through the preprocessing pipeline before being passed to the classifier.

---

# 🤖 Model Development

Different classification models were explored and compared during the Machine Learning workflow.

The final deployed pipeline uses:

## 🌲 XGBoost Classifier

The complete trained pipeline was saved using Joblib as:

```text
SmartPhone_Addiction_Model.pkl
```

The saved file contains both:

* Feature preprocessing
* XGBoost classification model

This allows the API to directly accept raw user input and apply the complete pipeline automatically.

---

# 🚀 FastAPI Backend

The backend is built using **FastAPI**.

## Prediction Endpoint

```text
POST /predict
```

Example request:

```json
{
  "daily_screen_time_hours": 6.5,
  "social_media_hours": 2.5,
  "gaming_hours": 1.0,
  "work_study_hours": 2.0,
  "weekend_screen_time": 8.0,
  "gender": "Female",
  "stress_level": "Medium",
  "academic_work_impact": "Yes"
}
```

Example response:

```json
{
  "prediction": "Addicted",
  "addiction_probability": 72.45
}
```

The backend uses Pydantic validation to validate:

* Numerical ranges
* Gender values
* Stress level values
* Academic/work impact values

---

# 🌐 Web Application

The frontend was built using:

* HTML
* CSS
* JavaScript

The application provides an interactive interface where users can enter their smartphone usage information and receive a prediction.

### Features

* 🎚️ Interactive sliders
* 🔘 Segmented selection controls
* ⏳ Loading state
* 📊 Animated prediction gauge
* 🚦 Higher/lower risk pattern display
* 📱 Digital habit insights
* 🎨 Responsive dark-themed UI

---

# 📊 Digital Habit Insights

Along with the Machine Learning prediction, the application calculates a few simple insights from the values entered by the user.

> These are calculated usage insights and are **not additional ML predictions**.

## 🎮 Recreational Usage

```text
Social Media Hours + Gaming Hours
```

This shows the total entered time spent on these two recreational activities.

---

## 📱 Recreational Share

```text
(Recreational Usage / Daily Screen Time) × 100
```

This shows what percentage of the entered daily screen time comes from social media and gaming.

---

## 🗓️ Weekend Difference

```text
Weekend Screen Time − Daily Screen Time
```

* A positive value indicates higher entered weekend screen time.
* A negative value indicates lower entered weekend screen time.

---

# 🛠️ Technology Stack

### Machine Learning

* Python
* Pandas
* Scikit-learn
* XGBoost
* Joblib

### Backend

* FastAPI
* Uvicorn
* Pydantic

### Frontend

* HTML
* CSS
* JavaScript

### Deployment

* GitHub
* Render

---

# 📁 Project Structure

```text
Smartphone_Addiction/
│
├── main.ipynb
├── main.py
├── SmartPhone_Addiction_Model.pkl
├── requirements.txt
├── README.md
│
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

---

# 💻 Run Locally

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Smartphone_Addiction
```

## 2. Create a Virtual Environment

```bash
python -m venv .venv
```

### macOS/Linux

```bash
source .venv/bin/activate
```

### Windows

```bash
.venv\Scripts\activate
```

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

## 4. Run the Backend

```bash
uvicorn main:app --reload
```

The FastAPI server will run locally on:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# ☁️ Deployment

The project is deployed using **Render**, with the frontend and FastAPI backend hosted separately.

### Backend — Render Web Service

**Build Command**
```text
pip install -r requirements.txt
```

### Start Command

```text
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Deployed API

```text
[http://127.0.0.1:8000/predict](https://screensense-api-esyo.onrender.com)
```

the prediction endpoint is:

```text
POST /predict
```

Frontend — Render Static Site
The frontend is deployed separately as a Render Static Site.
The JavaScript frontend communicates with the deployed FastAPI backend through:

``` text
https://screensense-api-esyo.onrender.com/predict
```

This allows the deployed web application to send user inputs to the trained ML pipeline and display the returned prediction and probability.

---

# 📚 Key Concepts Applied

* Exploratory Data Analysis
* Data visualisation
* Feature selection
* Distribution analysis
* Skewness handling
* Median imputation
* Log transformation
* Feature preprocessing pipelines
* `ColumnTransformer`
* Machine Learning classification
* Model comparison
* XGBoost
* Probability prediction using `predict_proba`
* FastAPI
* API input validation
* Frontend-backend integration
* Machine Learning deployment

---

# ⚠️ Disclaimer

This project was developed for educational and Machine Learning purposes.

The prediction represents patterns learned from the dataset and should **not** be interpreted as a medical, psychological, or clinical diagnosis.

---

# 👩‍💻 Author

**Bhoomika Jain**

B.Tech — Artificial Intelligence & Data Science

Interested in:

* Machine Learning
* Data Science
* Python
* Artificial Intelligence
* Building end-to-end ML applications

---

## 🤖 AI Assistance

The frontend UI design and initial frontend code were developed with AI assistance and integrated with the FastAPI backend as part of this project.
