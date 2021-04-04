//QUERIES ---------------------
var cityInputEl = document.querySelector("#cityInput")
var cityRenderEl = document.querySelector("#cityRender")
var searchButtonEl = document.querySelector("#searchButton")
var weatherContainerEl = document.querySelector('#weatherContainer')
var weatherListEl = document.querySelector('#weatherList')

//FUNCTIONS--------------------

//Function getCityWeather - fetches API data and passes the 'awaited' response into renderCityWeather function
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

//Function renderCityWeather - renders city data to the page. Creates 3 list items for Temp, Wind and Humidity
//To-do -- Pass user input into this somehow
//To-do -- Only run when search button is hit  
var renderCityWeather=function(response, searchedCity){
    cityName = response.name
    cityRenderEl.textContent = cityName;

    console.log(response); 

    var tempBullet = document.createElement('li')
    tempBullet.classList.add('list-group-item')
    tempBullet.textContent="Temp: ";

    var windBullet = document.createElement('li')
    windBullet.classList.add('list-group-item')
    windBullet.textContent="Wind: ";

    var humidBullet = document.createElement('li')
    humidBullet.classList.add('list-group-item')
    humidBullet.textContent="Humidity: ";

    weatherListEl.appendChild(tempBullet)
    weatherListEl.appendChild(windBullet)
    weatherListEl.appendChild(humidBullet)


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