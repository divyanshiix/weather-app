# 🌤️ Weatherly

A responsive weather application with user authentication, built with plain
HTML, CSS, and vanilla JavaScript (ES6+). Users must create an account or log
in before they can search for real-time weather data.

This project was built as a college-level HTML/CSS/JavaScript assignment —
no frameworks, no build tools, just files you can open in a browser.

---

## 1. Project Overview

Weatherly has three main screens:

1. **Login page** (`login.html`) — existing users sign in.
2. **Sign up page** (`signup.html`) — new users create an account.
3. **Dashboard** (`dashboard.html`) — a *protected* page where logged-in
   users search for a city and see its current weather.

Authentication is handled by **Firebase Authentication** (Email/Password).
Weather data comes from the **OpenWeatherMap API**, fetched with the native
`fetch()` API.

If you haven't set up Firebase or an OpenWeatherMap key yet, the app
automatically runs in a clearly-labeled **demo mode** so you can see the
whole UI and flow immediately. See [Demo Mode](#7-demo-mode) below.

---

## 2. Features

- Email/password Sign Up and Login
- Form validation with friendly inline error messages
- Protected dashboard — unauthenticated visitors are redirected to `login.html`
- Logout button
- City search with a real weather lookup (current temperature, condition,
  humidity, wind speed, and a weather icon)
- Loading indicator ("Fetching weather..." with a spinner) during searches
- Friendly error states for empty input, city-not-found, network failures,
  and auth failures — the UI never shows a blank screen or a raw JS error
- Fully responsive layout (desktop, tablet, mobile)
- Soft blue/white "glassmorphism" visual design

---

## 3. Technologies

| Layer          | Technology                          |
|----------------|--------------------------------------|
| Structure      | HTML5                                |
| Styling        | CSS3 (custom properties, Flexbox, Grid) |
| Behavior       | Vanilla JavaScript (ES6+)            |
| Authentication | Firebase Authentication              |
| Weather data   | OpenWeatherMap API                   |
| Networking     | Fetch API                            |

No frameworks (React, Vue, etc.) and no build step — just open the HTML
files in a browser or serve them with any static file server.

---

## 4. Folder Structure

```
weather-app/
├── index.html          # Entry point — redirects to login or dashboard
├── login.html          # Login page
├── signup.html         # Sign up page
├── dashboard.html      # Protected weather dashboard
├── css/
│   ├── style.css        # Shared design tokens, buttons, forms, cards
│   ├── auth.css          # Login/Sign up page styling
│   └── dashboard.css    # Dashboard-specific styling
├── js/
│   ├── firebase.js      # Firebase config + AuthService + demo auth fallback
│   ├── auth.js           # Login/Sign up form logic & validation
│   ├── weather.js       # searchWeather() + OpenWeatherMap integration
│   └── dashboard.js     # Dashboard route protection, search wiring, rendering
├── assets/
│   ├── icons/            # (place any custom icons here)
│   └── images/           # (place any custom images here)
└── README.md
```

---

## 5. How to Set Up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/) and
   create a new project (or reuse an existing one).
2. In the left sidebar, open **Build → Authentication**, click **Get started**,
   then enable the **Email/Password** sign-in provider.
3. Go to **Project settings** (gear icon) → scroll to **Your apps** → click
   the **Web (`</>`)** icon to register a new web app.
4. Firebase will show you a config object like this:

   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```

5. Open `js/firebase.js` and paste those values into the `FIREBASE_CONFIG`
   object at the top of the file (it's clearly marked as the
   **CONFIGURATION AREA**).
6. That's it — `DEMO_MODE` automatically turns itself off once it detects
   you've replaced the placeholder `apiKey`.

---

## 6. How to Add the OpenWeatherMap API Key

1. Create a free account at [openweathermap.org/api](https://openweathermap.org/api).
2. Under your account → **API keys**, generate a new key. (New keys can take
   up to a couple of hours to activate — this is normal.)
3. Open `js/weather.js` and paste your key into the `OPENWEATHER_API_KEY`
   constant at the top of the file (also marked as the **CONFIGURATION AREA**).
4. Save the file — `WEATHER_DEMO_MODE` turns itself off automatically once a
   real key is present.

---

## 7. Demo Mode

To make the project easy to open and test immediately, Weatherly ships with
two independent demo fallbacks, **both clearly labeled in the code and UI**:

- **Demo Auth** (`js/firebase.js`): if `FIREBASE_CONFIG` still has its
  placeholder `apiKey`, sign up/login/logout are simulated using
  `localStorage` instead of real Firebase. This is for UI testing only and
  is not secure — replace the Firebase config before using this for
  anything real.
- **Demo Weather** (`js/weather.js`): if `OPENWEATHER_API_KEY` still has its
  placeholder value, `searchWeather()` returns realistic sample data instead
  of calling the real API, and the dashboard shows a yellow "Showing demo
  weather data" banner so it's never mistaken for a live result.

Once you add real credentials for both, these fallbacks switch off
automatically and the app uses the real services — no other code changes
needed.

---

## 8. How to Run the Project Locally

Because the app only uses static files, you have two options:

**Option A — just open it:**
Double-click `index.html` (or `login.html`) to open it directly in your
browser. Demo mode works fine this way.

**Option B — use a local server (recommended, especially once Firebase is
connected):**

```bash
# Using Python 3
cd weather-app
python -m http.server 5500

# Then visit:
# http://localhost:5500/login.html
```

You can also use the VS Code "Live Server" extension.

> If you're using real Firebase Authentication, remember to add your local
> URL (e.g. `localhost`) to **Firebase Console → Authentication → Settings →
> Authorized domains** if it isn't already listed.

---

## 9. How Authentication Works

- `js/firebase.js` initializes Firebase (or the demo fallback) and exposes a
  single `AuthService` object with four methods used everywhere else:
  `logIn()`, `signUp()`, `logOut()`, and `onAuthStateChanged()`.
- `js/auth.js` wires up the Login and Sign Up forms: it validates input,
  calls `AuthService`, shows friendly error messages, and redirects to
  `dashboard.html` on success.
- `js/dashboard.js` calls `AuthService.onAuthStateChanged()` as soon as the
  dashboard loads. If there is **no** logged-in user, it immediately
  redirects to `login.html` — this is what makes the dashboard "protected."
- The Logout button calls `AuthService.logOut()` and returns the user to the
  login page.

---

## 10. How Weather API Integration Works

- `js/weather.js` exports a single function, `searchWeather(city)`, that:
  1. Validates that a city was actually typed in.
  2. Builds a request URL for OpenWeatherMap's `/data/2.5/weather` endpoint.
  3. Calls it with `fetch()`.
  4. Handles specific failure cases (404 = city not found, 401 = bad API
     key, network failure, etc.) and throws a friendly `Error` for each.
  5. On success, normalizes the raw JSON into a simple object
     (`city`, `temperature`, `condition`, `humidity`, `windSpeed`,
     `iconCode`, ...).
- `js/dashboard.js` calls `searchWeather(city)` when the search form is
  submitted, shows the "Fetching weather..." loading indicator while it
  waits, and then either renders the result card or shows an error message
  — the screen is never left blank.

---

## 11. Testing Checklist

- [ ] Visiting `dashboard.html` directly while logged out redirects to `login.html`
- [ ] Sign up with a new email → redirected to the dashboard, name/email shown correctly
- [ ] Sign up with an email that's already registered → friendly error shown
- [ ] Sign up with mismatched passwords → inline "Passwords do not match" error
- [ ] Log in with correct credentials → redirected to dashboard
- [ ] Log in with wrong password / unknown email → friendly error shown
- [ ] Logout button returns you to the login page and blocks dashboard access again
- [ ] Searching a real city shows temperature, condition, humidity, wind speed, and an icon
- [ ] Searching an empty string shows a validation message (no request is made)
- [ ] Searching a nonexistent city shows a "couldn't find that city" message
- [ ] Turning off Wi-Fi and searching shows a network error message, not a blank screen
- [ ] Resizing the browser (or testing on a phone) keeps the layout usable

---

## 12. Notes for Your Viva / Demo

- All third-party keys live in two clearly marked **CONFIGURATION AREA**
  blocks (`js/firebase.js` and `js/weather.js`) — nothing is hard-coded
  elsewhere.
- No weather data is ever invented once a real API key is in place; the
  demo data path is fully separate and visibly labeled in the UI.
- Every JS file has a single responsibility (`firebase.js` = auth setup,
  `auth.js` = auth forms, `weather.js` = API calls, `dashboard.js` = page
  behavior), which makes it easy to explain each piece on its own.
