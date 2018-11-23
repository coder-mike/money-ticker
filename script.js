'use strict';

const oneHour = 3600000;

document.querySelector('#pause-continue').addEventListener('click', pauseClick);

const earnedTicker = document.querySelector('#earned');
const remainingTicker = document.querySelector('#remaining');
const missedTicker = document.querySelector('#missed');
const targetTicker = document.querySelector('#target');

const dayStartTime = 8 * 3600000; // 8 AM
const dayEndTime = 22 * 3600000; // 10 PM

const day = new Date().setHours(0,0,0,0);
const dayStart = +day + dayStartTime;
const dayEnd = +day + dayEndTime;

earnedTicker.value = loadValue('earned', {
  startTime: Date.now(),
  startValue: 0,
  rate: 60 / oneHour,
  ticking: true
});

remainingTicker.value = {
  startTime: dayEnd,
  startValue: 0,
  rate: -60 / oneHour,
  ticking: true
};

missedTicker.value = {
  startTime: dayEnd,
  startValue: remainingTicker.valueAt(dayStart) - earnedTicker.valueAt(dayEnd),
  rate: 60 / oneHour,
  ticking: !earnedTicker.value.ticking,
};

targetTicker.value = {
  startTime: dayEnd,
  startValue: remainingTicker.valueAt(dayStart) - earnedTicker.valueAt(dayEnd),
  rate: 60 / oneHour,
  ticking: !earnedTicker.value.ticking,
};

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
  missedTicker.value = {
    ...missedTicker.value,
    ticking: !earnedTicker.value.ticking
  };
  updatePauseButton();
  save();
}

function updatePauseButton() {
  console.log('ticking', earnedTicker.value.ticking)
  const pauseContinueButton = document.querySelector('#pause-continue');
  if (earnedTicker.value.ticking) {
    pauseContinueButton.value = 'Pause';
    pauseContinueButton.classList.remove('paused');
  } else {
    pauseContinueButton.value = 'Continue';
    pauseContinueButton.classList.add('paused');
  }
}