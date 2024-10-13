const apiKey = '162313a01ef4e4c6097184872641259a'; // Your API Key
let forecastData = [];
let currentPage = 1;
const itemsPerPage = 10;

// Helper function to capitalize the first letter of each word
function capitalizeFirstLetterOfEachWord(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

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
    const description = capitalizeFirstLetterOfEachWord(data.weather[0].description);
    const tempCelsius = (data.main.temp - 273.15).toFixed(2);
    const windSpeed = data.wind.speed;
    const location = data.name;

    // Update the forecast heading
    const forecastHeading = document.querySelector('.forecast-container h3');
    forecastHeading.innerHTML = `5-Day Weather Forecast of ${location}`;

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

    weatherElement.innerHTML = `
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Weather:</strong> ${description}</p>
        <p><strong>Temperature:</strong> ${tempCelsius} °C</p>
        <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
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

            // Calculate daily averages
            const averageTemperatures = calculateDailyAverages(forecastData);

            // Create Bar Chart with average temperatures
            createBarChart(averageTemperatures);

            // Create Doughnut Chart with weather conditions
            createDoughnutChart(forecastData);

            // Create Line Chart with average temperatures
            createLineChart(averageTemperatures);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

// Function to display forecast with boxes instead of table
function displayForecast(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const forecastGrid = document.getElementById('forecastGrid'); // Make sure this element exists
    forecastGrid.innerHTML = ''; // Clear previous data

    const paginatedData = forecastData.slice(start, end);
    paginatedData.forEach(entry => {
        const date = new Date(entry.dt * 1000); // Convert Unix timestamp to Date object
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
        const formattedDate = date.toLocaleString('en-PK', options).replace(',', ''); // Format to "DD-MM-YYYY HH:MM AM"
        
        const description = capitalizeFirstLetterOfEachWord(entry.weather[0].description);
        const tempCelsius = (entry.main.temp - 273.15).toFixed(2);
        const windSpeed = entry.wind.speed;

        // Get the weather icon from the API
        const iconCode = entry.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Create forecast box structure
        const box = document.createElement('div');
        box.classList.add('forecast-box');
        box.innerHTML = `
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Weather:</strong> ${description}</p>
            <p><strong>Temperature:</strong> ${tempCelsius} °C</p>
            <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
            <img src="${iconUrl}" class="forecast-icon" alt="Weather Icon">
        `;

        // Append the forecast box to the grid
        forecastGrid.appendChild(box);
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
        currentPage = 1; // Reset to page 1 when a new city is searched
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

// Add an event listener to the input field for the Enter key
document.getElementById('cityInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchWeather(); // Call the searchWeather function when Enter is pressed
    }
});

// Function to group forecast data by day and calculate the average temperature
function calculateDailyAverages(forecastData) {
    const dailyTemperatures = {};
    const dailyCount = {};

    // Group temperatures by day
    forecastData.forEach(entry => {
        const date = new Date(entry.dt * 1000).toLocaleDateString('en-US', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
        const tempCelsius = entry.main.temp - 273.15; // Convert from Kelvin to Celsius

        if (!dailyTemperatures[date]) {
            dailyTemperatures[date] = 0;
            dailyCount[date] = 0;
        }
        dailyTemperatures[date] += tempCelsius;
        dailyCount[date] += 1;
    });

    // Calculate average for each day
    const averageTemperatures = Object.keys(dailyTemperatures).map(date => ({
        date: date,
        avgTemp: (dailyTemperatures[date] / dailyCount[date]).toFixed(2)
    }));

    // Ensure we return at least 6 days
    return averageTemperatures.slice(0, 6); // Now returning the first 6 days, not just 5
}

// Function to create Bar Chart with average temperatures for the next 5 days
function createBarChart(averageTemperatures) {
    // Clear the existing chart if it exists
    const existingChart = Chart.getChart('barChart'); // Assuming 'barChart' is the ID of your canvas element
    if (existingChart) {
        existingChart.destroy();
    }

    // Now we slice to get up to 6 days instead of 5
    const limitedDays = averageTemperatures.slice(0, 6); 

    const labels = limitedDays.map(day => {
        const dateParts = day.date.split('/'); // Split date string into components
        return `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`; // Reformat as DD/MM/YYYY
    });

    const data = limitedDays.map(day => day.avgTemp);

    const barChart = new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: labels, // Formatted as DD/MM/YYYY
            datasets: [{
                label: 'Average Temperature (°C)',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    min: Math.min(...data) - 5,  // Setting a lower minimum value
                    max: Math.max(...data) + 5   // Setting a higher maximum value
                }
            },
            animation: {
                delay: 500
            }
        }
    });
}

// Function to create Doughnut Chart
function createDoughnutChart(forecastData) {
    // Clear the existing chart if it exists
    const existingChart = Chart.getChart('doughnutChart'); // Assuming 'doughnutChart' is the ID of your canvas element
    if (existingChart) {
        existingChart.destroy();
    }

    const forecastDays = forecastData.slice(0, 40); // Data for 5 days (3-hour intervals)

    // Create a map to group weather conditions by date
    const weatherByDate = {};

    forecastDays.forEach(entry => {
        const date = new Date(entry.dt * 1000).toLocaleDateString(); // Get the date (MM/DD/YYYY)
        const description = entry.weather[0].description.toLowerCase(); // Get the detailed description
        
        // Classify each description into the generic weather condition
        let genericCondition = '';

        if (description.includes('clear')) {
            genericCondition = 'Clear';
        } else if (description.includes('cloud')) {
            genericCondition = 'Clouds';
        } else if (description.includes('rain') && !description.includes('thunderstorm') && !description.includes('drizzle')) {
            genericCondition = 'Rain';
        } else if (description.includes('thunderstorm')) {
            genericCondition = 'Thunderstorm';
        } else if (description.includes('drizzle')) {
            genericCondition = 'Drizzle';
        } else if (description.includes('snow') || description.includes('sleet')) {
            genericCondition = 'Snow';
        } else if (description.includes('mist') || description.includes('fog') || description.includes('haze')) {
            genericCondition = 'Mist/Fog';
        } else if (description.includes('dust') || description.includes('sand')) {
            genericCondition = 'Dust/Sand';
        } else if (description.includes('smoke')) {
            genericCondition = 'Smoke';
        } else if (description.includes('volcanic ash')) {
            genericCondition = 'Volcanic Ash';
        } else if (description.includes('squall')) {
            genericCondition = 'Squall';
        } else if (description.includes('tornado')) {
            genericCondition = 'Tornado';
        }

        // Initialize the object for this date if it doesn't exist
        if (!weatherByDate[date]) {
            weatherByDate[date] = {};
        }

        // Count occurrences of each generic weather condition
        if (genericCondition) {
            if (weatherByDate[date][genericCondition]) {
                weatherByDate[date][genericCondition]++;
            } else {
                weatherByDate[date][genericCondition] = 1;
            }
        }
    });

    // Create a map to count the occurrences of each weather condition across all days
    const weatherConditionCounts = {};

    for (const date in weatherByDate) {
        const conditions = weatherByDate[date];
        const conditionEntries = Object.entries(conditions); // Array of [condition, count]

        // Sort by count, descending, to find the most frequent condition(s)
        conditionEntries.sort((a, b) => b[1] - a[1]);

        // The most frequent count for the day
        const highestCount = conditionEntries[0][1];

        // Increment counts for conditions that have the highest frequency
        conditionEntries.forEach(([condition, count]) => {
            if (count === highestCount) {
                if (weatherConditionCounts[condition]) {
                    weatherConditionCounts[condition]++;
                } else {
                    weatherConditionCounts[condition] = 1;
                }
            }
        });
    }

    // Prepare data for the chart
    const weatherConditions = Object.keys(weatherConditionCounts); // Weather conditions as labels
    const conditionCounts = Object.values(weatherConditionCounts); // Counts for each condition

    // Calculate the total entries for percentage calculation
    const totalEntries = Object.values(weatherConditionCounts).reduce((a, b) => a + b, 0);

    // Calculate the percentages
    const conditionPercentages = conditionCounts.map(count => ((count / totalEntries) * 100).toFixed(2));

    // Create the doughnut chart
    const doughnutChart = new Chart(document.getElementById('doughnutChart'), {
        type: 'doughnut',
        data: {
            labels: weatherConditions, // Weather conditions as labels
            datasets: [{
                label: 'Weather Conditions (%)',
                data: conditionPercentages, // Percentages for each condition
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',   // Color for Clear
                    'rgba(54, 162, 235, 0.6)',   // Color for Clouds
                    'rgba(75, 192, 192, 0.6)',   // Color for Rain
                    'rgba(255, 206, 86, 0.6)',   // Color for Drizzle
                    'rgba(153, 102, 255, 0.6)',  // Color for Thunderstorm
                    'rgba(255, 159, 64, 0.6)',   // Color for Snow
                    'rgba(201, 203, 207, 0.6)',  // Color for Mist/Fog
                    'rgba(160, 82, 45, 0.6)',    // Color for Dust/Sand
                    'rgba(70, 130, 180, 0.6)',   // Color for Smoke
                    'rgba(105, 105, 105, 0.6)',  // Color for Volcanic Ash
                    'rgba(0, 191, 255, 0.6)',    // Color for Squall
                    'rgba(255, 0, 0, 0.6)'       // Color for Tornado
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)',
                    'rgba(160, 82, 45, 1)',
                    'rgba(70, 130, 180, 1)',
                    'rgba(105, 105, 105, 1)',
                    'rgba(0, 191, 255, 1)',
                    'rgba(255, 0, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            animation: {
                delay: 500 // Delay animation for smooth effect
            },
            responsive: true,
            plugins: {
                legend: {
                    position: 'top', // Legend position
                },
            }
        }
    });
}

function createLineChart(averageTemperatures) {
    // Clear the existing chart if it exists
    const existingChart = Chart.getChart('lineChart'); // Assuming 'lineChart' is the ID of your canvas element
    if (existingChart) {
        existingChart.destroy();
    }

    // Prepare labels and data for the line chart
    const labels = averageTemperatures.map(day => {
        const dateParts = day.date.split('/'); // Split date string into components
        return `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`; // Reformat as DD/MM/YYYY
    });

    const data = averageTemperatures.map(day => day.avgTemp);

    // Create the line chart
    const lineChart = new Chart(document.getElementById('lineChart'), {
        type: 'line',
        data: {
            labels: labels, // Formatted as DD/MM/YYYY
            datasets: [{
                label: 'Temperature (°C)',
                data: data,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1 // Smooth the line
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    min: Math.min(...data) - 5, // Set a lower minimum value
                    max: Math.max(...data) + 5 // Set a higher maximum value
                }
            },
            animation: {
                onProgress: function(animation) {
                    this.chartArea.bottom += 5; // Drop effect
                },
                onComplete: function() {
                    this.chartArea.bottom = this.chartArea.bottom; // Reset position after animation
                }
            }
        }
    });
}
