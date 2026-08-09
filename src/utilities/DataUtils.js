export function groupBy(key) {
  return function group(array) {
    return array.reduce((acc, obj) => {
      const property = obj[key];
      const { date, ...rest } = obj;
      acc[property] = acc[property] || [];
      acc[property].push(rest);
      return acc;
    }, {});
  };
}

export function getAverage(array, isRound = true) {
  if (!Array.isArray(array) || array.length === 0) {
    return isRound ? 0 : '0.00';
  }

  let average = 0;
  if (isRound) {
    average = Math.round(array.reduce((a, b) => a + b, 0) / array.length);
    if (average === 0) {
      average = 0;
    }
  } else average = (array.reduce((a, b) => a + b, 0) / array.length).toFixed(2);

  return average;
}

export function getMostFrequentWeather(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return '';
  }

  const hashmap = arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(hashmap).reduce((a, b) =>
    hashmap[a] > hashmap[b] ? a : b
  );
}

export const descriptionToIconName = (desc, descriptions_list) => {
  const iconName = descriptions_list.find((item) => item.description === desc);
  return iconName?.icon || 'unknown';
};

export const getWeekForecastWeather = (response, descriptions_list) => {
  const forecastData = [];
  const descriptionsData = [];

  if (!response || Object.keys(response).length === 0 || response.cod === '404')
    return [];
  else {
    response?.list.slice().forEach((item) => {
      descriptionsData.push({
        description: item.weather[0].description,
        date: item.dt_txt.substring(0, 10),
      });
      forecastData.push({
        date: item.dt_txt.substring(0, 10),
        temp: item.main.temp,
        humidity: item.main.humidity,
        wind: item.wind.speed,
        clouds: item.clouds.all,
      });
    });
  }

  const groupByDate = groupBy('date');
  const groupedForecastData = groupByDate(forecastData);
  const groupedForecastDescriptions = groupByDate(descriptionsData);

  const descriptionKeys = Object.keys(groupedForecastDescriptions);

  const dayDescList = [];

  descriptionKeys.forEach((key) => {
    const singleDayDescriptions = groupedForecastDescriptions[key].map(
      (item) => item.description
    );
    const mostFrequentDescription = getMostFrequentWeather(singleDayDescriptions);
    dayDescList.push(mostFrequentDescription);
  });

  const forecastKeys = Object.keys(groupedForecastData);
  const dayAvgsList = [];

  forecastKeys.forEach((key, idx) => {
    const dayTempsList = [];
    const dayHumidityList = [];
    const dayWindList = [];
    const dayCloudsList = [];

    for (let i = 0; i < groupedForecastData[key].length; i++) {
      dayTempsList.push(groupedForecastData[key][i].temp);
      dayHumidityList.push(groupedForecastData[key][i].humidity);
      dayWindList.push(groupedForecastData[key][i].wind);
      dayCloudsList.push(groupedForecastData[key][i].clouds);
    }

    dayAvgsList.push({
      date: key,
      temp: getAverage(dayTempsList),
      humidity: getAverage(dayHumidityList),
      wind: getAverage(dayWindList, false),
      clouds: getAverage(dayCloudsList),
      description: dayDescList[idx],
      icon: descriptionToIconName(dayDescList[idx], descriptions_list),
    });
  });

  return dayAvgsList;
};

export const getTodayForecastWeather = (
  response,
  current_date,
  current_datetime
) => {
  const allTodayForecasts = [];

  if (!response || Object.keys(response).length === 0 || response.cod === '404')
    return [];
  else {
    response?.list.slice().forEach((item) => {
      if (item.dt_txt.startsWith(current_date.substring(0, 10))) {
        if (item.dt > current_datetime) {
          allTodayForecasts.push({
            time: item.dt_txt.split(' ')[1].substring(0, 5),
            icon: item.weather[0].icon,
            temperature: Math.round(item.main.temp) + ' °C',
          });
        }
      }
    });
  }

  if (allTodayForecasts.length < 7) {
    return [...allTodayForecasts];
  }

  return allTodayForecasts.slice(-6);
};
