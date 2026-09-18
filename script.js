import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
  apiKey: "REPLACE_WITH_FIREBASE_API_KEY",
  authDomain: "REPLACE_WITH_FIREBASE_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_FIREBASE_PROJECT_ID",
  appId: "REPLACE_WITH_FIREBASE_APP_ID",
};

const OPEN_WEATHER_MAP_API_KEY = "REPLACE_WITH_OPENWEATHERMAP_API_KEY";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const authForm = document.getElementById("auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const authStatus = document.getElementById("auth-status");
const authSection = document.getElementById("auth-section");
const weatherSection = document.getElementById("weather-section");
const sessionText = document.getElementById("session-text");

const weatherForm = document.getElementById("weather-form");
const cityInput = document.getElementById("city");
const weatherStatus = document.getElementById("weather-status");
const weatherResult = document.getElementById("weather-result");

function setMessage(node, text, isError = false) {
  node.textContent = text;
  node.style.color = isError ? "#b91c1c" : "#0f172a";
}

function showWeather(data) {
  weatherResult.innerHTML = `
    <h3>${data.name}, ${data.sys.country}</h3>
    <p><strong>${Math.round(data.main.temp)}°C</strong> — ${data.weather[0].description}</p>
    <p>Feels like: ${Math.round(data.main.feels_like)}°C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind: ${data.wind.speed} m/s</p>
  `;
  weatherResult.classList.remove("hidden");
}

async function fetchWeather(city) {
  const endpoint = new URL("https://api.openweathermap.org/data/2.5/weather");
  endpoint.searchParams.set("q", city);
  endpoint.searchParams.set("units", "metric");
  endpoint.searchParams.set("appid", OPEN_WEATHER_MAP_API_KEY);

  const response = await fetch(endpoint);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to fetch weather data.");
  }

  return data;
}

function ensureConfig() {
  const missingFirebaseField = Object.values(firebaseConfig).some((value) => value.startsWith("REPLACE_WITH_"));
  const missingWeatherKey = OPEN_WEATHER_MAP_API_KEY.startsWith("REPLACE_WITH_");

  if (missingFirebaseField || missingWeatherKey) {
    const msg = "Set Firebase and OpenWeatherMap keys in script.js before using the app.";
    setMessage(authStatus, msg, true);
    setMessage(weatherStatus, msg, true);
    return false;
  }

  return true;
}

signupBtn.addEventListener("click", async () => {
  if (!ensureConfig()) return;

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    authForm.reset();
    setMessage(authStatus, "Account created and logged in.");
  } catch (error) {
    setMessage(authStatus, error.message, true);
  }
});

loginBtn.addEventListener("click", async () => {
  if (!ensureConfig()) return;

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    authForm.reset();
    setMessage(authStatus, "Logged in successfully.");
  } catch (error) {
    setMessage(authStatus, error.message, true);
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    weatherForm.reset();
    weatherResult.classList.add("hidden");
    weatherResult.innerHTML = "";
    setMessage(weatherStatus, "Logged out.");
  } catch (error) {
    setMessage(weatherStatus, error.message, true);
  }
});

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!ensureConfig()) return;

  const city = cityInput.value.trim();
  if (!city) {
    setMessage(weatherStatus, "Please enter a city.", true);
    return;
  }

  setMessage(weatherStatus, "Loading weather...");

  try {
    const data = await fetchWeather(city);
    showWeather(data);
    setMessage(weatherStatus, "Weather loaded.");
  } catch (error) {
    weatherResult.classList.add("hidden");
    weatherResult.innerHTML = "";
    setMessage(weatherStatus, error.message, true);
  }
});

onAuthStateChanged(auth, (user) => {
  const loggedIn = Boolean(user);
  authSection.classList.toggle("hidden", loggedIn);
  weatherSection.classList.toggle("hidden", !loggedIn);

  if (user) {
    sessionText.textContent = `Logged in as ${user.email}`;
    setMessage(weatherStatus, "Search for a city to get live weather.");
  }
});

ensureConfig();
