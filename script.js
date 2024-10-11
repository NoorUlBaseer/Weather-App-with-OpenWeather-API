const apiKey = '162313a01ef4e4c6097184872641259a'; // Your API Key
let forecastData = [];
let currentPage = 1;
const itemsPerPage = 10;

// Function to get current location weather
function getWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateCurrentWeatherUI(data);
            get5DayForecast(lat, lon);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data, please try again.');
        });
}

// Function to update the UI for current weather
function updateCurrentWeatherUI(data) {
    const weatherElement = document.getElementById('weather');
    const description = data.weather[0].description;
    const tempCelsius = (data.main.temp - 273.15).toFixed(2);
    const location = data.name;

    // Get the icon code from the response
    const iconCode = data.weather[0].icon; // e.g., "01d"
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // URL for the icon image

    // Set the background image for the current weather box
    const weatherBox = document.querySelector('.current-weather-box');
    weatherBox.style.backgroundImage = `url(${iconUrl})`;
    weatherBox.style.backgroundSize = '150px'; // Limit the size of the icon
    weatherBox.style.backgroundPosition = 'right 20px top 5px'; // Position the icon nicely
    weatherBox.style.backgroundRepeat = 'no-repeat'; // Prevent image repetition
    weatherBox.style.color = 'white'; // Change text color for visibility
    weatherBox.style.padding = '20px'; // Ensure content inside the box is well padded
    weatherBox.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Add a slight overlay to enhance readability

    weatherElement.innerHTML = `
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Weather:</strong> ${description}</p>
        <p><strong>Temperature:</strong> ${tempCelsius} °C</p>
    `;
}

// Function to get 5-day forecast
function get5DayForecast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            forecastData = data.list;
            displayForecast(currentPage);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

// Function to display forecast with pagination
function displayForecast(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const forecastBody = document.getElementById('forecastBody');
    forecastBody.innerHTML = ''; // Clear previous data

    const paginatedData = forecastData.slice(start, end);
    paginatedData.forEach(entry => {
        const date = new Date(entry.dt * 1000); // Convert Unix timestamp to Date object
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
        const formattedDate = date.toLocaleString('en-PK', options).replace(',', ''); // Format to "DD-MM-YYYY HH:MM AM"
        
        const description = entry.weather[0].description;
        const tempCelsius = (entry.main.temp - 273.15).toFixed(2);
        const windSpeed = entry.wind.speed;

        const row = `
            <tr>
                <td>${formattedDate}</td>
                <td>${description}</td>
                <td>${tempCelsius} °C</td>
                <td>${windSpeed} m/s</td>
            </tr>
        `;
        forecastBody.innerHTML += row;
    });

    // Update pagination buttons
    document.getElementById('pageInfo').textContent = `Page ${page}`;
    document.getElementById('prevBtn').disabled = page === 1;
    document.getElementById('nextBtn').disabled = end >= forecastData.length;
}

// Pagination button event listeners
document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayForecast(currentPage);
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentPage * itemsPerPage < forecastData.length) {
        currentPage++;
        displayForecast(currentPage);
    }
});

// Get current location and load weather
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeather(lat, lon);
            },
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Function to search weather by city name (fallback or on-demand)
function searchWeather() {
    const city = document.getElementById('cityInput').value;
    if (city) {
        getWeatherByCity(city);
    } else {
        alert('Please enter a city name.');
    }
}

// Function to get weather data using city name
function getWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateCurrentWeatherUI(data);
            get5DayForecast(data.coord.lat, data.coord.lon);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('City not found! Please try again.');
        });
}

// Call the function to get the location when the page loads
window.onload = function() {
    getLocation();
};
