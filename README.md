# Project 4: Third-Party API Integration
Built with Node.js, Express.js and OpenWeatherMap API for DecodeLabs Industrial Training 2026.

## How to Run
1. Install dependencies
   npm install

2. Add your API key to .env file
   WEATHER_API_KEY=your_key_here
   PORT=3000

3. Start the server
   npm start

4. Server runs on http://localhost:3000

## API Endpoints

| Method | Route                | Description              |
|--------|----------------------|--------------------------|
| GET    | /                    | Health check             |
| GET    | /weather/:city       | Get weather by city      |
| POST   | /weather/multiple    | Get weather for 5 cities |

## Example Requests

### Single City
GET http://localhost:3000/weather/London

### Multiple Cities
POST http://localhost:3000/weather/multiple
{
  "cities": ["London", "Delhi", "Tokyo"]
}

## Status Codes
- 200 OK
- 400 Bad Request
- 401 Invalid API Key
- 404 City Not Found
- 500 Server Error

## Tech Stack
- Node.js
- Express.js
- Axios
- OpenWeatherMap API