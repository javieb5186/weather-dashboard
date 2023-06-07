// Declarations
const KEY = "f5961f2c2ed72fcda9775a1281cc984d";
var todayForecast = [];
var _5dayForecast = [];
var savedSearches = [];

// Get saved searches if any on storage 
if(localStorage.getItem("saved-searches") !== null) {
  var storageArray = JSON.parse(localStorage.getItem("saved-searches"));
  savedSearches = storageArray.map(x => x);
}

// On load setup buttons
$(function() {
  $(".search-button").on("click", searchInput);

  if(savedSearches !== 0)
  {
    for (let i = 0; i < savedSearches.length; i++) {
      addSavedButton(savedSearches[i]);
    }
  }
});

//
function searchInput() {

  // Get text and make it compliant with api query rules
  let search = $(".search").val();
  let cap = search.charAt(0).toUpperCase();
  let text = search.slice(1, search.length);
  let newSearch = cap + text;

  // Request with compliant string
  apiRequest(newSearch);

  let count = 0;

  // If no saved searches exist make the first history button
  if(savedSearches.length === 0) {
    savedSearches.push(newSearch);
    addSavedButton(newSearch);
    localStorage.setItem("saved-searches", JSON.stringify(savedSearches));
  }
  else {
    // If there are no duplicates don't increae counter
    for (let i = 0; i < savedSearches.length; i++) {
      if(newSearch !== savedSearches[i])
      {
        count++;
      }
    }

    // If there are no duplicates from the new search and less than 10 max history buttons then add button. If max is achieved
    // remove the first button and add the new button.
    if(count === savedSearches.length) {
      if(savedSearches.length < 10) {
        savedSearches.push(newSearch);
        addSavedButton(newSearch);
        localStorage.setItem("saved-searches", JSON.stringify(savedSearches));
      }
      else {
        removeFirstButton()
        savedSearches.shift();
        savedSearches.push(newSearch);
        addSavedButton(newSearch);

        localStorage.setItem("saved-searches", JSON.stringify(savedSearches));
      }
    }
  }
}

// Perform the api request from the any saved buttons value
function searchButton(event) {
  let v = event.currentTarget.getAttribute("value");
  apiRequest(v);
}

// Remove the first button initial location
function removeFirstButton() {
  $("aside").children()[4].remove();
}

// Sets up and adds a button 
function addSavedButton(s) {
  let button = document.createElement("input");
  button.setAttribute("class", "search-button");
  button.setAttribute("type", "button");
  button.setAttribute("value", s);
  button.addEventListener("click", searchButton);
  let aside = $("aside").children();
  $("aside").children()[aside.length - 1].after(button);
}

// API request with the search being passed
function apiRequest(search) {
  var lat, long;

  let geoRequest = 
  `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${KEY}`;

  fetch(geoRequest)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      lat = String(data[0].lat.toFixed(2));
      long = String(data[0].lon.toFixed(2));

      let todayRequest = 
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&cnt=5&appid=${KEY}`;

      fetch(todayRequest)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          // Save all of today's data
          todayForecast.push(data.name);
          todayForecast.push(data.weather[0].icon);
          todayForecast.push(data.main.temp);
          todayForecast.push(data.wind.speed);
          todayForecast.push(data.main.humidity);

          displayToday();
        });

      let forecastRequest = 
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=imperial&appid=${KEY}`;

      fetch(forecastRequest)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          let arr = data.list;

          // Save all of the forecast data
          for (let i = 0; i < arr.length; i++) {
            let noon = dayjs(data.list[i].dt_txt);
            if(noon.hour() === 12){
              _5dayForecast.push(data.list[i]);
            }
          }
          displayForecast();
        });
    });
    reset();
}

// Display todays saved data store in global
function displayToday() {
  const icon = todayForecast[1];
  const date = dayjs().format("M/DD/YYYY")
  $(".td-city-name").html(todayForecast[0] + " " + " (" + date + ") " + ' <span><img class="td-icon" src="" alt="Todays weather" width="35" height="35"></span>');
  $(".td-temp").text("Temp: " + todayForecast[2] + " \u00B0F");
  $(".td-wind").text("Wind: " + todayForecast[3] + " MPH");
  $(".td-hum").text("Humidity: " + todayForecast[4] + " %");
  document.getElementsByClassName("td-icon")[0].setAttribute("src", `https://openweathermap.org/img/wn/${icon}@2x.png`);
}

// Display the forecasted data saved in global
function displayForecast() {
  const cards =  $(".card");

  for (let i = 0; i < cards.length; i++) {
    const d = dayjs(_5dayForecast[i].dt_txt).format("M/DD/YYYY");
    const icon = _5dayForecast[i].weather[0].icon

    const card = $(`.card-${i + 1}`).children();

    card[0].innerHTML = d;
    card[1].src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    card[2].innerHTML = "Temp: " + _5dayForecast[i].main.temp + " \u00B0F";
    card[3].innerHTML = "Wind: " + _5dayForecast[i].wind.speed + " MPH";
    card[4].innerHTML = "Humidity: " + _5dayForecast[i].main.humidity + " %";
  }
}

// Reset the global variables to be used in the next request
function reset() {
  _5dayForecast = [];
  todayForecast = [];
}