const appID = 'bd5a6fcc60240af6eed7b9be46fb1e53';
const units = 'imperial';
let searchMethod;
let longForecast;
let weatherNow;

init();

function init() {
    // Initialize hides the weather containers.
    document.querySelector('#weather-container').style.visibility = 'hidden';
    document.querySelector('#top-weather').style.visibility = 'hidden';
}


async function getWeather(userInput, weatherType) {
    // Gets weather from API and returns it to appropriate variable.
    const weatherResponse = await fetch(`http://api.openweathermap.org/data/2.5/${weatherType}?${searchMethod}=${userInput}&APPID=${appID}&units=${units}`);
    const weather = await weatherResponse.json();
    if (weatherType === 'weather') {
        return weatherNow = weather;
    } else {
        return longForecast = weather;
    }
};

function displayWeatherNow(weatherNow) {
    // Display the current weather.
    document.querySelector('#top-weather').style.visibility = 'visible';
    let output = `
    <div class="weather-description">
        <h1 class="city-header">${weatherNow.name}</h1>
        <div class="date">RIGHT NOW</div>
        <div class="weather-main">
            <div class="temperature">${Math.floor(weatherNow.main.temp)} \xB0F</div>
            <div class="weather-description-header">${weatherNow.weather[0].description.charAt(0).toUpperCase() + weatherNow.weather[0].description.slice(1)}</div>
            <div><img class="document-icon-img" src="${'http://openweathermap.org/img/w/' + weatherNow.weather[0].icon + '.png'}"></div>
        </div>
        <div class="bottom-details">Wind ${weatherNow.wind.speed} MPH</div>
        <div class ="bottom-details">${weatherNow.main.humidity}% Humidity</div>
    </div>
    `;
    document.getElementById('top-weather').innerHTML = output;
}

function convertDate(timestamp) {
    // Converts date from UNIX to readable format.
    const date = new Date(timestamp * 1000);
    return date;
};

function formatDate(date) {
    // Format date into easy to read format. EXAMPLE: Sat Feb 23.
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'];
    let day = date.getDate();
    let dayOfWeek = days[date.getDay()];
    let month = months[date.getMonth()];
    const formattedDate = `${dayOfWeek} ${month} ${day}`;
    return formattedDate;
};

function formatTime(date) {
    // Format time into easy to read format. EXAMPLE: 1:00 PM or 2:00 PM.
    let hours = date.getHours();
    let amOrPm = 'AM';
    if (hours > 12) {
        amOrPm = 'PM';
        hours = hours - 12;
    } else {
        amOrPm = 'AM';
    }
    const formattedTime = `${hours}:00 ${amOrPm}`;
    return formattedTime;
};

function displayLongForecast(longForecast) {
    // Display the 5 day forecast information.
    document.querySelector('#weather-container').style.visibility = 'visible';
    let output = '';
    let forecastArray = longForecast.list;
    let counter = 0;
    forecastArray.forEach(e => {
        let convertedDate = convertDate(e.dt);
        let prettyDate = formatDate(convertedDate);
        let prettyTime = formatTime(convertedDate);
        output += `
        <div id="weather-description-${counter}" class="weather-description">
            <h1 id="date-header-${counter}" class="date-header">${prettyDate}</h1>
            <div id="date-${counter}" class="date">${prettyTime}</div>
            <div id="weather-main-${counter}" class="weather-main">
                <div id="temperature-${counter}" class="temperature">${Math.floor(e.main.temp)} \xB0F</div>
                <div id="weather-description-header-${counter}" class="weather-description-header">${e.weather[0].description.charAt(0).toUpperCase() + e.weather[0].description.slice(1)}</div>
                <div><img id="document-icon-img-${counter}" class="document-icon-img" src="${'http://openweathermap.org/img/w/' + e.weather[0].icon + '.png'}"></div>
            </div>
            <div id="wind-speed-${counter}" class="bottom-details">Wind ${e.wind.speed} MPH</div>
            <div id="humidity-${counter}" class ="bottom-details">${e.main.humidity}% Humidity</div>
        </div>
        `;
        counter++;
    });
    document.getElementById('weather-container').innerHTML = output;
}

function getSearchMethod(userInput) {
    // Check if user is entering zip code or city name and set search method to use in API.
    function hasNumber(string) {
        return /\d/.test(string);
    };
    if (userInput.length === 5 && hasNumber(userInput) === true) {
        searchMethod = 'zip';
    } else {
        searchMethod = 'q';
    }
};

function weatherMain() {
    // Main weather function. This will take the user input and get and display the current weather and 5 day forecast (every 3 hours) from the API.
    const userSearch = document.querySelector('#search-input').value;
    if (userSearch) {
        getWeather(userSearch, 'forecast').then(() => {
            displayLongForecast(longForecast);
        }).catch(err => {
            alert("Invalid City or Zipcode!");
            document.querySelector('#weather-container').style.visibility = 'hidden';
            document.getElementById('search-input').value = '';
        })
        getWeather(userSearch, 'weather').then(() => {
            displayWeatherNow(weatherNow);
            changeBackgroundImage(weatherNow);
        }).catch(err => {
            document.querySelector('#top-weather').style.visibility = 'hidden';
            document.getElementById('search-input').value = '';
        })
    }
}

function changeBackgroundImage(currentWeather) {
    switch (currentWeather.weather[0].main) {
        case 'Clear':
            document.body.style.backgroundImage = 'url("clear.jpg")';
            break;

        case 'Clouds':
            document.body.style.backgroundImage = 'url("cloudy.jpg")';
            break;

        case 'Rain':
        case 'Drizzle':
        case 'Mist':
            document.body.style.backgroundImage = 'url("rain.jpg")';
            break;
    
        case 'Thunderstorm':
            document.body.style.backgroundImage = 'url("storm.jpg")';
            break;

        case 'Snow':
            document.body.style.backgroundImage = 'url("snow.jpg")';   
            break;
    
        default:
            break;
    }
};

// Check if search button is pressed.
document.getElementById('search-btn').addEventListener('click', () => {
    weatherMain();
})

// Check if zip or city is being entered in input box.
document.getElementById('search-input').addEventListener('keyup', () => {
    getSearchMethod(document.getElementById('search-input').value);
})

// Check if enter key is pressed while focus is on input box.
document.getElementById('search-input').addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        weatherMain();
    }
})