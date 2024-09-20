const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const weatherContainer = document.querySelector(".weatherContainer");
const defaultMessage = document.querySelector(".defaultMessage");
const raindropContainer = document.querySelector(".raindropContainer");
const apiKey = "91e5a896fdb08ea65018ebb00a9b80b8";

// URL for Fog video
const fogVideoUrl =
  "https://static.videezy.com/system/resources/previews/000/038/768/original/stockfootage0453.mp4";

const defaultVideoUrl = ""; // Default video URL if no specific weather condition matches

// Get the video element
const videoSource = document.getElementById("videoSource");

// Show default card content initially
card.style.display = "flex";
defaultMessage.style.display = "flex"; // Show default message

weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault(); //it is preventing the default behaviour of form (refresh the page)
    const city = cityInput.value;
    if (city) { // if we have some city we will "try" some code because it might caught some error
        try {
            const weatherData = await getWeatherData(city); // 1st - we are going to wait for this getWeatherData(); function to return the weather data 
            displayWeatherInfo(weatherData); // 2nd - once we receive our weather data we will call the displayWeatherInfo(); function
        } catch (error) { // catching any error that is caused 
            console.error(error);
            displayError(error);
        }
    } else {
        displayError("Please enter a city");
    }
});


async function getWeatherData(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiURL);
    // console.log(response);
    if (!response.ok) { // 1. if our response is not okay (bc user type anything instead of a valid city) 
        throw new Error("Could not fetch weather data"); // 2. then we will throw a new error message
    }
    // else if our response is okay then we will return the response
    return await response.json();
}

function displayWeatherInfo(data) {
    // console.log(data);
    const { main, weather } = data;
    const temp = main.temp;
    const humidity = main.humidity;
    const description = weather[0].description;
    const id = weather[0].id;
    const city = data.name;


    // Log the weather ID for debugging
    console.log("Weather ID:", id);

    // Hide default message
    defaultMessage.style.display = "none";

    weatherContainer.innerHTML = ""; // doing this bc if there's already some text here , we wouldlike to reset it such as if there was an error message
    raindropContainer.innerHTML = "";
    card.style.display = "flex";

    // now we will create the elements that we previously deleted from the html div element
    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("div"); // changed p to div

    // now we have to change the text content of each of these elements
    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;

    weatherEmoji.innerHTML = getWeatherEmoji(id);

    
    cityDisplay.classList.add("cityDisplay"); // we need to add the css class of cityDisplay to add the styling that we previously gave 
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");   weatherEmoji.classList.add("weatherEmoji");

    weatherContainer.appendChild(cityDisplay);
    weatherContainer.appendChild(tempDisplay);
    weatherContainer.appendChild(humidityDisplay);
    weatherContainer.appendChild(descDisplay);
    weatherContainer.appendChild(weatherEmoji);

    // Add raindrops and snowfall effects if the weather is rainy or snowy

        if (id >= 500 && id < 600) {
          createRaindrops();
        } else if(id  >= 600 && id < 700)
        {
          createSnowflakes();
        }
        else {
          raindropContainer.innerHTML = "";
        }


    // Fog Video
        if (id >= 700 && id < 800) {
          videoSource.src = fogVideoUrl;
          videoSource.parentNode.load();
        }
        else {
          videoSource.src = "";
          videoSource.parentNode.load();
        }
      

}

function getWeatherEmoji(weatherId) {
    let emojiHTML = "";
    switch (true) {

      case weatherId >= 200 && weatherId < 300:  //Thunder
        emojiHTML = `
            <picture>
              <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f329_fe0f/512.webp" type="image/webp">
              <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f329_fe0f/512.gif" alt="🌩" width="150" height="150">
            </picture>`;
        break;
      case weatherId >= 300 && weatherId < 400:  //Drizzle
        emojiHTML = `
            <picture>
              <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f327_fe0f/512.webp" type="image/webp">
              <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f327_fe0f/512.gif" alt="🌧" width="150" height="150">
            </picture>`;
        break;
      case weatherId >= 500 && weatherId < 600:  //Heavy Rain
        emojiHTML = `
            <picture>
              <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/2602_fe0f/512.webp" type="image/webp">
              <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/2602_fe0f/512.gif" alt="☂" width="150" height="150">
            </picture>`;
        break;
      case weatherId >= 600 && weatherId < 700:  //Snowy
        emojiHTML = `
            <picture>
              <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/2744_fe0f/512.webp" type="image/webp">
              <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/2744_fe0f/512.gif" alt="❄" width="150" height="150">
            </picture>`;
        break;
      case weatherId >= 700 && weatherId < 800:  //Foggy
        emojiHTML = `🌁`;
        break;

      case weatherId === 800:  //Sunny
        emojiHTML = `
            <picture>
              <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f31e/512.webp" type="image/webp">
              <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f31e/512.gif" alt="🌞" width="150" height="150">
            </picture>`;
        break;
      case weatherId >= 801 && weatherId < 810: //Cloudy
        emojiHTML = `
            <picture>
              <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f636_200d_1f32b_fe0f/512.webp" type="image/webp">
              <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f636_200d_1f32b_fe0f/512.gif" alt="😶" width="150" height="150">
            </picture>`;
        break;

      default:
        emojiHTML = `
            <picture>
              <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f6f8/512.webp" type="image/webp">
              <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f6f8/512.gif" alt="🛸" width="32" height="32">
            </picture>`;
        break;
    }
    return emojiHTML;
  }

function displayError(message) {
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");  // .add("errorDisplay") , here we are adding the css class of errorDisplay

    weatherContainer.innerHTML = "";
    raindropContainer.innerHTML = "";
    card.style.display = "flex";
    defaultMessage.style.display = "none"; // Hide default message
    weatherContainer.appendChild(errorDisplay); // we will display this paragraph( created in line 29) of errorDisplay to the card 
}


// to create custom rain 
function createRaindrops() {
    raindropContainer.innerHTML = "";
    for (let i = 0; i < 100; i++) {
      const raindrop = document.createElement("div");
      raindrop.classList.add("raindrop");
      raindrop.style.left = `${Math.random() * 100}%`;
      raindrop.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`;
      raindropContainer.appendChild(raindrop);
    }
  }


  //to create custom snow
  function createSnowflakes() {
    raindropContainer.innerHTML = ""; // Clear previous content
    // Create snowflakes with delayed animation
    for (let i = 0; i < 100; i++) {
      const snowflake = document.createElement("div");
      snowflake.classList.add("snowflake");
      snowflake.textContent = Math.random() > 0.5 ? "❄️" : "*"; // Randomly choose symbol
      snowflake.style.left = `${Math.random() * 100}%`;
      snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`; // Random speed between 5 and 10 seconds
      snowflake.style.animationDelay = `${Math.random() * 5}s`; // Random delay to prevent dumping
      snowflake.style.fontSize = `${Math.random() * 10 + 10}px`; // Random size for snowflakes
      raindropContainer.appendChild(snowflake);
    }
  }





