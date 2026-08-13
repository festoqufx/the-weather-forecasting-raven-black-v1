export function celsiusToFahrenheit(celsius) {
  return (Number(celsius) * 9) / 5 + 32;
}

export function formatTemperature(celsius, unit = 'C', options = {}) {
  const { includeUnit = true, rounded = true } = options;
  const value =
    unit === 'F' ? celsiusToFahrenheit(celsius) : Number(celsius);
  const display = rounded ? Math.round(value) : value;
  return includeUnit ? `${display} °${unit}` : `${display}`;
}

export function formatWindSpeed(metersPerSecond, unit = 'C') {
  const speed = Number(metersPerSecond);

  if (unit === 'F') {
    const mph = speed * 2.23694;
    return `${mph.toFixed(1)} mph`;
  }

  return `${speed.toFixed(1)} m/s`;
}
