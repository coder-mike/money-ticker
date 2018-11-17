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
    container.appendChild(this.counter1);

    this.counter2 = document.createElement('div');
    this.counter2.style.position = 'absolute';
    this.counter2.style.top = '0';
    this.counter2.style.width = '100%';
    this.counter2.style.height = '100%';
    this.counter2.style.backgroundColor = 'white';
    this.counter2.style.opacity = '0';
    container.appendChild(this.counter2);

    this.timeout = undefined;
    this._ticking = false;
    this._value = {
      startTime: 0,
      startValue: 0,
      rate: 0,
      ticking: false
    };
    this.frame = 0;
    this.updateFrame();
  }

  get value() { return {...this._value }; };
  set value(value) {
    this._value = { ...value };
    this.updateFrame();
  }

  updateFrame() {
    const { startTime, rate, startValue, ticking } = this._value;

    this.timeout && clearTimeout(this.timeout);
    this.timeout = undefined;

    const now = Date.now();
    const currentValue = this.projected(now);
    const increasing = rate >= 0;
    const prevValue =
      increasing
        ? (Math.floor(currentValue / increment)) * increment
        : (Math.ceil(currentValue / increment)) * increment;

    const nextValue = (Math.round(prevValue / increment) + (increasing ? 1 : -1)) * increment;
    let interpolationFactor = (currentValue - prevValue) / (nextValue - prevValue);
    interpolationFactor = Math.max(Math.min(interpolationFactor, 1), 0);
    const renderValue = value => `$ ${value.toFixed(decimals)}`;
    console.log('prevValue', prevValue, 'value', currentValue, 'nextValue', nextValue, 'interp', interpolationFactor);
    const currentEl = this.frame === 0 ? this.counter1 : this.counter2;
    const nextEl = this.frame === 0 ? this.counter2 : this.counter1;

    currentEl.innerHTML = renderValue(prevValue);
    nextEl.innerHTML = renderValue(nextValue);

    if (ticking) {
      const timeOfNext = startTime + (nextValue - startValue) / rate;
      const sleepAmount = timeOfNext - now;

      if (animatedTransition && sleepAmount > 15) {
        this.counter2.style.transition = 'none';
        this.counter2.style.opacity = this.frame === 0 ? interpolationFactor : 1 - interpolationFactor;
        // Force current opacity
        window.getComputedStyle(this.counter2).opacity;

        this.counter2.style.transition = `all ${sleepAmount}ms linear`;
        this.counter2.style.opacity = this.frame === 0 ? 1 : 0;
      } else {
        this.counter2.style.transition = 'none';
        this.counter2.style.opacity = this.frame === 0 ? 0 : 1;
      }

      // console.log('next tick in', sleepAmount);
      this.timeout = setTimeout(() => this.updateFrame(), sleepAmount);
    } else {
      this.counter2.style.transition = 'none';
      this.counter2.style.opacity = this.frame === 0 ? interpolationFactor : 1 - interpolationFactor;
    }
    this.frame = (this.frame + 1) % 2;
  }

  projected(now) {
    const { startValue, startTime, rate, ticking } = this._value;
    return startValue + (now - startTime) * rate * (ticking ? 1 : 0);
  }

  resetStart() {
    const now = Date.now();
    this._value.startValue = this.projected(now);
    this._value.startTime = now;
  }

  setValue(newValue) {
    this.resetStart();
    this._value.startValue = newValue;
    earnedTicker.updateFrame();
  }
}

