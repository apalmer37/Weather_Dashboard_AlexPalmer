var searchCityName;
var searchCityList = [];

// searched cities and their weather from local storage
initStoredCityList();
initStoredCityWeather();

// display city list
function rendercityEl(){
    $("#searchCityList").empty();
    $("#searchInput").val("");

    for (i=0; i<searchCityList.length; i++){
        var a = $("<a>");
        a.addClass("list-group-item list-group-item-action list-group-item-primary pastCity");
        a.attr("data-input", searchCityList[i]);
        a.text(searchCityList[i]);
        $("#searchCityList").prepend(a);
    }
}


// pulls stored city list
function initStoredCityList(){
    var storedCityEl = JSON.parse(localStorage.getItem("cityEl"));
    if (storedCityEl !== null) {
        searchCityList = storedCityEl;
    }
    rendercityEl();
}

// function to display most recent searched city's weather from local storage
function initStoredCityWeather(){
    var lastCityWeather = JSON.parse(localStorage.getItem("lastCity"));
    if (lastCityWeather !== null){
        searchCityName = lastCityWeather;

        displayStoredCityWeather(searchCityName);
    }
}


// function to stringify the city list into an array and save to local storage
function storeCityList(){
    localStorage.setItem("cityEl", JSON.stringify(searchCityList));
}

// function to save the last city searched to local storage
function storeLastCity(){
    localStorage.setItem("lastCity", JSON.stringify(searchCityName));
}

// search button click functionality
$(document).on("click", "#searchBtn", function(event){
    event.preventDefault();

    searchCityName = $("#searchInput").val().trim();
    if(searchCityName === ""){
        alert("Must enter a city")
    }else if (searchCityList.length >= 5){
        searchCityList.shift();
        searchCityList.push(searchCityName);
    }else{
        searchCityList.push(searchCityName);
    }
    rendercityEl();
    displayStoredCityWeather(searchCityName);
    storeCityList();
    storeLastCity();
});

// event function for clicking on a recently searched city, and showing it's weather info.
$(document).on("click", ".pastCity", function(event){
    var pastCity = event.target.text;
    displayStoredCityWeather(pastCity);
})

// getting weather info for searched city. 
async function displayStoredCityWeather(searchCityName) {
    var latLongURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchCityName + "&limit=1&appid=d3757787d6d1b961c0a83ab2dec89c1a";
    var latLongData = await $.ajax({
        url: latLongURL,
        method: "GET"
    });
    var lat = latLongData[0].lat;
    var lon = latLongData[0].lon;
    var weatherURL = "http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=d3757787d6d1b961c0a83ab2dec89c1a";
    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function(data){ 
        renderWeatherData(data, searchCityName);
    })
}
    // renders current temperature, wind, humiditiy, and UV index for current city and date.
function renderWeatherData(data, searchCityName){
    var searchCityName = searchCityName;
    var cityTemp =  data.current.temp;
    var cityWind = data.current.wind_speed;
    var cityHumidity = data.current.humidity;
    var cityUVI = data.current.uvi;

    var fiveForecast = data.daily;

    $("#city-name").text(searchCityName);
    $("#city-temp").text(cityTemp + " F");
    $("#city-wind").text(cityWind + " MPH");
    $("#city-humidity").text(cityHumidity + " %");
    $("#city-UVI").text(cityUVI);
    renderForecastData(fiveForecast);   
}

 
     

    
    // need to make cards for the five day forecast underneath the current day's forecast
function renderForecastData(data) {
    for (let i = 1; i < 6; i++) {
        var date = new Date(data[i].dt * 1000);
        $(`#forecast${i} #date`).text(date.toLocaleDateString());
        var status = data[i].weather[0].main;
        var temp = data[i].temp.day;
        var wind = data[i].wind_speed;
        var humidity = data[i].humidity;

        $(`#forecast${i} #status`).text(status);
        $(`#forecast${i} #temp`).text(temp);
        $(`#forecast${i} #wind`).text(wind);
        $(`#forecast${i} #humidity`).text(humidity);
    }
}
