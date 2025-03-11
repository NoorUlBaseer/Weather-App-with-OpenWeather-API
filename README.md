# Weather App
## Changes for the Update Readme Branch (SCD Lab 07)

![Weather App Logo](images/logo.png)  <!-- Update the image path if necessary -->

## Description

The Weather App is a user-friendly application that allows users to view current weather conditions and a 5-day forecast for any city around the globe. With a clean interface and interactive charts, it provides detailed weather data, including temperature, wind speed, and weather descriptions. 

## Features

- **Current Weather**: Get real-time weather data for your current location or any specified city.
- **5-Day Forecast**: View the weather forecast for the next five days, including daily averages and conditions.
- **Temperature Unit Toggle**: Easily switch between Celsius and Fahrenheit for temperature readings.
- **Interactive Charts**: Visualize temperature trends with bar charts, doughnut charts, and line charts.
- **User-friendly Design**: A simple and intuitive layout for a smooth user experience.
- **Chatbot Integration**: Ask questions about the weather and get responses directly from the chatbot.

## Technologies Used

- HTML
- CSS
- JavaScript
- Chart.js (for chart visualizations)
- OpenWeatherMap API (for weather data)
- Google Generative AI (for chatbot functionality)

## Installation

To run the Weather App locally, follow these steps:

1. Clone this repository:
   ``git clone https://github.com/NoorUlBaseer/Weather-App-with-OpenWeather-API``
2. Then run:
    ``cd weather-app``
3. Open `index.html` in your web browser.

## Usage
   
1. Upon loading the app, you can either allow location access or enter a city name in the search bar.

2. Click the **Search** button to fetch weather data in case using search bar.

3. Use the **Toggle Switch** to switch between Celsius and Fahrenheit.

4. Explore the charts for visual representation of temperature trends.

5. View current weather details or go to next page for the 5-day forecast. 

6. Interact with the chatbot by typing questions related to the weather.

## API Key Setup

To access the weather data, you'll need an API key from OpenWeatherMap:

1. Sign up at [OpenWeatherMap](https://openweathermap.org/appid) to get your API key.

2. Replace the placeholder API key in `script.js`:
   ``const apiKey = 'YOUR_API_KEY_HERE'; // Your API Key``

## Contributing

Contributions are welcome! If you'd like to improve the app, feel free to submit a pull request. Please ensure that your changes are well-documented.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data.
- [Chart.js](https://www.chartjs.org/) for the charting library.
- [Google Generative AI](https://ai.google.dev/gemini-api/docs/quickstart?lang=web) for chatbot functionality.
