function importAll(r) {
  const images = {};
  r.keys().forEach((item) => {
    images[item.replace('./', '')] = r(item);
  });
  return images;
}

const allWeatherIcons = importAll(
  require.context('../assets/icons', false, /\.(png)$/)
);

export function weatherIcon(imageName) {
  return allWeatherIcons[imageName] || allWeatherIcons['unknown.png'];
}
