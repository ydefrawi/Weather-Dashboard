//QUERIES ---------------------
var cityInputEl = document.querySelector("#cityInput")
var cityRenderEl = document.querySelector("#cityRender")
var searchButtonEl = document.querySelector("#searchButton")
var weatherContainerEl = document.querySelector('#weatherContainer')
var weatherListEl = document.querySelector('#weatherList')

//FUNCTIONS--------------------
async function getWeatherData (city){
    try {
        var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=db1013c661811da231f07902c100f4d0`
        // console.log(apiURL)
        var response = await fetch(apiURL);
        var awaitedResponse = await response.json();
        // console.log(awaitedResponse)
        renderCityWeather(awaitedResponse)
    } catch (error) {
        console.log(error);
    }

}

var renderCityWeather=function(response, searchedCity){
    cityName = response.name
    cityRenderEl.textContent = cityName;

    console.log(response); 

    var weatherBullet = document.createElement('li')
    weatherBullet.classList.add('list-group-item')
    weatherBullet.textContent="Temp: ";


    weatherListEl.appendChild(weatherBullet)


}

//Function that trims and logs inputs to the search box (will need to add to localStorage to save previous searches), to be called when the search button is clicked

function citySearchHandler (event) {
    event.preventDefault();
    var searchedCity = cityInputEl.value.trim();
    if (searchedCity === ""){
        alert("Please Enter a City")
    } else {
            console.log(searchedCity); 
            return searchedCity;
    }
}


// EVENT LISTENERS ---------------------
getWeatherData('Houston');

searchButtonEl.addEventListener('click', citySearchHandler)