# weather-app

Responsive weather app built with vanilla HTML, CSS, and JavaScript.

## Features
- Firebase email/password authentication (sign up, log in, log out)
- Weather search is available only for authenticated users
- Real-time weather data from OpenWeatherMap
- Mobile-friendly responsive UI

## Setup
1. Open `/home/runner/work/weather-app/weather-app/script.js`.
2. Replace the `REPLACE_WITH_*` Firebase config placeholders.
3. Replace `REPLACE_WITH_OPENWEATHERMAP_API_KEY` with your OpenWeatherMap API key.
4. Serve the app from the repository root, for example:
   ```bash
   python3 -m http.server 8080
   ```
5. Open `http://localhost:8080`.
