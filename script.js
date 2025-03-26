let url ="https://api.open-meteo.com/v1/forecast?latitude=48.8534&longitude=2.3488&daily=weather_code,temperature_2m_min,temperature_2m_max&hourly=temperature_2m,relative_humidity_2m&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code,is_day&timezone=Europe%2FBerlin";

fetch(url)
    .then(function(response){
        return response.json();
    })
    .then(function(donnees){

        console.log(donnees);

        const currentWeather = donnees.current;
        const currentDaily = donnees.daily;
        const currentTimeWeather = donnees.hourly;
        console.log(currentWeather);
        console.log(currentTimeWeather);

// date du jour
    let daydate = currentWeather.time;
    let dateFormat = new Date(daydate);

    let formattedDate = dateFormat.toLocaleDateString("fr-FR",{
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    let formattedTime = dateFormat.toLocaleTimeString("fr-FR",{
        hour: "2-digit",
        minute: "2-digit",
    });

    let dateTime = `<span class="date-style">${formattedDate}<span><br><span class="time-style">${formattedTime.replace(":", "h")}<span>`;

    document.getElementById("date").innerHTML = dateTime;

// background
    let container = document.querySelector(".container");
    let weatherDayCode = currentWeather.weather_code;

    if(weatherDayCode === 0){
        container.style.background = "url('assets/images/sun.jpg')";
        container.style.backgroundSize = "cover";
    } else if ( weatherDayCode>0 && weatherDayCode<45){
        container.style.background = "url('assets/images/suncloud.jpg')";
        container.style.backgroundSize = "cover";
    } else if (weatherDayCode>=45 && weatherDayCode<61){
        container.style.background = "url('assets/images/cloud.jpg')";
        container.style.backgroundSize = "cover";
    } else if(weatherDayCode>=61 && weatherDayCode<95){
        container.style.background = "url('assets/images/rain.jpg')";
        container.style.backgroundSize = "cover";
    } else if (weatherDayCode>=95){
        container.style.background = "url('assets/images/thunder.jpg')";
        container.style.backgroundSize = "cover";
    };


// jour/nuit
        let daynight = document.getElementById("night");
        let isDay = currentWeather.is_day;
        if(isDay === 1){
            daynight.innerHTML = `<img src="assets/images/daynight-picto1.png"></img>`
        } else {
            daynight.innerHTML = `<img src="assets/images/daynight-picto2.png"></img>`
        };
        
// force et direction du vent
        let compass = document.getElementById("compass");
        let windSpeed = currentWeather.wind_speed_10m
        let windDirection = currentWeather.wind_direction_10m;
        let compassArrow = document.createElement("div");
        let divWindSpeed = document.createElement("div");
        compassArrow.id = "compassArrow";
        divWindSpeed.id = "divWindSpeed";

    // direction du vent
        function rotateArrow(){
            compassArrow.innerHTML = `<img src="assets/images/compass-arrow.png">`;
            compassArrow.style.transform = `rotate(${windDirection}deg)`;
        }

    // vitesse du vent
        divWindSpeed.innerHTML = windSpeed + " km/heures";

    // fond de la cellule
        compass.style.background = "url('assets/images/compass.png')";
        compass.style.backgroundRepeat = "no-repeat";
        compass.style.backgroundPosition = "center";
    
    // affichage de la boussole
        compass.appendChild(compassArrow);
        compass.appendChild(divWindSpeed);

        rotateArrow();

        /** 
        compass.innerText = currentWeather.wind_speed_10m + " km/h";
        **/


// météo du jour
        let weatherDay = document.getElementById("weatherDay");
        let temperatureDay = currentWeather.temperature_2m;
        

        if(weatherDayCode === 0){
            weatherDay.innerHTML = `Ensoleillé <br>
            <img src="assets/images/pictos-weather-sunny.png"> <br>
            <span class="temp-style">${temperatureDay}°<span>`
        } else if ( weatherDayCode>0 && weatherDayCode<45){
            weatherDay.innerHTML = `Nuageux <br>
            <img src="assets/images/pictos-weather-cloudy-sun.png"> <br>
            <span class="temp-style">${temperatureDay}°<span>`
        } else if (weatherDayCode>=45 && weatherDayCode<61){
            weatherDay.innerHTML = `Couvert <br>
            <img src="assets/images/pictos-weather-cloudy.png"> <br>
            <span class="temp-style">${temperatureDay}°<span>`
        } else if(weatherDayCode>=61 && weatherDayCode<95){
            weatherDay.innerHTML = `Pluvieux <br>
            <img src="assets/images/pictos-weather-rainning-sun.png"> <br>
            <span class="temp-style">${temperatureDay}°<span>`
        } else if (weatherDayCode>=95){
            weatherDay.innerHTML = `Orageux <br>
            <img src="assets/images/pictos-weather-rainning.png"> <br>
            <span class="temp-style">${temperatureDay}°<span>`
        };

//météo par heure
        let timeHumidity =[];
        let timeTemperature = [];
        let time = [];
        let divWeatherByTime = [];
        let divHumidityByTime = [];
        let divTemperatureByTime = [];
        let divTimeByTime = [];
        let timeDailyFormat = [];
        let dayTime = [];
        let formattedDailyTime = [];
        let nbTimeView = 6
        let weatherByTime = document.getElementById("weatherByTime");

        timeHumidity = currentTimeWeather.relative_humidity_2m;
        timeTemperature = currentTimeWeather.temperature_2m;
        dayTime = currentTimeWeather.time;

        for(i=0; i<dayTime.length; i++){
            divWeatherByTime[i] = document.createElement("div");
            divHumidityByTime[i] = document.createElement("div");
            divTemperatureByTime[i] = document.createElement("div");
            divTimeByTime[i] = document.createElement("div");

            divWeatherByTime[i].id = "divWeatherByTime";
            divHumidityByTime[i].id = "divHumidityByTime";
            divTemperatureByTime[i].id = "divTemperatureByTime";
            divTimeByTime[i].id = "divTimeByTime";


            timeDailyFormat[i] = new Date(dayTime[i]);
            formattedDailyTime[i] = timeDailyFormat[i].toLocaleTimeString("fr-FR",{
                hour: "2-digit",
                minute: "2-digit",
            });

            divHumidityByTime[i].innerHTML = `<img src="assets/images/umbrella.png"> ${timeHumidity[i]}%`;
            divTemperatureByTime[i].innerHTML = `<img src = "assets/images/thermometer.png"> ${timeTemperature[i]}°`;
            divTimeByTime[i].innerHTML = `${formattedDailyTime[i].replace(":", "h")}`;

            divWeatherByTime[i].appendChild(divHumidityByTime[i]);
            divWeatherByTime[i].appendChild(divTemperatureByTime[i]);
            divWeatherByTime[i].appendChild(divTimeByTime[i]);

            weatherByTime.appendChild(divWeatherByTime[i]);
        };

// météo par jour
        let weatherDayList = [];
        let maxTemp = [];
        let minTemp = [];
        let dayWeek = [];
        let dateDailyFormat = [];
        let formattedDailyDate = [];
        let weatherCode = [];
        let day = [document.getElementById("day0"), 
            document.getElementById("day1"),
            document.getElementById("day2"),
            document.getElementById("day3"),
            document.getElementById("day4"),
            document.getElementById("day5"),
            document.getElementById("day6")];

        weatherDayList = currentDaily;
        maxTemp = currentDaily.temperature_2m_max
        minTemp = currentDaily.temperature_2m_min;
        dayWeek =  currentDaily.time;
        weatherCode = currentDaily.weather_code;

        console.log(weatherDayList);
        console.log(minTemp);
        console.log(maxTemp);
        console.log(dayWeek);


        for(i=0; i<day.length;i++){
            dateDailyFormat[i] = new Date(dayWeek[i]);

            formattedDailyDate[i] = dateDailyFormat[i].toLocaleDateString("fr-FR",{
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });

            if(weatherCode[i] === 0){
                day[i].innerHTML = `${formattedDailyDate[i]} <br>
                <img src="assets/images/pictos-weather-sunny.png"> <br>
                Max : ${maxTemp[i]} ° <br>
                Min: ${minTemp[i]} °`
            } else if ( weatherCode[i]>0 && weatherCode[i]<45){
                day[i].innerHTML = `${formattedDailyDate[i]} <br>
                <img src="assets/images/pictos-weather-cloudy-sun.png"> <br>
                Max : ${maxTemp[i]} ° <br>
                Min: ${minTemp[i]} °`
            } else if (weatherCode[i]>=45 && weatherCode[i]<61){
                day[i].innerHTML = `${formattedDailyDate[i]} <br>
                </br><img src="assets/images/pictos-weather-cloudy.png"> <br>
                Max : ${maxTemp[i]} ° <br>
                Min: ${minTemp[i]} °`
            } else if(weatherCode[i]>=61 && weatherCode[i]<95){
                day[i].innerHTML = `${formattedDailyDate[i]} <br>
                <img src="assets/images/pictos-weather-rainning-sun.png"> <br>
                Max : ${maxTemp[i]} ° <br>
                Min: ${minTemp[i]} °`
            } else if (weatherCode[i]>=95){
                day[i].innerHTML = `${formattedDailyDate[i]} <br>
                </br><img src="assets/images/pictos-weather-rainning.png"> <br>
                Max : ${maxTemp[i]} ° <br>
                Min: ${minTemp[i]} °`
            };
        }
    })
    .catch(function(erreur){
        console.log(erreur);
    });