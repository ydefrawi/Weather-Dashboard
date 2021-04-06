//QUERIES ---------------------
var cityInputEl = document.querySelector("#cityInput")
var cityRenderEl = document.querySelector("#cityRender")
var searchButtonEl = document.querySelector("#searchButton")
var weatherContainerEl = document.querySelector('#weatherContainer')
var weatherListEl = document.querySelector('#weatherList')
var forecastContainerEl=document.querySelector('#forecastContainer')
var dateEl = document.querySelector('#currentDate')
var forecastRowEl = document.querySelector('#cards-row')

currentTime=moment().format("dddd, MMMM Do YYYY, h:mm a")

//FUNCTIONS--------------------

//Function getCityWeather - fetches API data and passes the 'awaited' response into renderCityWeather function
async function getWeatherData (city){
    try {
        var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=db1013c661811da231f07902c100f4d0`
        // console.log(apiURL)
        var response = await fetch(apiURL);
        var awaitedResponse = await response.json();
        var lat = awaitedResponse.coord.lat;
        var lon = awaitedResponse.coord.lon;
        // console.log(awaitedResponse)
        getForecast(lat, lon)
        renderCityWeather(awaitedResponse)
    } catch (error) {
        console.log(error);
    }
}

async function getForecast (lat, lon){
    try {
        var apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=db1013c661811da231f07902c100f4d0`
        var response = await fetch(apiURL);
        var awaitedResponse = await response.json();
        renderForecast(awaitedResponse)
        console.log(awaitedResponse)
    } catch (error) {
        console.log(error);
    }
}

//Function that renders 5-day forecast cards. Called by getWeatherData.. 
function renderForecast(response){
    //Appends UV data to main 'current weather' ul from onecall API
    todaysUV = response.daily[0].uvi;
    var uvBullet = document.createElement('li')
    uvBullet.classList.add('list-group-item')
    uvBullet.textContent="UV Index: "+ todaysUV;
    weatherListEl.appendChild(uvBullet)
    
    //Adds '5-day-forecast' header 
    var forecastHeader=document.createElement('span')
    forecastHeader.style.fontWeight='stronger'
    forecastHeader=textContent="5-Day Forecast"
    forecastContainerEl.prepend(forecastHeader);

    //creates and appends 5 cards
    for (i=1; i<6; i++){

        var iconID=response.daily[i].weather[0].icon;
        var iconURL = `http://openweathermap.org/img/wn/${iconID}@2x.png`
        var iconRender = document.createElement('img')
        iconRender.src=iconURL

        var temp = response.daily[i].temp.day
        var tempK = Math.round(temp-273.15)
        var wind = response.daily[i].wind_speed
        var humidity = response.daily[i].humidity
        var dateUnix = response.daily[i].dt
        date = moment.unix(dateUnix).format("MMM Do, YYYY")
        
        var column = document.createElement('div')
        var card = document.createElement('div')
        var cardBody = document.createElement('div')
        var ul = document.createElement('ul');
        var iconSpot = document.createElement('li')
        var forecastDate = document.createElement('li')
        var tempBullet=document.createElement('li');
        var windBullet=document.createElement('li');
        var humidBullet = document.createElement('li');


        forecastDate.textContent=date;
        tempBullet.textContent="Temp: "+tempK+"° C";
        windBullet.textContent="Wind: "+wind+" m/s";
        humidBullet.textContent="Humidity: "+humidity+"%";

        
        column.classList='col'
        card.classList='card shadow'
        cardBody.classList='card-body';
        ul.classList='list-group';
        forecastDate.classList='list-group-item forecast-item forecast-date';
        tempBullet.classList='list-group-item forecast-item';
        windBullet.classList='list-group-item forecast-item';
        humidBullet.classList='list-group-item forecast-item';

        forecastRowEl.appendChild(column)
        column.appendChild(card)
        card.appendChild(cardBody)
        cardBody.appendChild(ul)

        iconSpot.appendChild(iconRender)
        ul.appendChild(iconSpot)
        ul.appendChild(forecastDate)
        ul.appendChild(tempBullet)
        ul.appendChild(windBullet)
        ul.appendChild(humidBullet)

        
    }
}



//Function renderCityWeather - renders CURRENT weather data to the page. Creates 3 list items for Temp, Wind and Humidity
var renderCityWeather=function(response, searchedCity){
    cityName = response.name
    cityRenderEl.textContent = cityName;
    dateEl.textContent = currentTime;
    // console.log(response); 

    //grabs appropriate icon ID from API and concatenates it into the png URL
    var iconID=response.weather[0].icon;
    var iconURL = `http://openweathermap.org/img/wn/${iconID}@2x.png`
    var iconRender = document.createElement('img')
    iconRender.src=iconURL
    // ---------------------

    // grabs appropriate weather data from response
    wind = response.wind.speed; 
    temp = response.main.temp;
    tempK = Math.round(temp-273.15)
    humidity = response.main.humidity

    //generates and populates bullets for Temp, Wind, and Humidity
    var tempBullet = document.createElement('li')
    tempBullet.classList.add('list-group-item')
    tempBullet.textContent="Temp: "+ tempK + "° Celsius";

    var windBullet = document.createElement('li')
    windBullet.classList.add('list-group-item')
    windBullet.textContent="Wind: " + wind + " meters/second";

    var humidBullet = document.createElement('li')
    humidBullet.classList.add('list-group-item')
    humidBullet.textContent="Humidity: " + humidity;

    //Appends bullets and icon to weatherListEl and cityRenderEl, both global.
    weatherListEl.appendChild(tempBullet)
    weatherListEl.appendChild(windBullet)
    weatherListEl.appendChild(humidBullet)
    cityRenderEl.appendChild(iconRender)

}

//Function that trims and logs inputs to the search box (will need to add to localStorage to save previous searches), to be called when the search button is clicked

function citySearchHandler (event) {
    event.preventDefault();
    var searchedCity = cityInputEl.value.trim();
    if (searchedCity === ""){
        alert("Please Enter a City")
    } else {
            forecastRowEl.textContent=''
            weatherListEl.textContent=''
            cityInputEl.value=''
            getWeatherData(searchedCity)
    }
}


// EVENT LISTENERS ---------------------
// getWeatherData('Houston');
searchButtonEl.addEventListener('click', citySearchHandler)