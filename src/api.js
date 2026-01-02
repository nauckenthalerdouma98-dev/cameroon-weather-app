
const API_KEY = '4e2f56ebf57de77ebe5ed469bcc8b4d0';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const REQUEST_TIMEOUT = 8000;

const cameroonRegions = [
    { name: 'Yaounde', lat: 3.8480, lon: 11.5021 },
    { name: 'Douala', lat: 4.0511, lon: 9.7679 },
    { name: 'Bamenda', lat: 5.9630, lon: 10.1591 },
    { name: 'Bafoussam', lat: 5.4820, lon: 10.4250 },
    { name: 'Garoua', lat: 9.3068, lon: 13.3932 },
    { name: 'Maroua', lat: 10.5962, lon: 14.3240 },
    { name: 'Ngaoundere', lat: 7.3265, lon: 13.5670 },
    { name: 'Bertoua', lat: 4.5773, lon: 13.6907 },
    { name: 'Ebolowa', lat: 2.9042, lon: 11.1547 },
    { name: 'Limbe', lat: 4.0172, lon: 9.2167 }
];

async function fetchWeatherForAllRegions() {
    const weatherPromises = cameroonRegions.map(region => 
        fetchWeatherData(region.lat, region.lon, region.name)
    );
    
    try {
        const results = await Promise.allSettled(weatherPromises);
        return processWeatherResults(results);
    } catch (error) {
        console.error('Error fetching weather for all regions:', error);
        throw new Error('Failed to fetch weather data for multiple regions');
    }
}

async function fetchWeatherData(lat, lon, regionName) {
    const url = ${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API key');
            }
            throw new Error(API request failed: ${response.status});
        }
        
        const data = await response.json();
        
        if (!data.main || !data.weather || !data.weather[0]) {
            throw new Error('Invalid API response structure');
        }
        
        return {
            region: regionName,
            temperature: data.main.temp,
            feels_like: data.main.feels_like,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            weather: data.weather[0].main,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            wind_speed: data.wind?.speed || 0,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        if (error.name === 'AbortError') {
            const timeoutError = new Error('Request timed out');
            console.error(Error fetching weather for ${regionName}:, timeoutError.message);
            throw timeoutError;
        }
        console.error(Error fetching weather for ${regionName}:, error.message);
        throw error;
    }
}

function processWeatherResults(results) {
    return results.map(result => {
        if (result.status === 'fulfilled') {
            return result.value;
        } else {
            return {
                region: 'Unknown',
                error: true,
                message: result.reason?.message || 'Unknown error',
                timestamp: new Date().toISOString()
            };
        }
    });
}

async function fetchWeatherByCity(cityName) {
    const url = ${BASE_URL}?q=${encodeURIComponent(cityName)},CM&appid=${API_KEY}&units=metric;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.status === 404) {
            throw new Error(City "${cityName}" not found in Cameroon);
        }
        
        if (!response.ok) {
            throw new Error(API request failed: ${response.status});
        }
        
        const data = await response.json();
        
        return {
            region: data.name,
            temperature: data.main.temp,
            feels_like: data.main.feels_like,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            weather: data.weather[0].main,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            wind_speed: data.wind?.speed || 0,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        console.error(Error fetching weather for ${cityName}:, error.message);
        throw error;
    }
}

function getMockWeatherData() {
    return cameroonRegions.map(region => ({
        region: region.name,
        temperature: Math.floor(Math.random() * 15) + 20,
        feels_like: Math.floor(Math.random() * 15) + 20,
        humidity: Math.floor(Math.random() * 40) + 40,
        pressure: 1013,
        weather: ['Clear', 'Clouds', 'Rain', 'Thunderstorm'][Math.floor(Math.random() * 4)],
        description: 'Mock weather data',
        icon: '01d',
        wind_speed: Math.random() * 10,
        timestamp: new Date().toISOString()
    }));
}

export {
    fetchWeatherForAllRegions,
    fetchWeatherByCity,
    fetchWeatherData,
    getMockWeatherData,
    cameroonRegions
};
