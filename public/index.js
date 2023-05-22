const KEY = "f5961f2c2ed72fcda9775a1281cc984d";

const date = dayjs().format('M/DD/YYYY');

const day = dayjs(date).date();
const month = dayjs(date).month();
const year = dayjs(date).year();

var dates = [];

for (let i = 0; i < 6; i++) {
  let date = dayjs(`${year}-${month + 1}-${day + i}`).format("M/DD/YYYY");
  dates.push(date);
}

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
          console.log(data);
          todayForecast.push(data.name);
          todayForecast.push(data.weather[0].icon);
          todayForecast.push(data.main.temp);
          todayForecast.push(data.wind.speed);
          todayForecast.push(data.main.humidity);
          console.log(todayForecast);

          displayToday();
        });

      // let forecastRequest = 
      // `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=imperial&appid=${KEY}`;

      // fetch(forecastRequest)
      //   .then(function(response) {
      //     return response.json();
      //   })
      //   .then(function(data) {
      //     let arr = data.list;
      //     for (let i = 0; i < arr.length; i++) {
      //       let noon = dayjs(data.list[i].dt_txt);
      //       console.log(data.list[i].dt_txt);
      //       if(noon.hour() === 12){
      //         _5dayForecast.push(data.list[i]);
      //       }
      //     }
      //     console.log(_5dayForecast);
      //   });
    });
}

function displayToday() {
  const icon = todayForecast[1];
  $(".td-city-name").html(todayForecast[0] + " " + " (" + dates[0] + ") " + ' <span><img class="td-icon" src="" alt="Todays weather" width="30" height="30"></span>');
  $(".td-temp").text("Temp: " + todayForecast[2] + " \u00B0F");
  $(".td-wind").text("Wind: " + todayForecast[3] + " MPH");
  $(".td-hum").text("Humidity: " + todayForecast[4] + " %");
  document.getElementsByClassName("td-icon")[0].setAttribute("src", `https://openweathermap.org/img/wn/${icon}@2x.png`);
}