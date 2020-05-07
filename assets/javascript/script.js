$(document).ready(function () {
  

  function displayCurrentWeather() {
    var APIKey = "2d54c14ad67ce359aeba792a000fb367";
    var cityName = $("#city-input").val().trim();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    var date = new Date();

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      var city = response.name;
      var temperature = Math.floor(response.main.temp - 273.15) * 1.8 + 32;
      var windSpeed = response.wind.speed;
      var humidity = response.main.humidity;
      var cityDate = "(" + date.toLocaleDateString("en-US") + ")";

      var cityDiv = $("<div>").addClass("card col-12 border border-dark m-3 p-3 rounded");
      var cityBodyDiv = $("<div>").addClass("card-body p=0");
      var cityDateIcon = $("<h4>").addClass("card-title").text(city);
      cityDateIcon.append(cityDate);
      
      var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
      var temp = $("<p>").addClass("card-text").text("Temperature: " + Math.round(temperature) + String.fromCharCode(176) + "F");
      var wind = $("<p>").text("Wind Speed: " + windSpeed + "mph");
      var humid = $("<p>").text("Humidity:" + humidity + "%");


      let lon = response.coord.lon;
      let lat = response.coord.lat;

      let queryUV = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIKey}`;
      console.log("queryUv",queryUV);
      $.ajax({
        url: queryUV,
        method: "GET",
      }).then(function (uvresponse) {
        console.log("uvresponse", uvresponse);

        let color = "green";
        let UVindex = uvresponse.value;
        if (UVindex > 10) {
          color = "red";
        } else if (UVindex > 4) {
          color = "orange";
        }
        let uvSpan = $("<span>").text(uvresponse.value).css("background-color", color);
        var uvIndex = $("<p>").text("UV Index: ").append(uvSpan);

        // header.append(cityDate);
        cityBodyDiv.append(cityDateIcon, image, temp, wind, humid, uvIndex);
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



  function renderList() {
    var listItem = $("<ul>");
    listItem.addClass("list-group-item mb-0").css("display", "block");
    listItem.attr("data-name", cityName);
    listItem.text(cityName);
    $("#history").append(listItem);
  }
    
    function getForecast() {
        var APIKey = "2d54c14ad67ce359aeba792a000fb367";
        var queryURLBase = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;
        $.ajax({
            url: queryURLBase,
            method: "GET"
        }).then(function (response) {

            console.log("forecast response",response);
            // console.log(response.dt);
            $("#forecast").empty();

          console.log("forecast list length", response.list.length);

          for (var i = 0; i < response.list.length; i += 8) {
            console.log(response.list[i].dt_txt.split(" ")[0]);
            let temperature = Math.floor(response.list[i].main.temp - 273.15) * 1.8 + 32;
            let humidity = response.list[i].main.humidity;
            let forecastDate = response.list[i].dt_txt.split(" ")[0].replace(/-/g,"/");
            

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
        })
  }  
  

  

  $("#search-button").on("click", function (event) {
    event.preventDefault();

    cityName = $("#city-input").val().trim();

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

    displayCurrentWeather();
      renderList();
      getForecast();
  });
});
