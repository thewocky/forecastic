# Forecast IO 5-day display

## Overview

This app uses the ForecastIO API to gather current weather conditions and the 5-day forecast for a given location. It displays the current temp and conditions by default. The user may click/tap on a day within the forecast to focus on that day.

The interface plans for additional functionality that hasn’t yet been implemented:
• Ability for user to use current location (geolocation API)
• Ability for user to add new locations & manage list
• Ability to view more details on a focused view (e.g. hourly forecast, wind speed, storm warning, etc.)
• Functionality that references historical ForecastIO data to find record high & low temperatures for the same date in previous years.
• May be used to reinforce global climate change trends
• Functionality to allow user to grab and drag the hi and low records along the scale. 
• Algorithm to pull images from Google Images to populate background. Cross-reference historical ForecastIO data to find photos that most closely match current weather conditions.
• Routes implementation to allow user to change view based on URL
• Color gradient should be generated dynamically and cool/warm text colors should be dynamic.


Uses PHP Proxy to work around x-domain policy.
https://github.com/iantearle/forecast.io-javascript-api

Get an API key at https://darksky.net/. Don’t want to distribute my own key publicly. Store it as
in app/proxy.php.

To run, fire up a server and point the browser to app/index.html

Notes and disclaimers:
• Random temps are generated for record highs and lows
• Styling is not bulletproof; tested primarily on Chrome so may be some cross-browser/-device ugliness. Responsiveness could use some fine-tuning.
• Code could be refactored. Custom JS is located in controllers.js. Most custom styles are in scss/templates.