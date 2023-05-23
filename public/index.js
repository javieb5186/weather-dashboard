const KEY = "f5961f2c2ed72fcda9775a1281cc984d";

var todayForecast = [];
var _5dayForecast = [];

$(function() {
  $(".search-button").on("click", getAPI);
});

function getAPI() {
  let search = $(".search").val();
  let cap = search.charAt(0).toUpperCase();
  let text = search.slice(1, search.length);
  let newSearch = cap + text;

  var lat, long;

  let geoRequest = 
  `http://api.openweathermap.org/geo/1.0/direct?q=${newSearch}&limit=5&appid=${KEY}`;

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
          for (let i = 0; i < arr.length; i++) {
            let noon = dayjs(data.list[i].dt_txt);
            if(noon.hour() === 12){
              _5dayForecast.push(data.list[i]);
            }
          }
          displayForecast();
        });
    });
}

function displayToday() {
  const icon = todayForecast[1];
  const date = dayjs().format("M/DD/YYYY")
  $(".td-city-name").html(todayForecast[0] + " " + " (" + date + ") " + ' <span><img class="td-icon" src="" alt="Todays weather" width="35" height="35"></span>');
  $(".td-temp").text("Temp: " + todayForecast[2] + " \u00B0F");
  $(".td-wind").text("Wind: " + todayForecast[3] + " MPH");
  $(".td-hum").text("Humidity: " + todayForecast[4] + " %");
  document.getElementsByClassName("td-icon")[0].setAttribute("src", `https://openweathermap.org/img/wn/${icon}@2x.png`);
}

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