import React from 'react';
import { Box, Grid } from '@mui/material';
import { getWeekdayFromDateString } from '../../utilities/DatetimeUtils';
import { weatherIcon } from '../../utilities/IconsUtils';
import WeeklyForecastItem from './WeeklyForecastItem';
import ErrorBox from '../Reusable/ErrorBox';
import DayWeatherDetails from './DayWeatherDetails';
import Layout from '../Reusable/Layout';
import { useTempUnit } from '../../context/UnitContext';
import {
  formatTemperature,
  formatWindSpeed,
} from '../../utilities/UnitUtils';

const WeeklyForecast = ({ data }) => {
  const { unit } = useTempUnit();

  const noDataProvided =
    !data ||
    Object.keys(data).length === 0 ||
    !data.list ||
    data.list.length === 0;

  let content = (
    <Box sx={{ width: '100%' }}>
      <ErrorBox type="error" />
    </Box>
  );

  if (!noDataProvided)
    content = (
      <Grid container gap={1}>
        {data.list.map((item, idx) => {
          return (
            <Grid
              item
              key={`${item.date}-${idx}`}
              xs={12}
              container
              alignItems="center"
              sx={{
                py: '.55rem',
                px: '.6rem',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                background: 'var(--panel-gradient)',
                backgroundColor: 'var(--surface-elevated)',
                transition: 'border-color .2s ease, transform .2s ease',
                '&:hover': {
                  borderColor: 'var(--text-muted)',
                },
              }}
            >
              <DayWeatherDetails
                day={getWeekdayFromDateString(item.date)}
                src={weatherIcon(`${item.icon}`)}
                description={item.description}
              />

              <Grid
                item
                xs={6}
                sm={3}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <WeeklyForecastItem
                  type="temperature"
                  value={formatTemperature(item.temp, unit)}
                />
                <WeeklyForecastItem
                  type="clouds"
                  value={item.clouds + ' %'}
                />
              </Grid>

              <Grid
                item
                xs={6}
                sm={3}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <WeeklyForecastItem
                  type="wind"
                  value={formatWindSpeed(item.wind, unit)}
                />
                <WeeklyForecastItem
                  type="humidity"
                  value={item.humidity + ' %'}
                />
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    );

  return (
    <Layout
      title="WEEKLY FORECAST"
      content={content}
      mb=".8rem"
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: { xs: '1rem 0 0', md: '1.4rem 0 0' },
      }}
    />
  );
};

export default WeeklyForecast;
