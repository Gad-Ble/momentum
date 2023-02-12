import playList from './playList.js';
const timeSection = document.querySelector('.time');
const dateSection = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const name = document.querySelector('.name');
const body = document.querySelector('body');
const slidePrev = document.querySelector('.slide-prev');
const slideNext = document.querySelector('.slide-next');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');
const playPrev = document.querySelector('.play-prev');
const playNext = document.querySelector('.play-next');
const play = document.querySelector('.play');
const playListItems = document.querySelector('.play-list');



let isPlay = false;
let randomNum = 10;
let timeOfDay = '';

//Функция добавления времени на страницу (через неё происходит вызов всех функций, которым необходимо обновление времени)
function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    timeSection.textContent = currentTime;
    showDate()
    getTimeOfDay()
    setTimeout(showTime, 1000);
}
showTime()
// ----------------------------------------------------------\\

// Функция добавления даты на страницу
function showDate() {
    const date = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const currentDate = date.toLocaleDateString('en-US', options);
    dateSection.textContent = currentDate;
}
// ----------------------------------------------------------\\

// Функция приветствия (добавляет время суток к приветствию)
function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 0 && hours <= 6) {
        greeting.textContent = 'Good' + ' ' + 'night';
        timeOfDay = 'night'
    } else if (hours > 6 && hours <= 12) {
        greeting.textContent = 'Good' + ' ' + 'morning';
        timeOfDay = 'morning'
    } else if (hours > 12 && hours <= 18) {
        greeting.textContent = 'Good' + ' ' + 'afternoon';
        timeOfDay = 'afternoon'
    } else if (hours > 18 && hours <= 23) {
        greeting.textContent = 'Good' + ' ' + 'evening';
        timeOfDay = 'evening'
    }
}
// ----------------------------------------------------------\\

// Сохранение имени в памяти браузера
function setLocalStorage() {
    localStorage.setItem('name', name.value);
    localStorage.setItem('city', city.value);
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
    if (name.value === '') {
        name.placeholder = '[Enter name]'
    }
    if (localStorage.getItem('name')) {
        name.value = localStorage.getItem('name');
    } else {
        name.value = ''
    }
    if (localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');
        getWeather()
    } else {
        city.value = 'Minsk'
        getWeather()
    }
}
window.addEventListener('load', getLocalStorage)
// ----------------------------------------------------------\\

// Функция получения рандомного числа
function getRandomNum() {
    let num = Math.floor(Math.random() * 20) + 1;
    if (num < 10) {
        num = '0' + num;
    }
    randomNum = num
    setBg()
}
getRandomNum()
// ----------------------------------------------------------\\

// Переключение слайдеров по клику по кнопке
slideNext.addEventListener('click', () => {
    let number = parseInt(randomNum);
    number++;
    if (number > 20) {
        number = 1;
    }
    if (number < 10) {
        number = '0' + number;
    }
    randomNum = number;
    setBg()
})
slidePrev.addEventListener('click', () => {
    let number = parseInt(randomNum);
    number--;
    if (number < 1) {
        number = 20;
    }
    if (number < 10) {
        number = '0' + number;
    }
    randomNum = number;
    setBg()
})
//------------------------------------------------------------\\

// Функция указания фонового цвета
function setBg() {
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${randomNum}.jpg`;
    img.onload = () => {
        body.style.backgroundImage = `url(${img.src})`
    }
}

// ----------------------------------------------------------\\

//Виджет погоды
city.addEventListener('change', () => {
    if (city.value === '') {
        city.placeholder = '[Enter city]'
        weatherIcon.className = 'weather-icon owf';
        temperature.textContent = `Error! Nothing to geocode for ''!`;
        weatherDescription.textContent = '';
        humidity.textContent = '';
        wind.textContent = '';

    }
    getWeather()
})
async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=50fe72f01dc3f2f95c8d7672ffc3a9c6&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.floor(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    wind.textContent = `Wind speed: ${Math.floor(data.wind.speed)} m/s`;
}
// ----------------------------------------------------------\\

// Виджет цитаты
async function getQuotes() {
    let num = Math.floor(Math.random() * 1643);
    const url = 'https://type.fit/api/quotes';
    const res = await fetch(url);
    const data = await res.json();
    quote.textContent = data[num].text;
    author.textContent = data[num].author;
}
getQuotes()

changeQuote.addEventListener('click', () => {
    getQuotes()
})
// ----------------------------------------------------------\\


// Плеер
const audio = new Audio();
let playNum = 0;


for (let a = 0; a < Object.keys(playList).length; a++) {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = playList[a].title
    playListItems.append(li)
}

const playItems = document.querySelectorAll('.play-item');
playItems[0].classList.add('item-active');

function playAudio() {
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    if (isPlay === false) {
        audio.play();
        isPlay = true
        play.classList.remove('play');
        play.classList.add('pause');
    } else {
        play.classList.remove('pause');
        play.classList.add('play');
        audio.pause();
        isPlay = false
    }

}

playNext.addEventListener('click', () => {
    playItems[playNum].classList.remove('item-active')
    if (playNum < Object.keys(playList).length - 1) {
        isPlay = false
        playNum++
        playAudio()
    } else if (playNum === Object.keys(playList).length - 1) {
        isPlay = false
        playNum = 0
        playAudio()
    }
    playItems[playNum].classList.add('item-active')
})

playPrev.addEventListener('click', () => {
    playItems[playNum].classList.remove('item-active')
    if (playNum > 0) {
        isPlay = false
        playNum--
        playAudio()
    } else if (playNum === 0) {
        isPlay = false
        playNum = Object.keys(playList).length - 1
        playAudio()
    }
    playItems[playNum].classList.add('item-active')
})

play.addEventListener('click', () => {
    if (isPlay === false) {
        playAudio();
        isPlay = true;
    } else {
        playAudio();
        isPlay = false;
    }
})
// ----------------------------------------------------------\\