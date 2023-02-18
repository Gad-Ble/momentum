import playList from './playlist.js';
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
const progressAudio = document.querySelector('.progress');
const progressBar = document.querySelector('.progress-bar');
const currentTimeAudio = document.querySelector('.current-time');



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

// Функция указания фонового изображения
function setBg() {
    const img = new Image();
    img.src = `./assets/img/${timeOfDay}/${randomNum}.webp`;
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
currentTimeAudio.textContent = '0:00/0:00'

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
    audio.currentTime = current;
    audio.play();
    isPlay = true
    play.classList.remove('play');
    play.classList.add('pause');
    audio.addEventListener('timeupdate', updateProgress);
    progressBar.addEventListener('click', setProgress);
    audio.addEventListener('ended', nextTrack)
}
function pauseAudio() {
    play.classList.remove('pause');
    play.classList.add('play');
    audio.pause();
    isPlay = false;
}
function nextTrack() {
    playItems[playNum].classList.remove('item-active');
    current = 0;
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
}
function prevTrack() {
    playItems[playNum].classList.remove('item-active');
    current = 0;
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
}
playNext.addEventListener('click', nextTrack)
playPrev.addEventListener('click', prevTrack)
play.addEventListener('click', () => {
    if (isPlay) {
        pauseAudio()
    } else {
        playAudio()
    }
})

playItems.forEach((element, index) => {
    element.addEventListener('click', () => {
        playItems[playNum].classList.remove('item-active');
        if (isPlay) {
            pauseAudio()
        }
        current = 0;
        playNum = index;
        playItems[playNum].classList.add('item-active');
        playAudio();
    })
});

let current = 0;

function updateProgress() {
    const audioWidth = audio.duration;
    current = audio.currentTime;
    const progress = (current / audioWidth) * 100;
    progressAudio.style.width = `${progress}%`;
    let currentMinutes = Math.floor(current / 60);
    let currentSeconds = Math.floor(current % 60);
    let durationMinutes = Math.floor(audioWidth / 60);
    let durationSeconds = Math.floor(audioWidth % 60);
    if (currentSeconds < 10) {
        currentSeconds = `0${Math.floor(current % 60)}`;
    }
    if (durationSeconds < 10) {
        durationSeconds = `0${Math.floor(audioWidth % 60)}`;
    }
    currentTimeAudio.textContent = `${currentMinutes}:${currentSeconds} / ${durationMinutes}:${durationSeconds}`;
}


function setProgress(e) {
    const width = progressBar.clientWidth;
    const click = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = click / width * duration;
}

const soundLevelBar = document.querySelector('.sound_level_bar');
const soundLevel = document.querySelector('.sound_level');
const soundIcon = document.querySelector('.sound_icon');
const sound = document.querySelector('.sound');

soundIcon.addEventListener('click', () => {
    if (audio.muted) {
        audio.muted = false;
        soundIcon.src = './assets/svg/sound-high.svg'
    } else {
        audio.muted = true;
        soundIcon.src = './assets/svg/sound-off.svg'
    }
})

sound.addEventListener('mouseover', () => {
    soundLevelBar.style.width = '100%'
    sound.style.width = '100px'
})
sound.addEventListener('mouseout', () => {
    soundLevelBar.style.width = '0'
    sound.style.width = ''
})
function audioVolume(e) {
    const width = soundLevelBar.clientWidth;
    const click = e.offsetX;
    audio.volume = click % 100 / width;
    soundLevel.style.width = `${audio.volume * 100}%`;
}
soundLevelBar.addEventListener('click', audioVolume)
// ----------------------------------------------------------\\
