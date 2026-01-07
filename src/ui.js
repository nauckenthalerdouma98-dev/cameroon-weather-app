function showLoading() {
  const loadingElement = document.getElementById("loading");
  if (loadingElement) {
    loadingElement.style.display = 'block';
    loadingElement.textContent = "Loading weather data...";
  }
  
  const errorElement = document.getElementById("error");
  if (errorElement) {
    errorElement.style.display = 'none';
  }
  
  const weatherDisplay = document.getElementById("weather-display");
  if (weatherDisplay) {
    weatherDisplay.style.display = 'none';
  }
}

function hideLoading() {
  const loadingElement = document.getElementById("loading");
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
}

function showError(message) {
  const errorElement = document.getElementById("error");
  if (errorElement) {
    errorElement.style.display = 'block';
    const errorText = document.getElementById("error-text");
    if (errorText) {
      errorText.textContent = message;
    }
  }
  
  const loadingElement = document.getElementById("loading");
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
  
  const weatherDisplay = document.getElementById("weather-display");
  if (weatherDisplay) {
    weatherDisplay.style.display = 'none';
  }
}

function updateWeatherUI(data) {
  hideLoading();
  
  const errorElement = document.getElementById("error");
  if (errorElement) {
    errorElement.style.display = 'none';
  }
  
  const weatherDisplay = document.getElementById("weather-display");
  if (weatherDisplay) {
    weatherDisplay.style.display = 'block';
  }
  
  document.getElementById("city").textContent = data.name;
  document.getElementById("temperature").textContent =
    `Temperature: ${Math.round(data.main.temp)}°C`;
  document.getElementById("description").textContent =
    `Condition: ${data.weather[0].description}`;
  document.getElementById("humidity").textContent =
    `Humidity: ${data.main.humidity}%`;
  document.getElementById("wind").textContent =
    `Wind Speed: ${data.wind.speed} m/s`;
    
  updateWeatherIcon(data.weather[0].main);
  updateBackground(data.weather[0].main);
}

function updateWeatherIcon(condition) {
  const icon = document.getElementById("weatherIcon");
  if (!icon) return;
  
  if (condition === "Clear") icon.src = "icons/sun.png";
  else if (condition === "Rain") icon.src = "icons/rain.png";
  else if (condition === "Clouds") icon.src = "icons/cloud.png";
  else if (condition === "Snow") icon.src = "icons/snow.png";
  else icon.src = "icons/default.png";
  icon.style.display = 'block';
}

function updateBackground(condition) {
  const body = document.body;
  
  if (condition === "Clear") body.style.backgroundColor = "#87CEEB";
  else if (condition === "Rain") body.style.backgroundColor = "#5F9EA0";
  else if (condition === "Clouds") body.style.backgroundColor = "#B0C4DE";
  else body.style.backgroundColor = "#ddd";
}