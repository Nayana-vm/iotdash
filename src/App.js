import { useState, useEffect } from "react";
import "./App.css";

const sensors = [
  { id: 1, name: "Temperature", unit: "°C", min: 20, max: 35 },
  { id: 2, name: "Humidity", unit: "%", min: 40, max: 80 },
  { id: 3, name: "Pressure", unit: "hPa", min: 995, max: 1015 },
  { id: 4, name: "CO2 Level", unit: "ppm", min: 400, max: 800 },
  { id: 5, name: "Air Quality", unit: "AQI", min: 50, max: 200 },
  { id: 6, name: "Oxygen Level", unit: "ppm", min: 400, max: 800 },
];

function randomValue(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

function getSensorStatus(sensor, value) {
  const mid = (sensor.min + sensor.max) / 2;
  const range = (sensor.max - sensor.min) / 2;
  return Math.abs(value - mid) > range * 0.7 ? "warning" : "normal";
}

function SensorCard({ sensor }) {
  const isWarning = sensor.status === "warning";
  return (
    <article
      className={`sensor-card ${isWarning ? "sensor-card-warning" : "sensor-card-normal"
        }`}
    >
      <h3 className="sensor-name">{sensor.name}</h3>
      <p className="sensor-value">{sensor.value.toFixed(1)}</p>
      <p className="sensor-unit">{sensor.unit}</p>
      <span
        className={`sensor-chip ${isWarning ? "chip-warning" : "chip-normal"
          }`}
      >
        {isWarning ? "⚠ WARNING" : "✓ NORMAL"}
      </span>
    </article>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [sensorReadings, setSensorReadings] = useState(() =>
    sensors.map((sensor) => {
      const value = randomValue(sensor.min, sensor.max);
      return {
        ...sensor,
        value,
        status: getSensorStatus(sensor, value),
      };
    })
  );

  const warningSensors = sensorReadings.filter(
    (sensor) => sensor.status === "warning"
  );
  const hasWarning = warningSensors.length > 0;

  // Extract individual sensor values easily
  const getVal = (name) =>
    sensorReadings.find((s) => s.name.toLowerCase() === name.toLowerCase())
      ?.value || 0;

  const temp = getVal("Temperature");
  const humidity = getVal("Humidity");
  const co2 = getVal("CO2 Level");
  const aqi = getVal("Air Quality");
  const oxygen = getVal("Oxygen Level");

  // Advisory logic
  const isRainy = humidity > 65 || (humidity > 60 && temp < 24);
  const shouldWearMask = aqi > 120 || co2 > 650 || oxygen < 500;
  const isSuitable =
    aqi <= 130 && co2 <= 700 && oxygen >= 500 && temp >= 18 && temp <= 34;

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorReadings((prev) =>
        prev.map((sensor) => {
          const value = randomValue(sensor.min, sensor.max);
          return {
            ...sensor,
            value,
            status: getSensorStatus(sensor, value),
          };
        })
      );
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className={`dashboard ${isDarkMode ? "dark-theme" : "light-theme"}`}>
      <section className="dashboard-shell">
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">🌐 IoT Sensor Dashboard</h1>
            <p className="dashboard-subtitle">
              KSIT — DevOps Workshop 2026
            </p>
          </div>

          <div className="header-controls">
            <button
              className="theme-toggle-btn"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle Day/Night Mode"
            >
              {isDarkMode ? " Night Mode" : " Day Mode"}
            </button>

            <div className="dashboard-clock">
              <p className="clock-time"> {time}</p>
              <p className="clock-hint">Live Updates Every 20s</p>
            </div>
          </div>
        </header>

        {/* Advisory Pop-up Bar */}
        <div className="advisory-bar">
          <div className={`advisory-popup ${isRainy ? "popup-rainy" : "popup-sunny"}`}>
            <span className="popup-icon">{isRainy ? "" : ""}</span>
            <div>
              <strong>Weather Forecast:</strong>{" "}
              {isRainy ? "Rainy / Damp Conditions Expected" : "Sunny & Clear Skies"}
              <div className="popup-subtext">
                Temp: {temp}°C | Humidity: {humidity}%
              </div>
            </div>
          </div>

          <div className={`advisory-popup ${shouldWearMask ? "popup-mask-yes" : "popup-mask-no"}`}>
            <span className="popup-icon">{shouldWearMask ? "" : ""}</span>
            <div>
              <strong>Mask Advisory:</strong>{" "}
              {shouldWearMask ? "Wear a Mask Outdoors" : "Air is Safe (No Mask Needed)"}
              <div className="popup-subtext">
                AQI: {aqi} | CO2: {co2} ppm | O2: {oxygen} ppm
              </div>
            </div>
          </div>
        </div>

        {/* Warning Alert Banner */}
        {hasWarning && (
          <div className="warning-banner" role="alert" aria-live="assertive">
            ALERT: Warning detected in{" "}
            {warningSensors.map((sensor) => sensor.name).join(", ")}
          </div>
        )}

        {/* Content Layout Grid (Sensors + Side Panel) */}
        <div className="dashboard-content">
          <div className="sensor-grid">
            {sensorReadings.map((sensor) => (
              <SensorCard key={sensor.id} sensor={sensor} />
            ))}
          </div>

          {/* Side Weather Suitability Pop-up Card */}
          <aside
            className={`suitability-card ${isSuitable ? "suitability-good" : "suitability-bad"
              }`}
          >
            <div className="suitability-badge">
              {isSuitable ? " SUITABLE" : " UNSUITABLE"}
            </div>
            <h3 className="suitability-title">Outdoor Weather Condition</h3>
            <p className="suitability-desc">
              {isSuitable
                ? "Weather and environmental conditions are ideal for outdoor activities, walking, or exercise."
                : "Weather or air quality is currently unfavourable for prolonged outdoor exposure."}
            </p>
            <div className="suitability-checklist">
              <div className="check-item">
                <span>Air Quality (AQI):</span>
                <strong>{aqi <= 120 ? "Good" : "Poor"} ({aqi})</strong>
              </div>
              <div className="check-item">
                <span>Temperature:</span>
                <strong>{temp}°C</strong>
              </div>
              <div className="check-item">
                <span>Oxygen Level:</span>
                <strong>{oxygen >= 500 ? "Normal" : "Low"} ({oxygen} ppm)</strong>
              </div>
              <div className="check-item">
                <span>CO2 Level:</span>
                <strong>{co2 <= 650 ? "Optimal" : "Elevated"} ({co2} ppm)</strong>
              </div>
            </div>
            <div className="suitability-footer">
              💡 {isSuitable ? "Enjoy your day outside!" : "Consider staying indoors or wearing a mask."}
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="dashboard-footer">
          <p>
            📦 Containerized with Docker &nbsp;|&nbsp; ⚙️ CI/CD via Jenkins
            &nbsp;|&nbsp; ☸️ Deployed on Kubernetes
          </p>
        </footer>
      </section>
    </main>
  );
}

