'use strict';

const hour = 3600000;
const minute = 60000;
const modelStructureVersion = 1;
const configStructureVersion = 1;

const earnedTicker = document.querySelector('#earned');
const remainingTicker = document.querySelector('#remaining');
const missedTicker = document.querySelector('#missed');
const possibleTicker = document.querySelector('#possible');
const pauseContinueButton = document.querySelector('#pause-continue');

const config = loadConfig();
const model = loadModel(config);

pauseContinueButton.addEventListener('click', pauseClick);
save();
render();

function save() {
  saveToLocalStorage('model', model, modelStructureVersion);
  saveToLocalStorage('config', config, configStructureVersion);
}

function pauseClick() {
  model.isPaused = !model.isPaused;
  const effectiveRate = model.isPaused ? 0 : config.earnRate;
  const now = Date.now();
  model.earned = Linear.changeRate(model.earned, now, effectiveRate);
  // TODO: There's some redundancy here
  model.missed = Linear.subtract(model.potential, model.earned);
  model.possible = Linear.add(model.earned, model.remaining);
  render();
  save();
}

function render() {
  earnedTicker.value = model.earned;
  remainingTicker.value = model.remaining;
  missedTicker.value = model.missed;
  possibleTicker.value = model.possible;

  if (model.isPaused) {
    pauseContinueButton.value = 'Continue';
    pauseContinueButton.classList.add('paused');
  } else {
    pauseContinueButton.value = 'Pause';
    pauseContinueButton.classList.remove('paused');
  }
}

function loadModel(config) {
  const now = Date.now();
  const day = new Date(now).setHours(0, 0, 0, 0);

  const dayStart = day + config.dayStartTime;
  const dayEnd = day + config.dayEndTime;
  const earnRate = config.earnRate;

  const loaded = loadFromLocalStorage('model', modelStructureVersion);
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
    possible,
    potential
  };

  return model;
}

function loadConfig() {
  return loadFromLocalStorage('config', configStructureVersion) || {
    dayStartTime: 8 * 3600000, // 8 AM
    dayEndTime: 22 * 3600000, // 10 PM
    earnRate: 0.5 / minute // Half a dollar a minute
  };
}
