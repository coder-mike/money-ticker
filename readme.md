# Money Ticker

Work in progress.

This page (index.html) counts up the amount of money you've earned today.

## Description

Time is money. Not exactly, but if you assume it is then it helps you give a more concrete value to your time.

[http://coder-mike.com/money-ticker/](http://coder-mike.com/money-ticker/)

 - Earned: counts up continuously unless the ticker is paused
 - Remaining today: the amount of additional money (time) remaining in the day until `dayEndTime`
 - Achievable today: the amount of remaining money (time) plus the amount you've earned today
 - Missed today: the amount of money (time) so far today since `dayStartTime` where the ticker has been paused

## Configuration

There is no configuration page. To configure, open a console and do the following:

```js
config.dayStartTime = 8 * hour; // 8 AM
config.dayEndTime = 22 * hour; // 10 PM

config.earnRate = 0.5 / minute; // Half a dollar a minute
// OR
config.earnRate = 30 / hour; // 30 dollars per hour

// Save the configuration and update the application
applyConfig();
```

The configuration is stored in local storage.