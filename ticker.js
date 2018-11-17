'use strict';

const animatedTransition = true;
const decimals = 1;
const increment = 1 / Math.pow(10, decimals);

class Ticker {
  constructor() {
    this.timeout = undefined;
    this._ticking = false;
    this._value = {
      startTime: 0,
      startValue: 0,
      rate: 0
    };
    this.frame = 0;
    this.update();
  }

  get value() { return {...this._value }; };
  set value(value) {
    this._value = { ...value };
    this.update();
  }

  get ticking() { return this._ticking; }
  set ticking(value) {
    this.resetStart();
    this._ticking = value;
    this.update();
  }

  update() {
    const { startTime, rate, startValue } = this._value;

    this.timeout && clearTimeout(this.timeout);
    this.timeout = undefined;

    const now = Date.now();
    const currentValue = this.getCurrentValue(now);
    const prevValue = (Math.floor(currentValue / increment)) * increment;
    const nextValue = (Math.round(prevValue / increment) + 1) * increment;
    let interpolationFactor = (currentValue - prevValue) / (nextValue - prevValue);
    interpolationFactor = Math.max(Math.min(interpolationFactor, 1), 0);
    const renderValue = value => `$ ${value.toFixed(decimals)}`;
    // console.log('prevValue', prevValue, 'value', currentValue, 'nextValue', nextValue, 'interp', interpolationFactor);
    const currentEl = this.frame === 0 ? document.querySelector('#counter1') : document.querySelector('#counter2');
    const nextEl = this.frame === 0 ? document.querySelector('#counter2') : document.querySelector('#counter1');
    // The next element must be on top
    document.querySelector('.counter-wrapper').appendChild(nextEl);

    this.frame = (this.frame + 1) % 2;

    currentEl.innerHTML = renderValue(prevValue);
    nextEl.innerHTML = renderValue(nextValue);

    if (this._ticking) {
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

      // console.log('next tick in', sleepAmount);
      this.timeout = setTimeout(() => this.update(), sleepAmount);
    } else {
      currentEl.style.transition = 'none';
      currentEl.style.opacity = 1;
      currentEl.style.color = '#844';
      nextEl.style.transition = 'none';
      nextEl.style.opacity = interpolationFactor;
      nextEl.style.color = '#844';
    }
  }

  getCurrentValue(now) {
    const { startValue, startTime, rate } = this._value;
    return startValue + (now - startTime) * rate * (this._ticking ? 1 : 0);
  }

  resetStart() {
    const now = Date.now();
    this._value.startValue = this.getCurrentValue(now);
    this._value.startTime = now;
  }

  setValue(newValue) {
    this.resetStart();
    this._value.startValue = newValue;
    ticker.update();
  }
}

