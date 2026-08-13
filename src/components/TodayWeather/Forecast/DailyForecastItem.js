import { Box, Typography } from '@mui/material';
import React from 'react';
import { weatherIcon } from '../../../utilities/IconsUtils';
import { useTempUnit } from '../../../context/UnitContext';
import { formatTemperature } from '../../../utilities/UnitUtils';

const DailyForecastItem = ({ item }) => {
  const { unit } = useTempUnit();

  return (
    <Box
      sx={{
        background: 'var(--panel-gradient)',
        backgroundColor: 'var(--surface-elevated)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        textAlign: 'center',
        padding: '.35rem .25rem',
        width: '100%',
        transition: 'border-color .2s ease, transform .2s ease',
        '&:hover': {
          borderColor: 'var(--text-muted)',
          transform: 'translateY(-2px)',
        },
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
          alt=""
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
        {formatTemperature(item.temperature, unit)}
      </Typography>
    </Box>
  );
};

export default DailyForecastItem;
