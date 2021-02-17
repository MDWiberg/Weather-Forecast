// JavaScript to handle fetch API from OpenWeatherData
// Author: Matthew Wiberg


// Set apiKey, url, and query parameters for forecast
const apiKey = '1fa11ef5c960a4eaaa9d50984858229f';
const urlCurrentDay = 'https://api.openweathermap.org/data/2.5/weather';
const urlFiveDay = 'https://api.openweathermap.org/data/2.5/forecast';
const cityParam = '?q=';
const appidParam = '&appid=';


// Select HTML elements/Nodes and declare variables
let cityInput = document.getElementById('city');
let submitBtn = document.getElementById('submitBtn');
let currentWeatherDiv = document.querySelector('.current-day-weather');
let fiveWeatherDiv = document.querySelector('.five-day-weather');
let currentDayWeatherCity = document.getElementById('current-day-weather-city');
let fiveDayWeatherCity = document.getElementById('five-day-weather-city');


// Boolean set to true or false later if network error occured or not
let networkOk = true;


// Fetch OpenWeatherData API
const getCurrentDayForecast = async () => {
  let cityInputValue = cityInput.value;
  // Build url to fetch
  let urlToFetch = urlCurrentDay + cityParam + cityInputValue + appidParam + apiKey;
  try{
    const response = await fetch(urlToFetch);
    if(response.ok){
      const jsonResponse = await response.json();
      networkOk = true;
      console.log(jsonResponse);
      return jsonResponse;
    }
    networkOk = false;
    throw new Error('Network response was not ok');
  }
  catch(err){
    console.log(err);
  }

};

const getFiveDayForecast = async () => {
  let cityInputValue = cityInput.value;
  // Build url to fetch
  let urlToFetch = urlFiveDay + cityParam + cityInputValue + appidParam + apiKey;
  try{
    const response = await fetch(urlToFetch);
    if(response.ok){
      const jsonResponse = await response.json();
      networkOk = true;
      console.log(jsonResponse);
      return jsonResponse;
    }
    networkOk = false;
    throw new Error('Network response was not ok');
  }
  catch(err){
    console.log(err);
  }

};


// Render response information
const renderCurrentDayForecast = (jsonResponse) => {

  // Store new date object to get current day
  let currentDate = new Date();
  let todayNum = currentDate.getDay();
  let today = "";

  // Convert day of week to a string 
  switch(todayNum){
    case 0:
      today = 'Sunday';
      break;
    case 1:
      today = 'Monday';
      break;
    case 2:
      today = 'Tuesday';
      break;
    case 3:
      today = 'Wednesday';
      break;
    case 4:
      today = 'Thursday';
      break;
    case 5:
      today = 'Friday';
      break;
    case 6:
      today = 'Saturday';
      break;
  }

  // Clear current days forecast for new search to take its place
  currentWeatherDiv.innerHTML = "";
  
  // Build html content to be inserted
  let forecastContent = '<h4>' + today + '</h4> <p>Temperature: ' + Math.round(kelvinToFahrenheit(jsonResponse.main.temp)) + 
  '&deg;</p> <p>Feels like: ' + Math.round(kelvinToFahrenheit(jsonResponse.main.feels_like)) + 
  '&deg;</p> <p>' + (jsonResponse.weather)[0].description[0].toUpperCase() + (jsonResponse.weather)[0].description.slice(1) + 
  '</p>';

  // Edit padding on div container this html is going into
  currentWeatherDiv.style.padding = "5px 20px"

  // Append forecast content to corresponding div container
  currentWeatherDiv.innerHTML += forecastContent;
};

const renderFiveDayForecast = (jsonResponse) => {

  // Clears the city name from previous search and makes it empty incase new search fails
  currentDayWeatherCity.innerHTML = "";

  // Only runs search code if network response was okay
  if(networkOk){

    // Store date information from current date to work with later in if statement
    let currentDate = new Date();
    let currentDayMonth = currentDate.getDate(); // 15 - Day of Month (15th of Feburary)
    let currentDayWeek = currentDate.getDay(); // 1 - Monday

    // Will hold the string day of the week
    let day = '';

    // Insert City name to <h3> tag
    currentDayWeatherCity.innerHTML = jsonResponse.city.name;

    // Run loop to search each item in the list array
    for(let i=0;i<jsonResponse.list.length;i++){

      // Store date information returned from fetch to work with in if statement
      let currentArrItem = jsonResponse.list[i];
      let currentArrItemDay = currentArrItem.dt_txt.slice(8,10);
      let currentArrItemDayTime = currentArrItem.dt_txt.slice(11); 
      
      // Returns information about the following five days at 12:00:00
      if(currentArrItemDay > currentDayMonth && currentArrItemDayTime === "12:00:00"){

        // Update to get the next day
        currentDayWeek += 1;

        // Handles the value returning to 0 rather than continuing past 6
        if(currentDayWeek > 6){
          currentDayWeek = 0;
        }

        // Convert day of week to a string 
        switch(currentDayWeek){
          case 0:
            day = 'Sunday';
            break;
          case 1:
            day = 'Monday';
            break;
          case 2:
            day = 'Tuesday';
            break;
          case 3:
            day = 'Wednesday';
            break;
          case 4:
            day = 'Thursday';
            break;
          case 5:
            day = 'Friday';
            break;
          case 6:
            day = 'Saturday';
            break;
        }

        // Save values for use in formatting
        let temp = jsonResponse.list[i].main.temp;
        let feels_like = jsonResponse.list[i].main.feels_like;
        let weatherDescription = jsonResponse.list[i].weather[0].description;

        // Build html content to be inserted
        let forecastContent = '<div class="day-forecast container"><h4>' + day + '</h4> <p>Temperature: ' + Math.round(kelvinToFahrenheit(temp)) + 
        '&deg;</p> <p>Feels like: ' + Math.round(kelvinToFahrenheit(feels_like)) + 
        '&deg;</p> <p>' + (weatherDescription)[0].toUpperCase() + (weatherDescription).slice(1) + 
        '</p></div>';

        // Append forecast content to corresponding div container
        fiveWeatherDiv.innerHTML += forecastContent;

      }

    }

  }

};


// Add event handler
const executeSearch = (event) => {
  
  // Prevent default form submission 
  event.preventDefault();

  // Clear old existing forecast information in weather div container
  fiveWeatherDiv.innerHTML = "";

  // Remove focus from submit button to reset color back to white
  submitBtn.blur();
  
  // Call getCurrentDayForecast function to fetch todays weather information and renderCurrentDayForecast function to render response
  getCurrentDayForecast()
  .then(forecast => {
    return renderCurrentDayForecast(forecast)
  });

  // Call getFiveDayForecast function to fetch five days of weather forecast information and renderFiveDayForecast function to render response
  getFiveDayForecast()
  .then(forecast => {
    return renderFiveDayForecast(forecast)
  });
  // .catch(err => {
  //   console.log(err);
  // });

  // Clear input field
  cityInput.value = "";
};


// Add event listener
submitBtn.addEventListener('click', executeSearch);


// Helper Functions

// Kelvin to Fahrenheit
const kelvinToFahrenheit = (kelvin) => {
  return 9/5*(kelvin-273)+32;
};




