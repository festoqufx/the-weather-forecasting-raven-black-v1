import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getUTCDatetime } from '../../utilities/DatetimeUtils';

const UTCDatetime = () => {
  const [utcFullDate, setUtcFullDate] = useState(getUTCDatetime());

  useEffect(() => {
    const timer = setInterval(() => {
      setUtcFullDate(getUTCDatetime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const utcTimeValue = (
    <Typography
      variant="body2"
      component="p"
      sx={{
        fontWeight: 500,
        fontSize: { xs: '11px', sm: '12px' },
        color: 'var(--text-muted)',
        lineHeight: 1,
        paddingRight: '2px',
        fontFamily: 'IBM Plex Sans',
      }}
    >
      {utcFullDate} GMT
    </Typography>
  );
  return utcTimeValue;
};

export default UTCDatetime;
