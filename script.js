const oneHour = 3600000;

const oneDollar = 100;
const oneCent = oneDollar / 100;
const decimals = 1;
const increment = oneDollar / Math.pow(10, decimals);

const animatedTransition = true;

let startTime = loadValue('startTime', Date.now());
let startValue = loadValue('startValue', 0);
let rate = loadValue('rate', 60 * oneDollar / oneHour);
let isWorking = loadValue('isWorking', true);
let frame = 0;


document.querySelector('#pause').addEventListener('click', pauseClick);

const ticker = Ticker();
save();

function Ticker() {
  let timeout;
  update();

  function update() {
    timeout && clearTimeout(timeout);
    timeout = undefined;

    document.querySelector('#pause').value = isWorking ? 'Pause' : 'Continue';

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
      const sleepAmount = timeOfNext - now;

      if (animatedTransition && sleepAmount > 15) {
        currentEl.style.transition = 'none';
        currentEl.style.color = '#444';
        currentEl.style.opacity = 1;
        nextEl.style.transition = 'none';
        nextEl.style.color = '#444';
        nextEl.style.opacity = interpolationFactor;
        // Force current opacity
        window.getComputedStyle(currentEl).opacity;
        window.getComputedStyle(nextEl).opacity;
        nextEl.style.transition = `all ${sleepAmount}ms linear`;
        nextEl.style.opacity = 1; // Fade in
        nextEl.style.color = '#444';
      } else {
        currentEl.style.opacity = 1;
        nextEl.style.opacity = 0;
      }

      timeout = setTimeout(update, sleepAmount);
    } else {
      currentEl.style.transition = 'none';
      currentEl.style.opacity = 1;
      currentEl.style.color = '#844';
      nextEl.style.transition = 'none';
      nextEl.style.opacity = interpolationFactor;
      nextEl.style.color = '#844';
    }
  }

  function setValue(newValue) {
    startValue = newValue;
    startTime = Date.now();
    save();
    ticker.update();
  }

  return {
    update, setValue
  }
}

function resetStart() {
  const now = Date.now();
  startValue = getCurrentValue(now);
  startTime = now;
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
  save();
  ticker.update();
}