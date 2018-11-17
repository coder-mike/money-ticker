'use strict';

const oneHour = 3600000;

document.querySelector('#pause').addEventListener('click', pauseClick);

const ticker = new Ticker(document.querySelector('#earned'));
ticker.value = {
  startTime: loadValue('startTime', Date.now()),
  startValue: loadValue('startValue', 0),
  rate: loadValue('rate', 60 / oneHour),
  ticking: loadValue('isWorking', true)
};
save();
updatePauseButton();

function save() {
  const { startTime, startValue, rate } = ticker.value;
  saveValue('startTime', startTime);
  saveValue('startValue', startValue);
  saveValue('rate', rate);
  saveValue('isWorking', ticker.ticking);
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
  ticker.value = {
    ...ticker.value,
    ticking: !ticker.value.ticking
  };
  updatePauseButton();
  save();
}

function updatePauseButton() {
  document.querySelector('#pause').value = ticker.value.ticking ? 'Pause' : 'Continue';
}