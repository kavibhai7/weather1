const apiKey = '0b428ea8e7150a53e7ddedee87302864';

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("cityInput").addEventListener("keypress", e => {
  if (e.key === "Enter") getWeather();
});

async function getWeather() {
  const city = document.getElementById('cityInput').value || 'delhi';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const weatherBox = document.getElementById('weather');

    if (data.cod !== 200) {
      weatherBox.innerHTML = `<p>City not found. Please try again.</p>`;
      document.body.style.background = 'linear-gradient(to bottom, #ff4e50, #f9d423)';
      return;
    }

    const now = data.dt, sunrise = data.sys.sunrise, sunset = data.sys.sunset;
    const isDay = now >= sunrise && now < sunset;
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    // Day/Night background
    document.body.style.background = isDay
      ? 'linear-gradient(to bottom, #76c2dfff, #1d2a2dff)'
      : 'linear-gradient(to bottom, #0b0c2a, #2c3e50)';

    weatherBox.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <img src="${iconUrl}" alt="Weather icon">
      <p><strong>${data.weather[0].main}</strong></p>
      <p>Temperature: ${data.main.temp} °C</p>
      <p>Feels Like: ${data.main.feels_like} °C</p>
      <p>Pressure: ${data.main.pressure} hPa</p>
      <p>Visibility: ${data.visibility} meters</p>
      <p>Cloudiness: ${data.clouds.all}%</p>
      <p>Sea Level: ${data.main.sea_level ? data.main.sea_level + ' hPa' : 'N/A'}</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p><strong>${isDay ? '☀ Day time' : '🌙 Night time'}</strong></p>
      <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
      <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
    `;

    await getForecast(city); // ← Forecast Load  

    document.getElementById('cityInput').focus();
  } catch (err) {
    document.getElementById('weather').innerHTML = `<p>Error fetching data.</p>`;
    console.error(err);
  }
}

async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const forecastBox = document.getElementById('forecast');

    if (data.cod !== "200") {
      forecastBox.innerHTML = `<p>Forecast not available.</p>`;
      return;
    }

    const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    let html = `<h3>5-Day Forecast</h3>`;
    html += `<div style="display:flex; gap:15px; flex-wrap:wrap;">`;

    daily.forEach(day => {
      html += `
        <div style="padding:10px; background:#ffffff22; border-radius:8px; width:120px; text-align:center;">
          <p><strong>${new Date(day.dt * 1000).toLocaleDateString()}</strong></p>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
          <p>${day.weather[0].main}</p>
          <p>${day.main.temp}°C</p>
          <p>Wind: ${day.wind.speed} m/s</p>
          <p>Humidity: ${day.main.humidity}%</p>
        </div>
      `;
    });

    html += `</div>`;
    forecastBox.innerHTML = html;

  } catch (err) {
    console.error(err);
    document.getElementById('forecast').innerHTML = `<p>Error loading forecast.</p>`;
  }
}

window.onload = getWeather;
