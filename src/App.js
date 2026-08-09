import React, { useCallback, useRef, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  IconButton,
  Link,
  SvgIcon,
  Typography,
} from '@mui/material';
import Search from './components/Search/Search';
import WeeklyForecast from './components/WeeklyForecast/WeeklyForecast';
import TodayWeather from './components/TodayWeather/TodayWeather';
import { fetchWeatherData } from './api/OpenWeatherService';
import { transformDateFormat } from './utilities/DatetimeUtils';
import UTCDatetime from './components/Reusable/UTCDatetime';
import LoadingBox from './components/Reusable/LoadingBox';
import { ReactComponent as SplashIcon } from './assets/splash-icon.svg';
import Logo from './assets/logo.png';
import ErrorBox from './components/Reusable/ErrorBox';
import { ALL_DESCRIPTIONS } from './utilities/DateConstants';
import GitHubIcon from '@mui/icons-material/GitHub';
import {
  getTodayForecastWeather,
  getWeekForecastWeather,
} from './utilities/DataUtils';

function App() {
  const [todayWeather, setTodayWeather] = useState(null);
  const [todayForecast, setTodayForecast] = useState([]);
  const [weekForecast, setWeekForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [isFromCache, setIsFromCache] = useState(false);
  const cacheRef = useRef(new Map());

  const searchChangeHandler = useCallback(async (enteredData) => {
    if (!enteredData?.value) {
      return;
    }

    const [latitude, longitude] = enteredData.value.split(' ');
    const cacheKey = `${latitude},${longitude}`;

    setError('');
    setIsLoading(true);
    setIsFromCache(false);

    const currentDate = transformDateFormat();
    const date = new Date();
    const dt_now = Math.floor(date.getTime() / 1000);

    const cachedResult = cacheRef.current.get(cacheKey);

    if (cachedResult) {
      setTodayForecast(cachedResult.todayForecast);
      setTodayWeather(cachedResult.todayWeather);
      setWeekForecast(cachedResult.weekForecast);
      setLastUpdated(cachedResult.lastUpdated);
      setIsFromCache(true);
      setIsLoading(false);
      return;
    }

    try {
      const [todayWeatherResponse, weekForecastResponse] =
        await fetchWeatherData(latitude, longitude);
      const allTodayForecastsList = getTodayForecastWeather(
        weekForecastResponse,
        currentDate,
        dt_now
      );

      const allWeekForecastsList = getWeekForecastWeather(
        weekForecastResponse,
        ALL_DESCRIPTIONS
      );

      const currentUpdatedAt = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

      const todayWeatherData = {
        city: enteredData.label,
        ...todayWeatherResponse,
      };

      const weekForecastData = {
        city: enteredData.label,
        list: allWeekForecastsList,
      };

      setTodayForecast([...allTodayForecastsList]);
      setTodayWeather(todayWeatherData);
      setWeekForecast(weekForecastData);
      setLastUpdated(currentUpdatedAt);

      cacheRef.current.set(cacheKey, {
        todayForecast: [...allTodayForecastsList],
        todayWeather: todayWeatherData,
        weekForecast: weekForecastData,
        lastUpdated: currentUpdatedAt,
      });
    } catch (error) {
      setTodayForecast([]);
      setTodayWeather(null);
      setWeekForecast(null);
      setLastUpdated('');
      setError(error.message || 'Something went wrong');
    }

    setIsLoading(false);
  }, []);

  let appContent = (
    <Grid item xs={12}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: '100%',
          minHeight: '420px',
          border: '1px dashed var(--border)',
          borderRadius: '16px',
          background:
            'linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.01))',
          px: { xs: 1.6, sm: 2.2 },
        }}
      >
        <SvgIcon
          component={SplashIcon}
          inheritViewBox
          sx={{
            fontSize: { xs: '86px', sm: '108px', md: '126px' },
            color: 'var(--text-muted)',
          }}
        />
        <Typography
          variant="body1"
          component="p"
          sx={{
            fontSize: { xs: '13px', sm: '15px' },
            color: 'var(--text-muted)',
            fontFamily: 'IBM Plex Sans',
            textAlign: 'center',
            margin: '1.2rem 0 0',
            maxWidth: '720px',
            lineHeight: 1.6,
          }}
        >
          Search any city to get current weather and a multi-day forecast.
          Results are cached for faster repeat lookups.
        </Typography>
      </Box>
    </Grid>
  );

  if (todayWeather && todayForecast && weekForecast) {
    appContent = (
      <React.Fragment>
        <Grid item xs={12} md={7}>
          <TodayWeather data={todayWeather} forecastList={todayForecast} />
        </Grid>
        <Grid item xs={12} md={5}>
          <WeeklyForecast data={weekForecast} />
        </Grid>
      </React.Fragment>
    );
  }

  if (error) {
    appContent = (
      <Grid item xs={12}>
        <ErrorBox
          margin="3rem auto"
          flex="inherit"
          errorMessage={error}
        />
      </Grid>
    );
  }

  if (isLoading) {
    appContent = (
      <Grid item xs={12}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            minHeight: '500px',
          }}
        >
          <LoadingBox value="1">
            <Typography
              variant="body2"
              component="p"
              sx={{
                fontSize: { xs: '12px', sm: '13px' },
                color: 'var(--text-muted)',
                lineHeight: 1,
                fontFamily: 'IBM Plex Sans',
              }}
            >
              Loading...
            </Typography>
          </LoadingBox>
        </Box>
      </Grid>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        width: { xs: '95%', sm: '92%', md: '100%' },
        margin: '0 auto',
        padding: { xs: '.8rem 0 1.6rem', sm: '1.2rem 0 2.2rem' },
        marginBottom: '1.2rem',
        marginTop: { xs: '.8rem', sm: '1.4rem' },
        borderRadius: {
          xs: '14px',
          sm: '18px',
        },
        background: 'linear-gradient(180deg, rgba(22,22,22,.94), rgba(10,10,10,.95))',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <Box sx={{ width: '100%', px: { xs: 1.2, sm: 2, md: 2.6 } }}>
        <Grid container columnSpacing={{ xs: 0, md: 2.2 }} rowSpacing={{ xs: 1.4, md: 2 }}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              width: '100%',
              marginBottom: '1rem',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <Box display="flex" alignItems="center" gap={1.2}>
              <Box
                component="img"
                sx={{
                  height: { xs: '16px', sm: '22px', md: '24px' },
                  width: 'auto',
                  filter: 'grayscale(1) brightness(3)',
                }}
                alt="logo"
                src={Logo}
              />

              {todayWeather?.city ? (
                <Typography
                  variant="body2"
                  component="p"
                  sx={{
                    color: 'var(--text-muted)',
                    fontSize: { xs: '12px', sm: '13px' },
                    lineHeight: 1,
                  }}
                >
                  {todayWeather.city}
                </Typography>
              ) : null}
            </Box>

            <Box
              display="flex"
              alignItems="center"
              gap={{ xs: 0.4, sm: 1.2 }}
              flexWrap="wrap"
              justifyContent="flex-end"
            >
              <UTCDatetime />

              {lastUpdated ? (
                <Typography
                  variant="body2"
                  component="p"
                  sx={{
                    color: 'var(--text-muted)',
                    fontSize: { xs: '11px', sm: '12px' },
                    border: '1px solid var(--border)',
                    borderRadius: '999px',
                    padding: '.26rem .56rem',
                    backgroundColor: 'var(--bg-soft)',
                  }}
                >
                  Updated {lastUpdated}{isFromCache ? ' (cached)' : ''}
                </Typography>
              ) : null}

              <Link
                href="https://github.com/festoqufx/the-weather-forecasting-raven"
                target="_blank"
                underline="none"
                aria-label="Open GitHub repository"
              >
                <IconButton
                  sx={{
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    '&:hover': {
                      backgroundColor: 'var(--surface-elevated)',
                      borderColor: 'var(--text-muted)',
                    },
                  }}
                >
                  <GitHubIcon
                    sx={{
                      fontSize: { xs: '18px', sm: '20px', md: '22px' },
                    }}
                  />
                </IconButton>
              </Link>
            </Box>
          </Box>
          <Search onSearchChange={searchChangeHandler} />
        </Grid>
        {appContent}
        </Grid>
      </Box>
    </Container>
  );
}

export default App;
