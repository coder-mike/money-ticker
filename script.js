'use strict';

const oneHour = 3600000;

document.querySelector('#pause-continue').addEventListener('click', pauseClick);

const earnedTicker = document.querySelector('#earned');
const remainingTicker = document.querySelector('#remaining');
const missedTicker = document.querySelector('#missed');
const targetTicker = document.querySelector('#target');

const dayEnd = +new Date('2018-11-18T22:00:00+11:00');
const dayStart = +new Date('2018-11-18T08:00:00+11:00');

earnedTicker.value = loadValue('earned', {
  startTime: Date.now(),
  startValue: 0,
  rate: 60 / oneHour,
  ticking: true
});

remainingTicker.value = loadValue('remaining', {
  startTime: dayEnd,
  startValue: 0,
  rate: -60 / oneHour,
  ticking: true
});

missedTicker.value = {
  startTime: dayEnd,
  startValue: remainingTicker.projected(dayStart) - earnedTicker.projected(dayEnd),
  rate: 60 / oneHour,
  ticking: !earnedTicker.value.ticking,
};

targetTicker.value = {
  startTime: dayEnd,
  startValue: remainingTicker.projected(dayStart) - earnedTicker.projected(dayEnd),
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
  const pauseContinueButton = document.querySelector('#pause-continue');
  if (earnedTicker.value.ticking) {
    pauseContinueButton.value = 'Pause';
    pauseContinueButton.classList.remove('paused');
  } else {
    pauseContinueButton.value = 'Continue';
    pauseContinueButton.classList.add('paused');
  }
}