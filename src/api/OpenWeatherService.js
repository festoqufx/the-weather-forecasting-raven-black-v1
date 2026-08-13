const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';

const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const OPENWEATHER_GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const OPENWEATHER_REVERSE_GEO_URL =
  'https://api.openweathermap.org/geo/1.0/reverse';
const WEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || '';
const RAPID_API_KEY = process.env.REACT_APP_RAPIDAPI_KEY || '';

const GEO_API_OPTIONS = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': RAPID_API_KEY,
    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
  },
};

function getErrorMessage(response, fallbackMessage) {
  if (!response) {
    return fallbackMessage;
  }

  return response.message || fallbackMessage;
}

function ensureWeatherApiKey() {
  if (!WEATHER_API_KEY) {
    throw new Error(
      'Missing OpenWeather API key. Set REACT_APP_OPENWEATHER_API_KEY before searching.'
    );
  }
}

export async function fetchWeatherData(lat, lon) {
  ensureWeatherApiKey();

  try {
    const [weatherPromise, forecastPromise] = await Promise.all([
      fetch(
        `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      ),
      fetch(
        `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      ),
    ]);

    const weatherResponse = await weatherPromise.json();
    const forecastResponse = await forecastPromise.json();

    if (!weatherPromise.ok) {
      throw new Error(
        getErrorMessage(weatherResponse, 'Unable to fetch current weather data.')
      );
    }

    if (!forecastPromise.ok) {
      throw new Error(
        getErrorMessage(forecastResponse, 'Unable to fetch forecast data.')
      );
    }

    return [weatherResponse, forecastResponse];
  } catch (error) {
    throw error;
  }
}

export async function reverseGeocode(lat, lon) {
  ensureWeatherApiKey();

  const response = await fetch(
    `${OPENWEATHER_REVERSE_GEO_URL}?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_API_KEY}`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, 'Unable to resolve your current location.')
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No city found for your current location.');
  }

  const place = data[0];
  return {
    value: `${place.lat} ${place.lon}`,
    label: `${place.name}, ${place.country}`,
  };
}

export async function fetchCities(input) {
  if (!input?.trim()) {
    return [];
  }

  try {
    if (RAPID_API_KEY) {
      const response = await fetch(
        `${GEO_API_URL}/cities?minPopulation=10000&namePrefix=${encodeURIComponent(
          input
        )}`,
        GEO_API_OPTIONS
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, 'Unable to fetch city suggestions.')
        );
      }

      return Array.isArray(data.data) ? data.data : [];
    }

    if (!WEATHER_API_KEY) {
      throw new Error(
        'City search is unavailable. Add REACT_APP_RAPIDAPI_KEY or REACT_APP_OPENWEATHER_API_KEY to continue.'
      );
    }

    const response = await fetch(
      `${OPENWEATHER_GEO_URL}?q=${encodeURIComponent(
        input
      )}&limit=10&appid=${WEATHER_API_KEY}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        getErrorMessage(data, 'Unable to fetch city suggestions from OpenWeather.')
      );
    }

    return Array.isArray(data)
      ? data.map((city) => ({
          latitude: city.lat,
          longitude: city.lon,
          name: city.name,
          countryCode: city.country,
        }))
      : [];
  } catch (error) {
    throw error;
  }
}
