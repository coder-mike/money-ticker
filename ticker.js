'use strict';

const animatedTransition = true;
const decimals = 1;
const increment = 1 / Math.pow(10, decimals);

class Ticker {
  constructor(container) {
    this.container = container;
    this.container.innerHTML = '';
    this.container.style.position = 'relative';

    this.counter1 = document.createElement('div');
    this.counter1.style.position = 'absolute';
    container.appendChild(this.counter1);

    this.counter2 = document.createElement('div');
    this.counter2.style.position = 'absolute';
    this.counter2.style.backgroundColor = 'white';
    this.counter2.style.opacity = '0';
    container.appendChild(this.counter2);

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
    const currentEl = this.frame === 0 ? this.counter1 : this.counter2;
    const nextEl = this.frame === 0 ? this.counter2 : this.counter1;
    this.container.appendChild(nextEl);

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

