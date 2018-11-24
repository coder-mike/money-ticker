'use strict';

const hour = 3600000;
const minute = 60000;
const modelStructureVersion = 6;
const configStructureVersion = 6;

const usedTicker = document.querySelector('#used');
const remainingTicker = document.querySelector('#remaining');
const missedTicker = document.querySelector('#missed');
const possibleTicker = document.querySelector('#possible');
const pauseContinueButton = document.querySelector('#pause-continue');

let config, model;
load();

pauseContinueButton.addEventListener('click', pauseClick);
save();
render();

function save() {
  saveToLocalStorage('model', model, modelStructureVersion);
  saveToLocalStorage('config', config, configStructureVersion);
}

function load() {
  config = loadConfig();
  model = loadModel(config);
}

function applyConfig() {
  updateModel(model);
  save();
  render();
}

function pauseClick() {
  model.isPaused = !model.isPaused;
  const now = Date.now();
  updateModel(model);
  render();
  save();
}

function render() {
  usedTicker.value = model.used;
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

  const loaded = loadFromLocalStorage('model', modelStructureVersion);
  // If the model stored in local storage is from today, then use that
  if (loaded && loaded.dayStart === dayStart) return loaded;

  const model = {
    dayStart,
    isPaused: false,
    // These will get updated later
    used: Linear.constant(0),
    potential: Linear.constant(0),
    remaining: Linear.constant(0),
    missed: Linear.constant(0),
    possible: Linear.constant(0),
  };

  updateModel(model);

  return model;
}

function updateModel(model) {
  const now = Date.now();
  const day = new Date(now).setHours(0, 0, 0, 0);
  const dayStart = day + config.dayStartTime;
  const dayEnd = day + config.dayEndTime;
  const useRate = config.useRate;
  const effectiveRate = model.isPaused ? 0 : config.useRate;

  // What we have used
  model.used = Linear.changeRate(model.used, now, effectiveRate);
  // Amount that could have been used by now
  model.potential = Linear.create(dayStart, 0, useRate);
  // Amount that can still be used from now
  model.remaining = Linear.create(dayEnd, 0, -useRate);
  // Amount we missed out on
  model.missed = Linear.subtract(model.potential, model.used);
  // Amount that's still possible
  model.possible = Linear.add(model.used, model.remaining);
}

function loadConfig() {
  return loadFromLocalStorage('config', configStructureVersion) || {
    dayStartTime: 8 * 3600000, // 8 AM
    dayEndTime: 22 * 3600000, // 10 PM
    useRate: 0.5 / minute // Half a dollar a minute
  };
}
