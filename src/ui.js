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
  
  const windElement = document.getElementById("wind");
  const windIconHtml = windElement.querySelector('img') ? windElement.querySelector('img').outerHTML : '';
  windElement.innerHTML = `${windIconHtml} Wind Speed: ${data.wind.speed} m/s`;
    
  updateWeatherIcon(data.weather[0].main);
  updateBackground(data);
}

function updateWeatherIcon(condition) {
  const icon = document.getElementById("weatherIcon");
  if (!icon) return;

  const iconPath = "assets/icons/"; 
  const weatherState = condition || "Clear"; 

  let iconName;
  
  switch (weatherState) {
    case "Clear":
      iconName = "sun-icon.png";
      break;
    case "Clouds":
      iconName = "cloudy-icon.png";
      break;
    case "Rain":
    case "Drizzle":
    case "Thunderstorm":
      iconName = "rainy-icon.png";
      break;
    case "Haze":
    case "Mist":
    case "Fog":
    case "Smoke":
      iconName = "haze-icon.png";
      break;
    case "Squall":
    case "Tornado":
      iconName = "wind-icon.png";
      break;
    default:
      iconName = "sunny-icon.png"; 
  }

  icon.src = `${iconPath}${iconName}`;
  icon.style.display = 'block';
  icon.alt = weatherState;
}

function updateBackground(data) {
  const weatherMain = data.weather[0].main;
  const iconCode = data.weather[0].icon; 
  const isNight = iconCode.includes('n');

  const basePath = "assets/images/";
  let bgImageName;

  if (weatherMain === "Rain" || weatherMain === "Drizzle" || weatherMain === "Thunderstorm") {
    bgImageName = "rainy-bg.png";
  } else if (weatherMain === "Clouds" || weatherMain === "Mist" || weatherMain === "Haze" || weatherMain === "Fog") {
    bgImageName = "cloudy-bg.png";
  } else {
    if (isNight) {
      bgImageName = "night-bg.png";
    } else {
      bgImageName = "sunny-bg.png";
    }
  }

  let bgContainer = document.getElementById("dynamic-bg");
  
  if (!bgContainer) {
    bgContainer = document.createElement("div");
    bgContainer.id = "dynamic-bg";
    document.body.prepend(bgContainer);
  }

  const newLayer = document.createElement("div");
  newLayer.className = "bg-layer incoming";
  newLayer.style.backgroundImage = `url('${basePath}${bgImageName}')`;

  bgContainer.appendChild(newLayer);

  void newLayer.offsetWidth;

  newLayer.classList.add("active");

  setTimeout(() => {
    const layers = bgContainer.querySelectorAll(".bg-layer");
    layers.forEach((layer) => {
      if (layer !== newLayer) {
        layer.remove();
      }
    });
    newLayer.classList.remove("incoming", "active");
  }, 1500);
}

function resetWeatherUI() {
  const weatherDisplay = document.getElementById("weather-display");
  if (weatherDisplay) {
    weatherDisplay.style.display = 'none';
  }
}