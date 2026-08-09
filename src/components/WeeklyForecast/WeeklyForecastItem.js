import React from 'react';
import { Box, SvgIcon, Typography } from '@mui/material';
import AirIcon from '@mui/icons-material/Air';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { ReactComponent as HumidityIcon } from '../../assets/humidity.svg';

const WeeklyForecastItem = ({ value, type }) => {
  let iconContent;

  if (type === 'temperature')
    iconContent = (
      <ThermostatIcon
        sx={{ fontSize: { xs: '15px', sm: '16px', md: '18px' } }}
      />
    );
  else if (type === 'wind')
    iconContent = (
      <AirIcon sx={{ fontSize: { xs: '15px', sm: '16px', md: '18px' } }} />
    );
  else if (type === 'clouds')
    iconContent = (
      <FilterDramaIcon
        sx={{ fontSize: { xs: '15px', sm: '16px', md: '18px' } }}
      />
    );
  else if (type === 'humidity')
    iconContent = (
      <SvgIcon
        component={HumidityIcon}
        inheritViewBox
        sx={{
          fontSize: { xs: '15px', sm: '16px', md: '18px' },
        }}
      />
    );
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '30px',
        color: 'var(--text-muted)',
        gap: { xs: '3px', sm: '5px', md: '6px' },
        width: '100%',
      }}
    >
      {iconContent}
      <Typography
        variant="body2"
        component="p"
        sx={{
          fontSize: { xs: '11px', sm: '12px', md: '13px' },
          fontWeight: { xs: 500, sm: 600 },
          color: 'var(--text)',
          fontFamily: 'IBM Plex Sans',
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

export default WeeklyForecastItem;
