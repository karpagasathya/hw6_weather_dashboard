// var storedCities = [];

function displayCurrentWeather(city) {
  var APIKey = "2d54c14ad67ce359aeba792a000fb367";
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
  var date = new Date();

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    let temperature = Math.floor(response.main.temp - 273.15) * 1.8 + 32;
    let windSpeed = response.wind.speed;
    let humidity = response.main.humidity;
    let cityDate = " (" + date.toLocaleDateString("en-US") + ") ";

    let cityDiv = $("<div>").addClass("card col-12 border border-dark m-3 p-3 rounded");
    let cityBodyDiv = $("<div>").addClass("card-body p=0");
    let cityDateIcon = $("<h3>").addClass("card-title").text(city);
    cityDateIcon.append(cityDate);
    
    let image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
    cityDateIcon.append(image);

    let temp = $("<p>")
      .addClass("card-text")
      .text("Temperature: " + Math.round(temperature) + String.fromCharCode(176) + "F");
    let wind = $("<p>").text("Wind Speed: " + windSpeed + "mph");
    let humid = $("<p>").text("Humidity:" + humidity + "%");

    let queryUV = `https://api.openweathermap.org/data/2.5/uvi?lat=${response.coord.lat}&lon=${response.coord.lon}&appid=${APIKey}`;

    $.ajax({
      url: queryUV,
      method: "GET",
    }).then(function (uvresponse) {

      let color = "green";
      let UVindex = uvresponse.value;
      if (UVindex > 10) {
        color = "red";
      } else if (UVindex > 4) {
        color = "orange";
      }
      let uvSpan = $("<span>").text(uvresponse.value).css("background-color", color);
      let uvIndex = $("<p>").text("UV Index: ").append(uvSpan);

      cityBodyDiv.append(cityDateIcon, temp, wind, humid, uvIndex);
      cityDiv.append(cityBodyDiv);

      $("#weather-view").empty();
      $("#weather-view").prepend(cityDiv);
    });
  });
}



$("#city-input").keypress(function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    $("#search-button").click();
  }
});

function renderList(city) {
  var listItem = $("<div>");
  listItem.addClass("list-group-item list-group-item-action mb-0").css("display", "block");
  listItem.attr("data-name", city);
  listItem.text(city);
  $("#history").append(listItem);
}

function getForecast(city) {
  var APIKey = "2d54c14ad67ce359aeba792a000fb367";
  var queryURLBase = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
  $.ajax({
    url: queryURLBase,
    method: "GET",
  }).then(function (response) {
    // console.log("forecast response",response);
    
    $("#forecast").empty();

    console.log("forecast list length", response.list.length);

    for (var i = 0; i < response.list.length; i += 8) {
      
      let temperature = Math.floor(response.list[i].main.temp - 273.15) * 1.8 + 32;
      let humidity = response.list[i].main.humidity;
      let forecastDate = response.list[i].dt_txt.split(" ")[0].replace(/-/g, "/");

      var card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
      var cardBody = $("<div>").addClass("card-body p-0");
      var cardDate = $("<h6>").addClass("card-title").text(forecastDate);
      var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
      var temp = $("<p>")
        .addClass("card-text")
        .text("Temp: " + temperature + String.fromCharCode(176) + "F");
      var humid = $("<p>").text("Humidity:" + humidity + "%");

      cardBody.append(cardDate, image, temp, humid);
      card.append(cardBody);
      $("#forecast").append(card);
    }
  });
}

$("#search-button").on("click", function (event) {
  event.preventDefault();

  var cityName = $("#city-input").val().trim();

  var storedCities = JSON.parse(localStorage.getItem("cities"));

  if (storedCities === null) {
    localStorage["cities"] = JSON.stringify([cityName]);
  } else {
    let getIndex = storedCities.findIndex((storedCity) => storedCity === cityName);
    if (getIndex === -1) {
      storedCities.push(cityName);
      localStorage["cities"] = JSON.stringify(storedCities);
    }
  }

  displayCurrentWeather(cityName);
  renderList(cityName);
  getForecast(cityName);
});

$("#history").on("click", ".list-group-item", function (event) {
  event.preventDefault();
  let city = $(this).attr("data-name");
  displayCurrentWeather(city);
  getForecast(city);
});
