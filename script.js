const oneHour = 3600000;

const oneDollar = 100;
const oneCent = oneDollar / 100;
const decimals = 0;
const increment = oneDollar / Math.pow(10, decimals);

const animatedTransition = true;

let startTime = loadValue('startTime', Date.now());
let startValue = loadValue('startValue', 0);
let rate = loadValue('rate', 60 * oneDollar / oneHour);
let isWorking = loadValue('isWorking', true);
let frame = 0;

let timeout;

document.querySelector('#pause').addEventListener('click', pauseClick);

save();
update();

function update() {
  timeout && clearTimeout(timeout);
  timeout = undefined;

  const now = Date.now();
  const currentValue = getCurrentValue(now);
  const prevValue = (Math.floor(currentValue / increment)) * increment;
  const nextValue = (Math.round(prevValue / increment) + 1) * increment;
  let interpolationFactor = (currentValue - prevValue) / (nextValue - prevValue);
  interpolationFactor = Math.max(Math.min(interpolationFactor, 1), 0);
  const renderValue = value => `$ ${(value / oneDollar).toFixed(decimals)}`;
  console.log('prevValue', prevValue, 'value', currentValue, 'nextValue', nextValue, 'interp', interpolationFactor);
  const currentEl = frame === 0 ? document.querySelector('#counter1') : document.querySelector('#counter2');
  const nextEl = frame === 0 ? document.querySelector('#counter2') : document.querySelector('#counter1');
  // The next element must be on top
  document.querySelector('.counter-wrapper').appendChild(nextEl);

  frame = (frame + 1) % 2;

  currentEl.innerHTML = renderValue(prevValue);
  nextEl.innerHTML = renderValue(nextValue);

  if (isWorking) {
    const timeOfNext = startTime + (nextValue - startValue) / rate;
    const timeUntilNext = timeOfNext - now;
    const sleepAmount = Math.max(15, timeUntilNext);

    if (animatedTransition) {
      currentEl.style.transition = 'none';
      nextEl.style.transition = 'none';
      currentEl.style.opacity = 1;
      nextEl.style.opacity = interpolationFactor;
      // Force current opacity
      window.getComputedStyle(currentEl).opacity;
      window.getComputedStyle(nextEl).opacity;
      nextEl.style.transition = `opacity ${sleepAmount}ms linear`;
      nextEl.style.opacity = 1; // Fade in
    } else {
      currentEl.style.opacity = 1;
      nextEl.style.opacity = 0;
    }

    timeout = setTimeout(update, sleepAmount);
  } else {
    currentEl.style.transition = 'none';
    nextEl.style.transition = 'none';
    currentEl.style.opacity = 1;
    nextEl.style.opacity = 0;
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