import React from 'react';
import { Grid, Typography } from '@mui/material';
import DailyForecastItem from './DailyForecastItem';
import ErrorBox from '../../Reusable/ErrorBox';
import Layout from '../../Reusable/Layout';

const DailyForecast = ({ data, forecastList }) => {
  const noDataProvided =
    !data ||
    !forecastList ||
    Object.keys(data).length === 0 ||
    data.cod === '404' ||
    forecastList.cod === '404';

  let subHeader;

  if (!noDataProvided && forecastList.length > 0)
    subHeader = (
      <Typography
        variant="body2"
        component="p"
        sx={{
          fontSize: { xs: '11px', sm: '12px' },
          textAlign: 'left',
          lineHeight: 1,
          color: 'var(--text-muted)',
          fontFamily: 'IBM Plex Sans',
          marginBottom: '1rem',
        }}
      >
        {forecastList.length === 1
          ? '1 available forecast'
          : `${forecastList.length} available forecasts`}
      </Typography>
    );

  let content;

  if (noDataProvided) content = <ErrorBox flex="1" type="error" />;

  if (!noDataProvided && forecastList.length > 0)
    content = (
      <Grid
        container
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          width: '100%',
        }}
        spacing={1}
      >
        {forecastList.map((item, idx) => (
          <Grid
            key={idx}
            item
            xs={6}
            sm={4}
            md={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{
              marginBottom: { xs: '.4rem', sm: '0' },
            }}
          >
            <DailyForecastItem item={item} />
          </Grid>
        ))}
      </Grid>
    );

  if (!noDataProvided && forecastList && forecastList.length === 0)
    subHeader = (
      <ErrorBox
        flex="1"
        type="info"
        margin="2rem auto"
        errorMessage="No available forecasts for tonight."
      />
    );

  return (
    <Layout
      title="TODAY'S FORECAST"
      content={content}
      sectionSubHeader={subHeader}
      sx={{ marginTop: '1rem' }}
      mb="0.3rem"
    />
  );
};

export default DailyForecast;
