const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.use(express.json());

// ============================
// ROUTES
// ============================

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Weather API Server is running!"
  });
});

// GET weather for multiple cities - MUST be before /:city
app.post('/weather/multiple', async (req, res) => {
  try {
    const { cities } = req.body;

    if (!cities || !Array.isArray(cities) || cities.length === 0) {
      return res.status(400).json({ error: "Please provide an array of cities" });
    }

    if (cities.length > 5) {
      return res.status(400).json({ error: "Maximum 5 cities allowed" });
    }

    const results = [];

    for (const city of cities) {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: city,
            appid: WEATHER_API_KEY,
            units: 'metric'
          }
        }
      );
      const data = response.data;
      results.push({
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        condition: data.weather[0].main,
        humidity: data.main.humidity
      });
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });

  } catch (err) {
    console.log('Multiple cities error:', err.message);
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: "One or more cities not found" });
    }
    if (err.response && err.response.status === 401) {
      return res.status(401).json({ error: "Invalid API key" });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET weather by city name
app.get('/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          appid: WEATHER_API_KEY,
          units: 'metric'
        }
      }
    );

    const data = response.data;

    const weather = {
      city: data.name,
      country: data.sys.country,
      temperature: {
        current: data.main.temp,
        feels_like: data.main.feels_like,
        min: data.main.temp_min,
        max: data.main.temp_max
      },
      humidity: data.main.humidity,
      weather: {
        condition: data.weather[0].main,
        description: data.weather[0].description
      },
      wind: {
        speed: data.wind.speed,
        unit: "m/s"
      },
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: weather
    });

  } catch (err) {
    console.log('Single city error:', err.message);
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: "City not found" });
    }
    if (err.response && err.response.status === 401) {
      return res.status(401).json({ error: "Invalid API key" });
    }
    res.status(500).json({ error: err.message });
  }
});

// ============================
// START SERVER
// ============================
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});