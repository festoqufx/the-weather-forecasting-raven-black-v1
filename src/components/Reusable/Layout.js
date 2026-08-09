import { Grid, Paper } from '@mui/material';
import React from 'react';
import SectionHeader from './SectionHeader';

const Layout = ({ content, title, sx, mb, sectionSubHeader }) => {
  return (
    <Grid container sx={sx}>
      <Grid item xs={12}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            background: 'linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.015))',
            px: { xs: 1.2, sm: 1.6, md: 1.9 },
            py: { xs: 1.2, sm: 1.5 },
            overflow: 'hidden',
          }}
        >
          <SectionHeader title={title} mb={mb || '.9rem'} />
          {sectionSubHeader || null}
          <Grid container>{content}</Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Layout;
