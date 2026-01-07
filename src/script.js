const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const retryButton = document.getElementById('retry-button');

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
        
        const weatherData = await fetchWeatherByCity(city);
        updateWeatherUI(weatherData);
        
    } catch (error) {
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

function handleKeyPress(event) {
    if (event.key === "Enter") {
        handleSearch();
    }
}

function handleRetry() {
    handleSearch();
}

searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', handleKeyPress);
if (retryButton) {
    retryButton.addEventListener('click', handleRetry);
}

document.addEventListener('DOMContentLoaded', function() {
    if (searchInput) {
        searchInput.value = ""; 
    }
});