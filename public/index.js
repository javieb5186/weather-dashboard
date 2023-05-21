const KEY = "f5961f2c2ed72fcda9775a1281cc984d";

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

      console.log(data);
      console.log("Lat: " + lat + " Long: " + long);

      let todayRequest = 
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&cnt=5&appid=${KEY}`;

      fetch(todayRequest)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          console.log(data);
        });

      let forecastRequest = 
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=imperial&appid=${KEY}`;

      fetch(forecastRequest)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          console.log(data);
        });
    });
}