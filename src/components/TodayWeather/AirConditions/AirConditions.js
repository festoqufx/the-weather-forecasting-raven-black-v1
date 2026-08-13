import React from 'react';
import ErrorBox from '../../Reusable/ErrorBox';
import AirConditionsItem from './AirConditionsItem';
import Layout from '../../Reusable/Layout';
import { useTempUnit } from '../../../context/UnitContext';
import {
  formatTemperature,
  formatWindSpeed,
} from '../../../utilities/UnitUtils';

const TodayWeatherAirConditions = ({ data }) => {
  const { unit } = useTempUnit();
  const noDataProvided =
    !data || Object.keys(data).length === 0 || data.cod === '404';

  let content = <ErrorBox flex="1" type="error" />;

  if (!noDataProvided)
    content = (
      <>
        <AirConditionsItem
          title="Real Feel"
          value={formatTemperature(data.main.feels_like, unit)}
          type="temperature"
        />
        <AirConditionsItem
          title="Wind"
          value={formatWindSpeed(data.wind.speed, unit)}
          type="wind"
        />
        <AirConditionsItem
          title="Clouds"
          value={`${Math.round(data.clouds.all)} %`}
          type="clouds"
        />
        <AirConditionsItem
          title="Humidity"
          value={`${Math.round(data.main.humidity)} %`}
          type="humidity"
        />
      </>
    );
  return (
    <Layout
      title="AIR CONDITIONS"
      content={content}
      mb="1rem"
      sx={{ marginTop: '1rem' }}
    />
  );
};

export default TodayWeatherAirConditions;
