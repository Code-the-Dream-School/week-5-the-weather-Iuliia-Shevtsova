
const cityName = document.getElementById('city').value;
const button = document.getElementById('search'); 
const weatherForecast = document.getElementById('info');
var latitude = '';
var longitude ='';

/*****ASYNC FUNCTIONS******/
async function getJSON(url) {
    try {
        const response = await fetch(url);
        const responseJSON = response.json(); //get all data of the Object
        console.log(responseJSON); //all data of the Object is shown in the console, can see names of objects inside array
        return await responseJSON; // return data
    } catch (error) {
        throw error;
    }
}


/*****HELPER FUNCTIONS******/
async function getCityCoord(url) {//get data for one day using city name and data for 7 days using lat and lon
    const dataObject = await getJSON(url); //data for one day using city name
    latitude = dataObject.coord.lat;
    longitude = dataObject.coord.lon;
    var dailyWeatherURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude +'&lon=' + longitude + '&units=metric&appid=e83fdeb92943c0451d9ba3b84ad16981';
    var dailyWeather = getJSON(dailyWeatherURL); //data for 7 days using lat and lon
    return Promise.all([dataObject, dailyWeather]); //get array of data from two different url
}

function currentWeatherHTML(data) { //function for current weather, shows City and Country names, current weather   
    console.log(data); //data from 1st arraay of data, it's index = 0, data from 2nd array of data, it's index = 1
    var html = ''; // create tags with information to show 1 day weather, use 1st array data[0]
    html +=`
        <p><strong>City: </strong>${data[0].name}</p> 
        <p><strong>Country: </strong>${data[0].sys.country}</p>
        <p><strong>Current weather: </strong>${data[0].weather[0].description}</p>
        `;
    weatherForecast.innerHTML = html;
//}  

//async function dailyWeatherHTML(data) { //function for daily weather  
    //console.log(data);
    var html2 =''; // create tags with information to show 1 day weather, use 2nd array data[1]
    var table = document.createElement('table'); //create tag table for 7 days weather
    table.className = 'table';

    html2 +=` 
        <thead class="thead-light">
            <th>day</th>
            <th>min</th>
            <th>max</th>
            <th>weather</th>
        </thead>
        `;
    table.innerHTML = html2;
    weatherForecast.appendChild(table);
    
    var tbody = document.createElement('tbody'); //create tag tbody for 7 days weather
    var html3 ='';

    for (let i=0; i<data[1].daily.length; i++){//data from 2nd array of data, it's index = 1
        html3 +=` 
            <tr>      
            <td>${i}</td>
            <td>${data[1].daily[i].temp.min}</td> 
            <td>${data[1].daily[i].temp.max}</td>
            <td><img src="http://openweathermap.org/img/wn/${data[1].daily[i].weather[0].icon}@2x.png"></img></td>
            </tr>  
        `;
    }
    tbody.innerHTML = html3;
    table.appendChild(tbody);
}

/*****EVENT LISTENERS******/
button.addEventListener('click', (event) => {
    const cityName = document.getElementById('city').value.toLowerCase();
    const currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?q='+ cityName + '&appid=e83fdeb92943c0451d9ba3b84ad16981';
   //console.log(cityName);

    if (cityName.length == 0) {
        return window.alert('Enter name of the City');
    } else {
        
        getCityCoord(currentWeatherURL) //get data for one day using city name and data for 7 days using lat and lon
        .then(currentWeatherHTML)
        //.then(getDailyWeather(dailyWeatherURL))
        //.then(dailyWeatherHTML)
        .catch ( e => {
            console.error(e);
        });
    }
  });

