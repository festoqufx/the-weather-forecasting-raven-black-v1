import * as React from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

export default function ErrorBox(props) {
  const isInfo = props.type === 'info';

  return (
    <Box
      display={props.display || 'flex'}
      justifyContent={props.justifyContent || 'center'}
      alignItems={props.alignItems || 'center'}
      margin={props.margin || '1rem auto'}
      gap={props.gap || '8px'}
      flex={props.flex || 'auto'}
      width={props.width || 'auto'}
      sx={{
        padding: '.9rem 1rem',
        flexDirection: { xs: 'column', sm: 'row' },
        color: isInfo ? 'var(--warning)' : 'var(--danger)',
        border: isInfo
          ? '1px solid rgba(255,226,122,.55)'
          : '1px solid rgba(255,111,111,.55)',
        borderRadius: '10px',
        background:
          isInfo
            ? 'linear-gradient(180deg, rgba(255,226,122,.12), rgba(255,226,122,.05))'
            : 'linear-gradient(180deg, rgba(255,111,111,.2), rgba(255,111,111,.08))',
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: '24px' }} />

      <Typography
        variant="body1"
        component="p"
        sx={{
          fontSize:
            isInfo
              ? { xs: '12px', sm: '14px' }
              : { xs: '14px', sm: '16px' },
          fontFamily: 'IBM Plex Sans',
          textAlign: 'center',
        }}
      >
        {props.errorMessage || 'Internal error'}
      </Typography>
    </Box>
  );
}
