import { Typography } from '@mui/material';
import React from 'react';

const SectionHeader = ({ title, mb }) => {
  return (
    <Typography
      variant="h6"
      component="h2"
      sx={{
        fontSize: { xs: '12px', sm: '13px', md: '14px' },
        color: 'var(--text-muted)',
        fontWeight: 600,
        lineHeight: 1.2,
        textAlign: 'left',
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        fontFamily: 'Space Grotesk',
        marginBottom: mb ? mb : '1rem',
      }}
    >
      {title}
    </Typography>
  );
};

export default SectionHeader;
