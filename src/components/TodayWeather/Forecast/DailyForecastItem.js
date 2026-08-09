import { Box, Typography } from '@mui/material';
import React from 'react';
import { weatherIcon } from '../../../utilities/IconsUtils';

const DailyForecastItem = ({ item }) => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.015))',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        textAlign: 'center',
        padding: '.35rem .25rem',
        width: '100%',
      }}
    >
      <Typography
        variant="body2"
        component="p"
        sx={{
          fontWeight: 500,
          fontSize: { xs: '11px', sm: '12px' },
          color: 'var(--text-muted)',
          lineHeight: 1,
          padding: '4px',
          fontFamily: 'IBM Plex Sans',
        }}
      >
        {item.time}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'var(--text)',
          padding: '4px',
        }}
      >
        <Box
          component="img"
          sx={{
            width: { xs: '36px', sm: '42px' },
            height: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            margin: '0 auto',
          }}
          alt="Forecast weather icon"
          src={weatherIcon(`${item.icon}.png`)}
        />
      </Box>
      <Typography
        variant="body1"
        component="p"
        sx={{
          fontWeight: 600,
          fontSize: { xs: '12px', sm: '14px' },
          color: 'var(--text)',
          textTransform: 'uppercase',
          lineHeight: 1,
          marginBottom: { xs: '8px', md: '0' },
          fontFamily: 'Space Grotesk',
        }}
      >
        {item.temperature}
      </Typography>
    </Box>
  );
};

export default DailyForecastItem;
