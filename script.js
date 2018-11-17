'use strict';

const oneHour = 3600000;

document.querySelector('#pause').addEventListener('click', pauseClick);

const earnedTicker = new Ticker(document.querySelector('#earned'));
const remainingTicker = new Ticker(document.querySelector('#remaining'));

earnedTicker.value = loadValue('earned', {
  startTime: Date.now(),
  startValue: 0,
  rate: 60 / oneHour,
  ticking: true
});

remainingTicker.value = loadValue('remaining', {
  startTime: +new Date('2018-11-18T22:00:01+11:00'),
  startValue: 0,
  rate: -60 / oneHour,
  ticking: true
});

save();
updatePauseButton();

function save() {
  saveValue('earned', earnedTicker.value);
  saveValue('remaining', remainingTicker.value);

}

function loadValue(key, defaultValue) {
  try {
    const encoded = window.localStorage.getItem(key);
    if (encoded === null || encoded === undefined) return defaultValue;
    const decoded = JSON.parse(encoded);
    return decoded;
  } catch (e) {
    console.error(e);
    return defaultValue;
  }
}

function saveValue(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function pauseClick() {
  earnedTicker.value = {
    ...earnedTicker.value,
    ticking: !earnedTicker.value.ticking
  };
  updatePauseButton();
  save();
}

function updatePauseButton() {
  document.querySelector('#pause').value = earnedTicker.value.ticking ? 'Pause' : 'Continue';
}