//QUERIES ---------------------
var cityInputEl = document.querySelector("#cityInput")
var cityRenderEl = document.querySelector("#cityRender")
var searchButtonEl = document.querySelector("#searchButton")
var searchHeaderEl = document.querySelector("#searchHeader")
var weatherContainerEl = document.querySelector('#weatherContainer')
var weatherListEl = document.querySelector('#weatherList')
var headerContainerEl=document.querySelector('#headerContainer')
var forecastContainerEl=document.querySelector('#forecastContainer')
var dateEl = document.querySelector('#currentDate')
var forecastRowEl = document.querySelector('#cards-row');
var oldSearchesEl = document.querySelector('#prev-searches')
var slider=document.querySelector('#slider')

currentTime=moment().format("dddd, MMMM Do YYYY, h:mm a");
$('#currentDate').text(currentTime);
$('#slider').css('overflow-y','visible');
var buttonArray=JSON.parse(localStorage.getItem('cities'))||[];

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
        $('#cityRender').text('Sorry, No Such City Found!')
        $('#headerContainer').empty()
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
        // clearWeatherData()
        $('#cityRender').text('No Such City Found!')
        console.log(error);
    }
}

//Function that renders 5-day forecast cards. Called by getWeatherData. 
function renderForecast(response){

    //Appends UV data to main 'current weather' ul from onecall API
    todaysUV = response.daily[0].uvi;
    var uvBullet = document.createElement('li')
    uvBullet.classList.add('list-group-item')
    uvBullet.textContent="UV Index: "+ todaysUV;
    if (todaysUV<2){
        uvBullet.style.color="green";
        uvWarning = document.createTextNode(": FAVORABLE")
    } else if (todaysUV>=8){
        uvBullet.style.color="red";
        uvWarning = document.createTextNode(": SEVERE")
    } else {
        uvBullet.style.color="orange";
        uvWarning = document.createTextNode(": MODERATE")
    }
    weatherListEl.appendChild(uvBullet)
    uvBullet.appendChild(uvWarning)
    
    //Adds '5-day-forecast' header 
    headerContainerEl.textContent=''
    var forecastHeader=document.createElement('div')
    forecastHeader.classList='alert alert-info'
    forecastHeader.setAttribute('id','header5day')
    forecastHeader.textContent="5-Day Forecast"
    headerContainerEl.appendChild(forecastHeader);

    //creates and appends 5 cards
    for (i=1; i<6; i++){

        var iconID=response.daily[i].weather[0].icon;
        var iconURL = `https://openweathermap.org/img/wn/${iconID}@2x.png`
        var iconRender = document.createElement('img')
        iconRender.src=iconURL

        var temp = response.daily[i].temp.day
        var tempK = Math.round(temp-273.15)
        var wind = response.daily[i].wind_speed
        var humidity = response.daily[i].humidity
        var dateUnix = response.daily[i].dt
        date = moment.unix(dateUnix).format("MMM Do, YYYY")
        weekDay=moment.unix(dateUnix).format("dddd")
    
        
        var column = document.createElement('div')
        var card = document.createElement('div')
        var cardBody = document.createElement('div')
        var ul = document.createElement('ul');
        var iconSpot = document.createElement('li')
        var weekDaySpot=document.createElement('li')
        var forecastDate = document.createElement('li')
        var tempBullet=document.createElement('li');
        var windBullet=document.createElement('li');
        var humidBullet = document.createElement('li');

        weekDaySpot.textContent=weekDay;
        forecastDate.textContent=date;
        tempBullet.textContent="Temp: "+tempK+"° C";
        windBullet.textContent="Wind: "+wind+" m/s";
        humidBullet.textContent="Humidity: "+humidity+"%";

        
        column.classList='col'
        card.classList='card shadow'
        cardBody.classList='card-body';
        ul.classList='list-group';

        weekDaySpot.classList='list-group-item forecast-item';
        forecastDate.classList='list-group-item forecast-item forecast-date';
        tempBullet.classList='list-group-item forecast-item';
        windBullet.classList='list-group-item forecast-item';
        humidBullet.classList='list-group-item forecast-item';

        forecastRowEl.appendChild(column)
        column.appendChild(card)
        card.appendChild(cardBody)
        cardBody.appendChild(ul)

        iconSpot.appendChild(iconRender)
        ul.append(iconSpot, weekDaySpot,forecastDate,tempBullet,windBullet,humidBullet)
        // ul.appendChild(weekDaySpot)
        // ul.appendChild(forecastDate)
        // ul.appendChild(tempBullet)
        // ul.appendChild(windBullet)
        // ul.appendChild(humidBullet)
    }
}

//Function renderCityWeather - renders CURRENT weather data to the page. Creates 3 list items for Temp, Wind and Humidity
var renderCityWeather=function(response, searchedCity){
    $('#slider').css('overflow-y','hidden');
    cityName = response.name
    cityRenderEl.textContent = cityName;
    dateEl.textContent = currentTime;
    searchHeaderEl.style.color="#FFFFFF"
    console.log(response); 

    //grabs appropriate icon ID from API and concatenates it into the png URL
    var iconID=response.weather[0].icon;
    var iconURL = `https://openweathermap.org/img/wn/${iconID}@2x.png`
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
    humidBullet.textContent="Humidity: " + humidity + "%";

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
            buttonStorage(searchedCity); 
            buttonRender(buttonArray)
            clearWeatherData()
            getWeatherData(searchedCity)
    }
}

function buttonStorage(searchedCity){
    buttonArray.push(searchedCity);
    //uses Set to remove duplicates in buttonArray--
    var noDuplicates=[...new Set(buttonArray)];
    localStorage.setItem('cities',JSON.stringify(noDuplicates));
}

function buttonRender(buttonArray) {
    var searches = JSON.parse(localStorage.getItem('cities'))
    console.log("in button render " + searches)
    console.log(typeof searches);
    oldSearchesEl.textContent=''

    if (searches) {
        searches.forEach(element => {
            var oldSearches = document.createElement('button')
            oldSearches.classList = 'btn btn-info saved-searches'
            oldSearches.textContent = element;
            oldSearchesEl.appendChild(oldSearches)
            oldSearches.addEventListener('click',cityButtonHandler)
        });
    } else {
        return;
    }
}

function cityButtonHandler (event) {
    event.preventDefault();
    searchedButton=event.target.textContent
            if (slider.classList.contains('slideup')){
                slider.classList.remove('slideup')
                slider.classList.add('slidedown')
                getWeatherData(searchedButton)
            } 
            else if (slider.classList.contains('slidedown')){
                slider.classList.remove('slidedown');
                slider.classList.add('slideup');
                setTimeout (function () {
                    clearWeatherData()
                    getWeatherData(searchedButton)
                    slider.classList.remove('slideup')
                    slider.classList.add('slidedown')
                    
                },400)
                
            } else {
                clearWeatherData()
                getWeatherData(searchedButton)
            }
    
}

function clearWeatherData(){
    $('#cityRender').text('')
    $('#headerContainer').empty()
    forecastRowEl.textContent=''
    weatherListEl.textContent=''
    cityInputEl.value=''
}

// EVENT LISTENERS ---------------------
buttonRender(buttonArray)

searchButtonEl.addEventListener('click', citySearchHandler)