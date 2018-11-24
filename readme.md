# Money Ticker

Work in progress.

This page (index.html) counts up the amount of money you've used today.

## Description

Time is money. Not exactly, but if you assume it is then it helps you give a more concrete value to your time.

[http://coder-mike.com/money-ticker/](http://coder-mike.com/money-ticker/)

 - Used: counts up continuously unless the ticker is paused. For whatever your definition of "used" is -- e.g. time spent wisely, or time traded for money (depending on how you use the app).
 - Remaining today: the amount of additional money (time) remaining in the day until `dayEndTime`
 - Achievable today: the amount of remaining money (time) plus the amount you've used today
 - Abused: the amount of money (time) so far today since `dayStartTime` where the ticker has been paused

## Configuration

There is no configuration page. To configure, open a console and do the following:

```js
config.dayStartTime = 8 * hour; // 8 AM
config.dayEndTime = 22 * hour; // 10 PM

config.useRate = 0.5 / minute; // Half a dollar a minute
// OR
config.useRate = 30 / hour; // 30 dollars per hour

// Save the configuration and update the application
applyConfig();
```

The configuration is stored in local storage.

## Manually Adjust Used Time

You can manually "correct" the "used time" using the following JS code:

```js
model.used = Linear.changeValue(model.used, Date.now(), 100); // 100 dollars

applyConfig();
```

`used` is not a fixed value, but linear function of time. `Linear.changeValue` generates a new linear function with the same slope (rate) but intersects the given value (`100`) at the given time (`Date.now()`).
