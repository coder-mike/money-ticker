class Linear {
  static create(time, value, rate) {
    console.assert(typeof time === 'number');
    console.assert(typeof value === 'number');
    console.assert(typeof rate === 'number');
    return { time, value, rate };
  }

  static coerceToLinear(value) {
    if (typeof value === 'number') return Linear.constant(value);

    console.assert(typeof value === 'object'
      && value !== null
      && typeof value.time === 'number'
      && typeof value.value === 'number'
      && typeof value.rate === 'number');

    return value;
  }

  static constant(value) {
    return {
      time: Date.now(),
      value,
      rate: 0
    }
  }

  static valueAt(linear, time) {
    linear = Linear.coerceToLinear(linear);
    return linear.value + (time - linear.time) * linear.rate;
  }

  static changeRate(linear, time, rate) {
    linear = Linear.coerceToLinear(linear);
    return {
      time,
      value: Linear.valueAt(linear, time),
      rate
    };
  }

  static changeValue(linear, time, value) {
    linear = Linear.coerceToLinear(linear);
    return {
      time,
      value,
      rate: linear.rate
    };
  }

  static changeTime(linear, time) {
    linear = Linear.coerceToLinear(linear);
    return {
      time,
      value: Linear.valueAt(linear, time),
      rate: linear.rate
    };
  }

  static add(linear1, linear2) {
    linear1 = Linear.coerceToLinear(linear1);
    linear2 = Linear.coerceToLinear(linear2);
    const time = linear1.time;
    return {
      time,
      value: Linear.valueAt(linear1, time) + Linear.valueAt(linear2, time),
      rate: linear1.rate + linear2.rate,
    };
  }

  static subtract(linear1, linear2) {
    linear1 = Linear.coerceToLinear(linear1);
    linear2 = Linear.coerceToLinear(linear2);
    const time = linear1.time;
    return {
      time,
      value: Linear.valueAt(linear1, time) - Linear.valueAt(linear2, time),
      rate: linear1.rate - linear2.rate,
    };
  }
}