function loadFromLocalStorage(key, expectedStructureVersion) {
  try {
    const value = window.localStorage.getItem(key);
    if (value === null || value === undefined) return undefined;
    const { structureVersion, value: parsedValue } = JSON.parse(value);
    if (structureVersion !== expectedStructureVersion) return undefined;
    return parsedValue;
  } catch {
    return undefined;
  }
}

function saveToLocalStorage(key, value, structureVersion) {
  window.localStorage.setItem(key, JSON.stringify({
    value,
    structureVersion: structureVersion
  }));
}