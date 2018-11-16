const oneHour = 3600000;
const oneDollar = 100;
const oneCent = oneDollar / 100;

let startTime = loadValue('startTime', Date.now());
let startValue = loadValue('startValue', 0);
let rate = loadValue('rate', 60 * oneDollar / oneHour);
let isWorking = loadValue('isWorking', true);

let timeout;

document.querySelector('#pause').addEventListener('click', pauseClick);

save();
update();

function update() {
  timeout && clearTimeout(timeout);
  timeout = undefined;

  const now = Date.now();
  const currentValue = getCurrentValue(now);
  console.log(currentValue);
  document.querySelector('#counter').innerHTML = `$ ${(currentValue / oneDollar).toFixed(2)}`;
  if (isWorking) {
    const nextValue = (Math.round(currentValue / oneCent) + 1) * oneCent;
    const timeOfNext = startTime + (nextValue - startValue) / rate;
    const timeUntilNext = timeOfNext - now;
    const sleepAmount = Math.max(15, timeUntilNext);
    timeout = setTimeout(update, sleepAmount);
  }
}

function resetStart() {
  const now = Date.now();
  startValue = getCurrentValue(now);
  startTime = now;
}

function setValue(newValue) {
  startValue = newValue;
  startTime = Date.now();
  save();
  update();
}

function getCurrentValue(now) {
  return startValue + (now - startTime) * rate * (isWorking ? 1 : 0);
}

function save() {
  saveValue('startTime', startTime);
  saveValue('startValue', startValue);
  saveValue('rate', rate);
  saveValue('isWorking', isWorking);
}

function loadValue(key, defaultValue) {
  try {
    const encoded = window.localStorage.getItem(key);
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
  resetStart();
  isWorking = !isWorking;
  document.querySelector('#pause').value = isWorking ? 'Pause' : 'Continue';
  save();
  update();
}