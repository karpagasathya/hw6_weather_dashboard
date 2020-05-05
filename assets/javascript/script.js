$(document).ready(function () { 

    function displayCurrentWeather() {
        var APIKey = "2d54c14ad67ce359aeba792a000fb367";
        var cityName = $("#city-input").val().trim();
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        var date = new Date();


        $.ajax({
            url: queryURL,
            method: "GET",
        })
            .then(function (response) {
                console.log(response);
                var temperature =Math.floor(response.main.temp -273.15) *1.80 +32;
                var windSpeed = response.wind.speed;
                var humidity = response.main.humidity;

                var cityDiv = $("<div>");
                var header = $("<h3>").text(cityName);
                var cityDate = $("<h3>").text("("+date.toLocaleDateString('en-US')+")");
                var temp = $("#temperature").text("Temperature: " + temperature + String.fromCharCode(176) + "F");
                var wind = $("#wind-speed").text("Wind Speed: " + windSpeed + "mph");
                var humid = $("#humidity").text("Humidity:" + humidity + "%");
                header.append(cityDate);
                cityDiv.append(header, cityDate, temp, wind, humid);

                $("#weather-view").empty();
                $("#weather-view").prepend(cityDiv);

            });
     
    }
    $("#search-button").on("click", function (event) {
      event.preventDefault();
      displayCurrentWeather();
    });
    
        

});