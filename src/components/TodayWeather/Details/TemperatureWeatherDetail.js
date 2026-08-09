import { Box, Typography } from '@mui/material';
import React from 'react';

const TemperatureWeatherDetail = (props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        height: '100%',
      }}
    >
      <Typography
        variant="h6"
        component="h3"
        sx={{
          fontWeight: 600,
          fontSize: { xs: '14px', sm: '15px', md: '18px' },
          color: 'var(--text)',
          textTransform: 'uppercase',
          lineHeight: 1,
          marginBottom: '7px',
          fontFamily: 'Space Grotesk',
        }}
      >
        {Math.round(props.temperature)} °C
      </Typography>
      <Typography
        variant="body2"
        component="p"
        sx={{
          fontSize: { xs: '11px', sm: '12px', md: '13px' },
          color: 'var(--text-muted)',
          lineHeight: 1,
          letterSpacing: '.03em',
          fontFamily: 'IBM Plex Sans',
          textTransform: 'capitalize',
        }}
      >
        {props.description}
      </Typography>
    </Box>
  );
};

export default TemperatureWeatherDetail;
