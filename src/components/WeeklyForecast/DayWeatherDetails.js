import { Box, Grid, Typography } from '@mui/material';
import React from 'react';

const DayWeatherDetails = (props) => {
  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={6}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        pl: { xs: '6px', sm: '10px', md: '14px' },
        pr: { xs: 0.5, sm: 1 },
      }}
    >
      <Typography
        sx={{
          fontFamily: 'Space Grotesk',
          fontWeight: { xs: 500, sm: 600 },
          fontSize: { xs: '11px', sm: '12px', md: '14px' },
          color: 'var(--text)',
          lineHeight: 1,
          minHeight: '24px',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        {props.day}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          minHeight: '36px',
        }}
      >
        <Box
          component="img"
          sx={{
            width: { xs: '22px', sm: '26px', md: '30px' },
            height: 'auto',
            marginRight: '4px',
          }}
          alt="Weather icon"
          src={props.src}
        />
        <Typography
          variant="body2"
          component="p"
          sx={{
            fontSize: { xs: '11px', md: '13px' },
            color: 'var(--text-muted)',
            lineHeight: 1.2,
            fontFamily: 'IBM Plex Sans',
            textTransform: 'capitalize',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
          }}
        >
          {props.description}
        </Typography>
      </Box>
    </Grid>
  );
};

export default DayWeatherDetails;
