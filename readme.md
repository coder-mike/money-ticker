# Money Ticker

Work in progress.

This page (index.html) counts up the amount of money you've earned today.

## Configuration

There is no configuration page. To configure, open a console and do the following:

```js
config.dayStartTime = 8 * hour; // 8 AM
config.dayEndTime = 22 * hour; // 10 PM
config.earnRate = 0.5 / minute; // Half a dollar a minute
config.earnRate = 30 / hour; // 30 dollars per hour

applyConfig();
```

The configuration is stored in local storage.