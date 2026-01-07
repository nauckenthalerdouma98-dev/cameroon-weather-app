

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const retryButton = document.getElementById('retry-button');

/**
 * Handles the search process
 */
async function handleSearch() {
    const city = searchInput.value.trim();
    
    if (!city) {
        showError("Please enter a city name");
        return;
    }
    
    try {
        showLoading();
        
        if (retryButton) {
            retryButton.style.display = 'inline-block';
        }
        
        // Use real API
        const weatherData = await fetchWeatherByCity(city);
        
        // Update UI with the weather data
        updateWeatherUI(weatherData);
        
    } catch (error) {
        console.error("Error in handleSearch:", error);
        
        // Show specific error messages
        if (error.message.includes("not found in Cameroon")) {
            showError("City not found in Cameroon. Try: Douala, Yaounde, Bamenda");
        } else if (error.message.includes("Request timed out")) {
            showError("Request timed out. Check internet.");
        } else if (error.message.includes("Invalid API")) {
            showError("API configuration error.");
        } else if (error.message.includes("Network")) {
            showError("Network error. Check connection.");
        } else {
            showError("Failed to fetch weather data. Try again.");
        }
    }
}

/**
 * Validates input and triggers search on Enter key
 */
function handleKeyPress(event) {
    if (event.key === "Enter") {
        handleSearch();
    }
}

/**
 * Handles retry button click
 */
function handleRetry() {
    handleSearch();
}

// ====================
// EVENT LISTENERS
// ====================
searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', handleKeyPress);
if (retryButton) {
    retryButton.addEventListener('click', handleRetry);
}

// ====================
// INITIALIZATION
// ====================
console.log("Weather App loaded successfully!");

document.addEventListener('DOMContentLoaded', function() {
    // 1. Ensure the input is empty on load
    if (searchInput) {
        searchInput.value = ""; 
    }
});