import * as React from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

export default function ErrorBox(props) {
  const isInfo = props.type === 'info';

  return (
    <Box
      role={isInfo ? 'status' : 'alert'}
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
          ? '1px solid var(--warning)'
          : '1px solid var(--danger)',
        borderRadius: '10px',
        background: isInfo ? 'var(--warning-soft)' : 'var(--danger-soft)',
      }}
    >
      {isInfo ? (
        <InfoOutlinedIcon sx={{ fontSize: '24px' }} />
      ) : (
        <ErrorOutlineIcon sx={{ fontSize: '24px' }} />
      )}

      <Typography
        variant="body1"
        component="p"
        sx={{
          fontSize: isInfo
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
