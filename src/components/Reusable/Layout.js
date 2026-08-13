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
            background: 'var(--panel-gradient)',
            backgroundColor: 'var(--surface)',
            px: { xs: 1.2, sm: 1.6, md: 1.9 },
            py: { xs: 1.2, sm: 1.5 },
            overflow: 'hidden',
            transition: 'border-color .2s ease, background-color .2s ease',
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
