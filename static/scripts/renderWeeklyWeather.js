import { convertDate, createDivElement } from "./utils.js";
import { renderDailyDetails } from "./renderDailyDetails.js";

function hideWeatherDisplay() {
  document.getElementById("weather-display").style.display = "none";
}

export async function renderCurrentWeather(locationString, weather) {
  const weatherCodeMapping =
      await fetch("/scripts/weatherCodes.json").then(response => response.json());
  const { desc, icon } = weatherCodeMapping[weather.weatherCode];
  // Set the location
  document.querySelector(".formatted-address").textContent = locationString;
  // Set the weather description and icon
  document.getElementById("weather-icon").src = icon;
  document.getElementById("weather-desc").textContent = desc;
  // Set the weather fields
  document.getElementById("temperature").textContent = weather.temperature;
  document.getElementById("humidity").textContent = weather.humidity + "%";
  document.getElementById("pressure").textContent = weather.pressureSeaLevel + "inHg";
  document.getElementById("wind-speed").textContent = weather.windSpeed + "mph";
  document.getElementById("visibility").textContent = weather.visibility + "mi";
  document.getElementById("cloud-cover").textContent = weather.cloudCover + "%";
  document.getElementById("uv-level").textContent = weather.uvIndex;
}

// Render the weekly weather in 6 or 7 rows. Each row contains the following columns:
// Date, Weather Status, Max Temperature, Min Temperature, Wind Speed
export async function renderWeeklyWeather(weeklyWeather) {
  const weeklyWeatherDiv = document.getElementById("weekly-weather");
  if (weeklyWeatherDiv.childElementCount > 1) {
    // only reserve the first child (table header) and remove the rest children
    // to avoid duplicate rendering (e.g., when the user clicks on the search button multiple times)
    weeklyWeatherDiv.innerHTML = weeklyWeatherDiv.firstElementChild.outerHTML;
  }
  const weatherCodeMapping =
      await fetch("/scripts/weatherCodes.json").then(response => response.json());
  // Create a column
  function createWeatherStatusColumn(dailyWeather, weatherCodeMapping) {
    const weatherDescDiv = createDivElement("weather-item weather-status", "");
    const { desc, icon } = weatherCodeMapping[dailyWeather.values.weatherCode];
    const weatherIcon = document.createElement("img");
    weatherIcon.src = icon;
    weatherIcon.alt = desc;
    weatherDescDiv.appendChild(weatherIcon);
    weatherDescDiv.appendChild(createDivElement("weather-desc", desc));
    return weatherDescDiv;
  }
  // Create a row
  function createWeatherRow(dailyWeather) {
    const weatherRowDiv = createDivElement("weather-row", "");
    weatherRowDiv.appendChild(createDivElement("weather-item", convertDate(dailyWeather.startTime)));
    weatherRowDiv.appendChild(createWeatherStatusColumn(dailyWeather, weatherCodeMapping));
    weatherRowDiv.appendChild(createDivElement("weather-item", dailyWeather.values.temperatureMax));
    weatherRowDiv.appendChild(createDivElement("weather-item", dailyWeather.values.temperatureMin));
    weatherRowDiv.appendChild(createDivElement("weather-item", dailyWeather.values.windSpeed));
    return weatherRowDiv;
  }

  for (const dailyWeather of weeklyWeather) {
    const weatherRowDiv = createWeatherRow(dailyWeather);
    // Add a click event listener to each row
    weatherRowDiv.onclick = () => {
      hideWeatherDisplay();
      renderDailyDetails(dailyWeather);
      const event = new CustomEvent("dailyWeatherSelected");
      document.dispatchEvent(event);
    }
    weeklyWeatherDiv.appendChild(weatherRowDiv);
  }
}