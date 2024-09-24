const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");

const getLocation = document.getElementById("location-button");
const topContainer = document.getElementById('t-container');
const bottomContainer = document.getElementById('b-container');
const cityButton = document.getElementById('cities-button');

const APIKey ='a51436fe16293393a10f617c7eaf0bca';

let lon, lat, pressure, visibility, sunrise, sunset, timezone, City;

let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

currentWeatherCard = document.querySelectorAll('.weather-left .card')[0];
const forecastCard = document.querySelector('.day-forecast');
let aqiCard = document.querySelectorAll('.highlight .card')[0];
// console.log(aqiCard);
let dayCard = document.querySelectorAll('.highlight .card')[1];
    // console.log(dayCard);

document.addEventListener('DOMContentLoaded',()=> {
    
populateDropDown()});  // For initial loading of Recent Search History if exists.

search.addEventListener('click',()=>{

    const city = document.querySelector('.search-box input').value;
    City = city.toLowerCase(); // To ensure later on that cities with same name but different case are not registered

    if(city === ''){
        alert("Please enter a city name.")
        return;
    } 
    
    const data = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
    .then(response => response.json()) // Each JSON data attributes to a particular City
    .then( json => {
        //---------------------------- RESPONSE ERROR --------------------------- 
        if(json.cod === '404'){ // HTTP Status code 404 - Resource not found
            container.style.height  = '445px'; // Data Failure image reappears with increased height of container
            weatherBox.style.display = '';   // Hides the Temperature and Description section
            weatherDetails.style.display = ''; // Hides the Humidity and Wind Speed indicators
            bottomContainer.style.display = 'none';
            error404.style.display = 'flex'; // The Error Image and Message emerges
            error404.style.marginTop = '3px'; 
            error404.classList.add('fadeIn');
            return;
        }
        // -------------------------- RESPONSE SUCCESSFUL ----------------------
            error404.style.display = 'none';  // Hides the error image if ${city} is valid
            error404.classList.remove('fadeIn'); // Removes the className attached and thus, the animation defined.

            topContainer.style.display = 'none';
            bottomContainer.style.display = 'none'; 

            const image = document.querySelector('.weather-box img') // Targets the image under weather box
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            lon = json.coord.lon;
            lat = json.coord.lat;
            
            switch(json.weather[0].main){ // Scans the JSON data of a particular City
                case 'Clear':
                    image.src = '../images/clear_sun.png';
                    break;
                case 'Rain':
                    image.src = '../images/rain.png';
                    break;
                case 'Snow':
                    image.src = '../images/snow.png';
                    break;                
                case 'Clouds':
                    image.src = '../images/clouds.png';
                    break;
                case 'Haze':
                    image.src = '../images/haze.png';
                    break;
                case 'Mist':
                    image.src = '../images/mist.png';
                    break;
                default:
                    image.src = '';
            }

            temperature.innerHTML = `${json.main.temp}<span>°C</span>`; // Injects the temperature reading 
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`; // Injects the Humidity reading
            wind.innerHTML = `${json.wind.speed} Km/h`;

            // console.log(json.main.temp,json.weather[0].description,json.main.humidity,json.wind.speed); // To verify data reception
            // console.log(json);
            
            weatherBox.style.display = '';
            weatherDetails.style.display = '';

            // Attributing animation to the display modules - weatherBox and weatherDetails
            weatherBox.classList.add('fadeIn'); 
            weatherDetails.classList.add('fadeIn');

            container.style.height = '590px'; // Readjusting container's height

            // Forecast in Left Section
            let temp = json.main.temp;
            displayForecast(json, lat, lon,temp);
            displayAQ(lat, lon);            
            getAmbienceData(city);
            addCity(City);
    
    })
});

getLocation.addEventListener('click', async () => {
    navigator.geolocation.getCurrentPosition(gotLocation,failedLocation); //navigator is the object; GeoLocation API
});

function gotLocation(position){
    console.log("Location tracked");
    // console.log (position);
    const APIKey = `a51436fe16293393a10f617c7eaf0bca`;
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const data = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`)
    .then(response => response.json())
    .then(json => {
        if(json.cod === '404') // HTTP Status code 404 - Resource not found
            console.log('Failed to track location');   
            
            // console.log(json); // json here is lat and lon based data
            
            topContainer.style.height = '550px';
            bottomContainer.style.display = 'none';
            container.style.height = '10vh';
            container.style.paddingTop = '0';
            const localTemperature = document.getElementById('temperature-local');
            const localCity = document.getElementById('city-local');
            localTemperature.innerHTML = `${(json.main.temp-273.15).toFixed(2)}<span>°C</span>`;
            localCity.innerHTML = `${json.name}`;

            const localHumidity = document.getElementById('humidity-local');
            const localWind = document.getElementById('wind-local');
            localHumidity.innerHTML = `${json.main.humidity}%`;
            localWind.innerHTML = `${json.wind.speed} Km/h`;

            const localImage = document.getElementById('image-local');
            switch(json.weather[0].main){
                case 'Clear':
                    localImage.src = '../images/clear_sun.png';
                    break;
                case 'Rain':
                    localImage.src = '../images/rain.png';
                    break;
                case 'Snow':
                    localImage.src = '../images/snow.png';
                    break;                
                case 'Clouds':
                    localImage.src = '../images/clouds.png';
                    break;
                case 'Haze':
                    localImage.src = '../images/haze.png';
                    break;
                case 'Mist':
                    localImage.src = '../images/mist.png';
                    break;
                default:
                    localImage.src = '';
            }

        const temp = json.main.temp-273.15;    
        displayForecast(json, lat, lon,temp);
        displayAQ(lat, lon);
        getAmbienceData(json.name);

    });    
}

function failedLocation(){
    alert("Access denied. Failed to trace location");
}

function displayForecast(data, lat, lon,temp){
    const APIKey ='a51436fe16293393a10f617c7eaf0bca';
    // console.log(lat, lon);
    let date = new Date();

    let forecast_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;

    currentWeatherCard.innerHTML = `<div class="current-weather flex justify-between items-center">
                        <div class="details">
                            <p class=" text-orange-300 text-sm">Now</p>
                            <h2 class="text-white text-3xl mx-2"> ${temp.toFixed(2)}&deg;C</h2>
                            <p class="text-gray-400 text-sm mx-2"> ${data.weather[0].description}</p>
                        </div>
                        <div class="weather-icon">
                            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}" alt="">
                        </div>
                    </div>
                    <hr class="my-1 border-t-2 ">
                    <div class="card-footer text-sm">
                        <p class="text-gray-100 mb-3"><i class="fa-regular fa-calendar text-sky-200 text-lg"></i>  ${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]} </p>
                        <p class="text-gray-100 mb-3"><i class="fa-solid fa-location-dot text-green-300 text-lg"></i>  ${data.name}, ${data.sys.country}</p>
                    </div>`;

    fetch(forecast_URL).then(res => res.json()).then(dataII => {
        // console.log(dataII); // dataII is forecast related data 
        let uniqueDays = [];
        let fiveDays = dataII.list.filter(forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueDays.includes(forecastDate))
                return uniqueDays.push(forecastDate); // Total 6 days pushed into array
        });
        
        forecastCard.innerHTML = ``;
        for(i=0;i<fiveDays.length;i++){
            let date = new Date(fiveDays[i].dt_txt);
            forecastCard.innerHTML += 
            `<div class="forecast-item grid grid-cols-3 gap-3 place-items-center mb-1">
                            <div class="icon-wrapper flex">
                                <img src="https://openweathermap.org/img/wn/${fiveDays[i].weather[0].icon}.png" alt="">
                                <span class="text-white">${(fiveDays[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                            </div>
                            <p class="text-gray-200">${date.getDate()} ${months[date.getMonth()]}</p>
                            <p class="text-gray-200">${days[date.getDay()]}</p>
        </div>`;
        }

        console.log("Display Forecast CB called");
                    
    }).catch(()=>{
        alert("Failed to fetch forecast data.");
    });
}

function displayAQ(lat, lon){

    let APIKey = 'a51436fe16293393a10f617c7eaf0bca';
    let aqi_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${APIKey}`;

    fetch(aqi_URL).then(res => res.json()).then(dataIII => {
        // console.log(dataIII); // dataIII is Air Quality related data
        let {co, no, no2, o3, so2, pm2_5, pm10, nh3} = dataIII.list[0].components; // Object destructuring
        // console.log(co,no,no2, o3, so2, pm2_5, pm10, nh3);
        let aqiScore = ['Good','Fair','Moderate','Poor','Very Poor'];

        aqiCard.innerHTML = `
        <div class="card-head flex gap-28 justify-between mb-3 p-3 rounded-xl bg-gray-800 bg-opacity-20">
                    <p class="text-white">Score</p>
                    <p class="air-index aqi-${dataIII.list[0].main.aqi} text-black text-sm font-semibold rounded-2xl px-1 py-1">${aqiScore[dataIII.list[0].main.aqi - 1]}</p> 
                </div> 
                <div class="stats grid grid-cols-2 place-items-center">                    
                    <div class="item text-center">
                        <p class="text-gray-400 text-sm font-semibold text-center ">PM2.5</p>
                        <h2 class="text-white text-2xl">${pm2_5}</h2>
                    </div>
                    <div class="item text-center">
                        <p class="text-gray-400 text-sm font-semibold text-center">PM10</p>
                        <h2 class="text-white text-2xl">${pm10}</h2>
                    </div>
                    <div class="item text-center">
                        <p class="text-gray-400 text-sm font-semibold text-center">S02</p>
                        <h2 class="text-white text-2xl">${so2}</h2>
                    </div>
                    <div class="item text-center">
                        <p class="text-gray-400 text-sm font-semibold text-center">CO</p>
                        <h2 class="text-white text-2xl">${co}</h2>
                    </div>
                    <div class="item text-center">
                        <p class="text-gray-400 text-sm font-semibold text-center">NO</p>
                        <h2 class="text-white text-2xl">${no}</h2>
                    </div>
                    <div class="item text-center">
                        <p class="text-gray-400 text-sm font-semibold text-center">NO2</p>
                        <h2 class="text-white text-2xl">${no2}</h2>
                    </div>
                    <div class="item text-center">
                        <p class="text-gray-400 text-sm font-semibold text-center">NH3</p>
                        <h2 class="text-white text-2xl">${nh3}</h2>
                    </div>
                    <div class="item text-center">
                        <p class="text-gray-400 text-sm font-semibold text-center">O3</p>
                        <h2 class="text-white text-2xl">${o3}</h2>
                    </div>    
                </div>`;
        console.log("display AQI CB called");

    }).catch(() => {alert("Failed to fetch Air Quality data for the location.")});
}

function getAmbienceData(city){

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
    .then(response => response.json())
    .then(dataIV => {
        pressure = dataIV.main.pressure;
        visibility = dataIV.visibility;
        sunrise = dataIV.sys.sunrise;
        sunset = dataIV.sys.sunset;
        timezone = dataIV.timezone;
        // console.log(pressure,visibility,sunrise,sunset,timezone);
        let sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh: mm A'),
        sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh: mm A');

        dayCard.innerHTML = `
        <div class="card-head">
                    <p class="text-white text-xl mb-3 text-center font-medium">Sunrise & Sunset</p>
                </div>

                <!--Sun/Daylight Status-->
                <div class="sunrise-sunset grid grid-cols-2 place-items-center">
                    <div class="item flex items-center gap-3">
                        <div class="icon">
                            <i class="fa-solid fa-sun fa-2x text-yellow-300"></i>
                        </div>
                        <div>
                            <p class="text-gray-200">Sunrise</p>
                            <h2 class="text-yellow-100 mt-4 font-bold">${sRiseTime}</h2>
                        </div>    
                    </div>

                    <div class="item flex items-center gap-3">
                        <div class="icon">
                            <i class="fa-solid fa-star fa-2x text-violet-300"></i>
                        </div>
                        <div>
                            <p class="text-gray-200">Sunset</p>
                            <h2 class="text-purple-300 mt-4 font-bold">${sSetTime}</h2>
                        </div>    
                    </div>
                </div>`;
        console.log("Sunrise Sunset CB called");

        let pressureVal = document.getElementById('pressureVal');
        let visibilityVal = document.getElementById('visibilityVal');

        pressureVal.innerHTML = `${pressure} hPa`;
        visibilityVal.innerHTML = `${visibility/1000} Km`;  

    })
}

function addCity(city){ 
    let cityList = JSON.parse(localStorage.getItem('Recent_Cities')) || [];

    if(!cityList.includes(city)){
        cityList.push(city);
        localStorage.setItem('Recent_Cities', JSON.stringify(cityList));
    }
}

function populateDropDown(){
    let cityList = JSON.parse(localStorage.getItem('Recent_Cities')) || [];

    const dropDown = document.getElementById('dropdown');
    dropDown.innerHTML = ''; // Empties the previously populated <select> node for preventing duplicate entries.
    
    if(cityList.length>0){
        // dropDown.style.display = 'block';
        cityList.forEach(city => {
            let option = document.createElement('option');
            option.innerHTML = city;
            dropDown.append(option); 
        })
    }
    else dropDown.style.display = 'none';
}

//---------------- Loading the data of recent city selected from dropdown menu--------------
let choice = document.getElementById('dropdown');
// console.log(choice);
choice.addEventListener('change',(event)=>{
    // console.log("option changed") // When the option under a select element is changed, event gets triggered.
    const selectedOption = event.target.value;
    // console.log(selectedOption);

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${selectedOption}&units=metric&appid=${APIKey}`)
    .then(res => res.json())
    .then(json => {
        error404.style.display = 'none';  // Hides the error image if ${city} is valid
        error404.classList.remove('fadeIn'); // Removes the className attached and thus, the animation defined.

        topContainer.style.display = 'none';
        bottomContainer.style.display = 'none'; 

        const image = document.querySelector('.weather-box img') // Targets the image under weather box
        const temperature = document.querySelector('.weather-box .temperature');
        const description = document.querySelector('.weather-box .description');
        const humidity = document.querySelector('.weather-details .humidity span');
        const wind = document.querySelector('.weather-details .wind span');

        lon = json.coord.lon;
        lat = json.coord.lat;
            
            switch(json.weather[0].main){ // Scans the JSON data of a particular City
                case 'Clear':
                    image.src = '../images/clear_sun.png';
                    break;
                case 'Rain':
                    image.src = '../images/rain.png';
                    break;
                case 'Snow':
                    image.src = '../images/snow.png';
                    break;                
                case 'Clouds':
                    image.src = '../images/clouds.png';
                    break;
                case 'Haze':
                    image.src = '../images/haze.png';
                    break;
                case 'Mist':
                    image.src = '../images/mist.png';
                    break;
                default:
                    image.src = '';
            }

            temperature.innerHTML = `${json.main.temp}<span>°C</span>`; // Injects the temperature reading 
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`; // Injects the Humidity reading
            wind.innerHTML = `${json.wind.speed} Km/h`;

                    // console.log(json.main.temp,json.weather[0].description,json.main.humidity,json.wind.speed); // To verify data reception
            // console.log(json);
            
            weatherBox.style.display = '';
            weatherDetails.style.display = '';

            // Attributing animation to the display modules - weatherBox and weatherDetails
            weatherBox.classList.add('fadeIn'); 
            weatherDetails.classList.add('fadeIn');

            container.style.height = '590px'; // Readjusting container's height

            // Forecast in Left Section
            let temp = json.main.temp;
            displayForecast(json, lat, lon,temp);
            displayAQ(lat, lon);            
            getAmbienceData(selectedOption);
    });
});

cityButton.addEventListener('click',()=>{
    const dropDown = document.getElementById('dropdown');
    let cityList = JSON.parse(localStorage.getItem('Recent_Cities')) || [];
    if(cityList.length > 0){
        if(dropDown.style.display !== 'none'|| dropDown.style.display !== ''){
            populateDropDown();
            dropDown.style.display = 'block';       
    }
     else dropDown.displaystyle = 'none';
    } else alert("No recent cities found");
    });