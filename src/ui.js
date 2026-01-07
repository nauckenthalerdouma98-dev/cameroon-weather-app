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
  
  // Added optional icon check for wind if you added the image in HTML
  const windElement = document.getElementById("wind");
  // Keep the text content but preserve the icon if it exists
  const windIconHtml = windElement.querySelector('img') ? windElement.querySelector('img').outerHTML : '';
  windElement.innerHTML = `${windIconHtml} Wind Speed: ${data.wind.speed} m/s`;
    
  updateWeatherIcon(data.weather[0].main);
  
  // PASS THE FULL DATA OBJECT NOW (Important for Day/Night detection)
  updateBackground(data);
}

function updateWeatherIcon(condition) {
  const icon = document.getElementById("weatherIcon");
  if (!icon) return;

  // 1. Define the path to your icons folder
  // Since index.html is at the root, we access assets from there
  const iconPath = "assets/icons/"; 
  
  // 2. Normalize the condition to handle cases correctly
  // (The API usually returns "Clear", "Clouds", "Rain", etc.)
  const weatherState = condition || "Clear"; 

  // 3. Map API conditions to your specific PNG files
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
      // Fallback if the condition isn't matched
      iconName = "sunny-icon.png"; 
  }

  // 4. Set the source and make sure the icon is visible
  icon.src = `${iconPath}${iconName}`;
  icon.style.display = 'block';
  icon.alt = weatherState; // Good for accessibility
}

function updateBackground(data) {
  // 1. Get conditions and time of day
  const weatherMain = data.weather[0].main; // e.g., "Clear", "Clouds", "Rain"
  const iconCode = data.weather[0].icon; 
  const isNight = iconCode.includes('n');   // Check if API says it's night

  // 2. Determine Image Name based on Priority
  // Priority: Rain > Clouds > Time of Day (Night/Day)
  
  const basePath = "assets/images/";
  let bgImageName;

  if (weatherMain === "Rain" || weatherMain === "Drizzle" || weatherMain === "Thunderstorm") {
    // Priority 1: If it's raining, use rainy background (regardless of time)
    bgImageName = "rainy-bg.png";
    
  } else if (weatherMain === "Clouds" || weatherMain === "Mist" || weatherMain === "Haze" || weatherMain === "Fog") {
    // Priority 2: If it's cloudy (or misty), use cloudy background (regardless of time)
    bgImageName = "cloudy-bg.png";
  } else {
    // Priority 3: If sky is clear, THEN check time of day
    if (isNight) {
      bgImageName = "night-bg.png";
    } else {
      bgImageName = "sunny-bg.png";
    }
  }

  // 3. Handle the Background Transition (Diagonal Wipe)
  let bgContainer = document.getElementById("dynamic-bg");
  
  // Create container if it doesn't exist yet
  if (!bgContainer) {
    bgContainer = document.createElement("div");
    bgContainer.id = "dynamic-bg";
    document.body.prepend(bgContainer);
  }

  // Create a new layer for the incoming image
  const newLayer = document.createElement("div");
  newLayer.className = "bg-layer incoming";
  newLayer.style.backgroundImage = `url('${basePath}${bgImageName}')`;

  // Append new layer
  bgContainer.appendChild(newLayer);

  // Force reflow to ensure animation triggers
  void newLayer.offsetWidth;

  // Start Animation
  newLayer.classList.add("active");

  // Clean up old layers after animation finishes (1.5s)
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
    weatherDisplay.style.display = 'none'; // Hide the box until first search
  }
}