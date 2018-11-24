'use strict';

const animatedTransition = true;
const decimals = 1;
const increment = 1 / Math.pow(10, decimals);

class MoneyTicker extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});

    this.container = document.createElement('div');
    this.innerHTML = '';
    shadow.appendChild(this.container);

    this.container.innerHTML = '';
    this.container.style.position = 'relative';

    this.counter1 = document.createElement('div');
    this.container.appendChild(this.counter1);

    this.counter2 = document.createElement('div');
    this.counter2.style.position = 'absolute';
    this.counter2.style.top = '0';
    this.counter2.style.width = '100%';
    this.counter2.style.height = '100%';
    this.counter2.style.backgroundColor = 'white';
    this.counter2.style.opacity = '0';
    this.container.appendChild(this.counter2);

    this.timeout = undefined;
    this._ticking = false;
    this._value = Linear.constant(0);
    this.frame = 0;
    this.updateFrame();
  }

  get value() {
    return Linear.changeTime(this._value);
  };

  set value(value) {
    this._value = Linear.coerceToLinear(value);
    this.updateFrame();
  }

  updateFrame() {
    const { time, rate, value } = this._value;
    const ticking = rate !== 0;

    this.timeout && clearTimeout(this.timeout);
    this.timeout = undefined;

    const now = Date.now();
    const currentValue = Linear.valueAt(this._value, now);
    const increasing = rate >= 0;
    const prevValue =
      increasing
        ? (Math.floor(currentValue / increment)) * increment
        : (Math.ceil(currentValue / increment)) * increment;

    const nextValue = (Math.round(prevValue / increment) + (increasing ? 1 : -1)) * increment;
    let interpolationFactor = (currentValue - prevValue) / (nextValue - prevValue);
    interpolationFactor = Math.max(Math.min(interpolationFactor, 1), 0);
    const renderValue = value => `$ ${value.toFixed(decimals)}`;
    // console.log('prevValue', prevValue, 'value', currentValue, 'nextValue', nextValue, 'interp', interpolationFactor);
    const currentEl = this.frame === 0 ? this.counter1 : this.counter2;
    const nextEl = this.frame === 0 ? this.counter2 : this.counter1;

    currentEl.innerHTML = renderValue(prevValue);
    nextEl.innerHTML = renderValue(nextValue);

    if (ticking) {
      const timeOfNext = time + (nextValue - value) / rate;
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
      this.counter2.style.opacity = this.frame === 0 ? 0 : 1;
    }
    this.frame = (this.frame + 1) % 2;
  }
}

customElements.define('money-ticker', MoneyTicker);
