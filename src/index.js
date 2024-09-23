const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");

const getLocation = document.getElementById("location-button");
const topContainer = document.getElementById('t-container');
const bottomContainer = document.getElementById('b-container');
const forecastButton = document.getElementById('forecast-button');

let lon,lat,pressure,visibility,sunrise,sunset,City;

let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

currentWeatherCard = document.querySelectorAll('.weather-left .card')[0];

search.addEventListener('click',()=>{

    const APIKey ='a51436fe16293393a10f617c7eaf0bca';
    const city = document.querySelector('.search-box input').value;
    City = city;

    if(city === '')
        return;
    
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
            pressure = json.main.pressure;
            visibility = json.visibility;
            sunrise = json.sys.sunrise;
            sunset = json.sys.sunset; 
            
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

            displayForecast(json, lat, lon);
    })
});

getLocation.addEventListener('click', async () => {
    navigator.geolocation.getCurrentPosition(gotLocation,failedLocation); //navigator is the object; GeoLocation API
});

function gotLocation(position){
    console.log("Location tracked");

    const APIKey = `a51436fe16293393a10f617c7eaf0bca`;
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const data = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`)
    .then(response => response.json())
    .then(json => {
        if(json.cod === '404') // HTTP Status code 404 - Resource not found
            console.log('Failed to track location');   
            
            // console.log(json);
            
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
    });    
}

function failedLocation(){
    alert("Access denied. Failed to trace location");
}

function displayForecast(data, lat, lon){
    const APIKey ='a51436fe16293393a10f617c7eaf0bca';
    console.log(lat, lon);
    let date = new Date();

    let forecast_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;

    currentWeatherCard.innerHTML = `<div class="current-weather flex justify-between items-center border-2 border-solid border-sky-200 ">
                        <div class="details">
                            <p class=" text-white text-sm">Now</p>
                            <h2 class="text-white text-3xl mx-2">${data.main.temp.toFixed(2)}&deg;C</h2>
                            <p class="text-gray-400 text-sm mx-2">${data.weather[0].description}</p>
                        </div>
                        <div class="weather-icon">
                            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}" alt="">
                        </div>
                    </div>
                    <hr class="my-1 border-t-2 ">
                    <div class="card-footer text-sm border-2 border-solid border-red-500">
                        <p class="text-gray-100 mb-3"><i class="fa-regular fa-calendar text-white text-lg"></i>${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]} </p>
                        <p class="text-gray-100 mb-3"><i class="fa-solid fa-location-dot text-white text-lg"></i>${data.name}, ${data.sys.country}</p>
                    </div>`;

    fetch(forecast_URL).then(res => res.json()).then(dataII => {
        console.log(dataII);
    }).catch(()=>{
        alert("Failed to fetch forecast data.");
    });
}