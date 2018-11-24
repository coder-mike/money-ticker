'use strict';

const hour = 3600000;
const minute = 60000;

document.querySelector('#pause-continue').addEventListener('click', pauseClick);

const earnedTicker = document.querySelector('#earned');
const remainingTicker = document.querySelector('#remaining');
const missedTicker = document.querySelector('#missed');
const possibleTicker = document.querySelector('#possible');

const model = loadModel();

save();
render();

function save() {
  window.localStorage.setItem('model', JSON.stringify(model));
}

function pauseClick() {
  model.isPaused = !model.isPaused;
  render();
  save();
}

function render() {
  earnedTicker.value = model.earned;
  remainingTicker.value = model.remaining;
  missedTicker.value = model.missed;
  possibleTicker.value = model.possible;
  const pauseContinueButton = document.querySelector('#pause-continue');
  if (model.isPaused) {
    pauseContinueButton.value = 'Continue';
    pauseContinueButton.classList.add('paused');
  } else {
    pauseContinueButton.value = 'Pause';
    pauseContinueButton.classList.remove('paused');
  }
}

function loadModel() {

  const now = Date.now();
  const day = new Date(now).setHours(0, 0, 0, 0);

  const dayStartTime = 8 * 3600000; // 8 AM
  const dayEndTime = 22 * 3600000; // 10 PM
  const dayStart = day + dayStartTime;
  const dayEnd = day + dayEndTime;
  const earnRate = 1 / minute;

  const loaded = JSON.parse(window.localStorage.getItem('model'));
  // If the model stored in local storage is from today, then use that
  if (loaded && loaded.dayStart === dayStart) return loaded;

  // What we have earned
  const earned = Linear.create(now, 0, earnRate);
  // Amount that could have been earned by now
  const potential = Linear.create(dayStart, 0, earnRate);
  // Amount that can still be earned from now
  const remaining = Linear.create(dayEnd, 0, -earnRate);
  // Amount we missed out on
  const missed = Linear.subtract(potential, earned);
  // Amount that's still possible
  const possible = Linear.add(earned, remaining);

  const model = {
    dayStart,
    isPaused: false,
    earned,
    remaining,
    missed,
    possible
  };

  return model;
}