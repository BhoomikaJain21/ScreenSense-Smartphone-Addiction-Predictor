document.addEventListener("DOMContentLoaded", () => {
  const API_ENDPOINT = "http://127.0.0.1:8000/predict";

  // Slider IDs mapping for live label updates
  const sliders = [
    "daily_screen_time_hours",
    "social_media_hours",
    "gaming_hours",
    "work_study_hours",
    "weekend_screen_time"
  ];

  // Initialize live slider values
  sliders.forEach(id => {
    const input = document.getElementById(id);
    const label = document.getElementById(`val_${id}`);

    input.addEventListener("input", (e) => {
      label.textContent = parseFloat(e.target.value).toFixed(1);
    });
  });

  const form = document.getElementById("predictionForm");
  const submitBtn = document.getElementById("submitBtn");
  const btnSpinner = document.getElementById("btnSpinner");

  const emptyState = document.getElementById("emptyState");
  const resultsContent = document.getElementById("resultsContent");

  const gaugeFill = document.getElementById("gaugeFill");
  const riskPercentage = document.getElementById("riskPercentage");
  const statusBanner = document.getElementById("statusBanner");
  const statusTitle = document.getElementById("statusTitle");
  const statusExplanation = document.getElementById("statusExplanation");

  const metricRecUsage = document.getElementById("metricRecUsage");
  const metricRecShare = document.getElementById("metricRecShare");
  const metricWeekendDiff = document.getElementById("metricWeekendDiff");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Set Loading State
    submitBtn.disabled = true;
    btnSpinner.classList.remove("hidden");

    // Gather Form Inputs strictly adhering to payload schema
    const payload = {
      daily_screen_time_hours: Number(document.getElementById("daily_screen_time_hours").value),
      social_media_hours: Number(document.getElementById("social_media_hours").value),
      gaming_hours: Number(document.getElementById("gaming_hours").value),
      work_study_hours: Number(document.getElementById("work_study_hours").value),
      weekend_screen_time: Number(document.getElementById("weekend_screen_time").value),
      gender: document.querySelector('input[name="gender"]:checked').value,
      stress_level: document.querySelector('input[name="stress_level"]:checked').value,
      academic_work_impact: document.querySelector('input[name="academic_work_impact"]:checked').value
    };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP status ${response.status}`);
      }

      const data = await response.json();
      renderResults(data, payload);

    } catch (error) {
      console.error("Prediction Request Failed:", error);
      alert("Unable to reach the prediction server. Ensure your FastAPI service is running on http://127.0.0.1:8000");
    } finally {
      // Reset Loading State
      submitBtn.disabled = false;
      btnSpinner.classList.add("hidden");
    }
  });

  function renderResults(data, payload) {
    // Reveal Results Container
    emptyState.classList.add("hidden");
    resultsContent.classList.remove("hidden");

    const probability = Number(data.addiction_probability);
    const isHighRisk = data.prediction === "Addicted";

    // 1. Gauge Progress Animation (Circumference = 2 * PI * 52 ≈ 326.7)
    const maxDashOffset = 326.7;
    const calculatedOffset = maxDashOffset - (maxDashOffset * (probability / 100));
    
    // Animate Number Count-Up
    animateCounter(riskPercentage, 0, probability, 800);
    
    setTimeout(() => {
      gaugeFill.style.strokeDashoffset = calculatedOffset;
    }, 50);

    // 2. Prediction Status Formatting
    if (isHighRisk) {
      gaugeFill.style.stroke = "#FF4D6D"; // Warm Red/Orange Accent
      statusBanner.className = "status-banner status-high";
      statusTitle.textContent = "Higher Risk Pattern Detected";
      statusExplanation.textContent = "Your usage pattern shares characteristics with patterns classified by the model as higher risk.";
    } else {
      gaugeFill.style.stroke = "#22C55E"; // Green/Teal Accent
      statusBanner.className = "status-banner status-low";
      statusTitle.textContent = "Lower Risk Pattern Detected";
      statusExplanation.textContent = "Your usage pattern was classified by the model as a lower-risk pattern.";
    }

    // 3. Digital Habit Insights Calculations
    const recUsage = payload.social_media_hours + payload.gaming_hours;
    
    let recShare = 0;
    if (payload.daily_screen_time_hours > 0) {
      recShare = Math.round((recUsage / payload.daily_screen_time_hours) * 100);
    }

    const weekendDiff = payload.weekend_screen_time - payload.daily_screen_time_hours;
    const diffPrefix = weekendDiff > 0 ? "+" : "";

    // Render Metrics
    metricRecUsage.textContent = `${recUsage.toFixed(1)} hrs/day`;
    metricRecShare.textContent = `${recShare}%`;
    metricWeekendDiff.textContent = `${diffPrefix}${weekendDiff.toFixed(1)} hrs`;
  }

  function animateCounter(element, start, end, duration) {
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = (progress * (end - start) + start).toFixed(2);
      element.textContent = `${currentValue}%`;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }
});