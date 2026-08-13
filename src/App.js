import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  IconButton,
  Link,
  SvgIcon,
  Tooltip,
  Typography,
} from '@mui/material';
import Search from './components/Search/Search';
import WeeklyForecast from './components/WeeklyForecast/WeeklyForecast';
import TodayWeather from './components/TodayWeather/TodayWeather';
import { fetchWeatherData, reverseGeocode } from './api/OpenWeatherService';
import { transformDateFormat } from './utilities/DatetimeUtils';
import UTCDatetime from './components/Reusable/UTCDatetime';
import LoadingBox from './components/Reusable/LoadingBox';
import { ReactComponent as SplashIcon } from './assets/splash-icon.svg';
import Logo from './assets/logo.png';
import ErrorBox from './components/Reusable/ErrorBox';
import { ALL_DESCRIPTIONS } from './utilities/DateConstants';
import GitHubIcon from '@mui/icons-material/GitHub';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import {
  getTodayForecastWeather,
  getWeekForecastWeather,
} from './utilities/DataUtils';
import { useThemeMode } from './context/ThemeContext';
import { useTempUnit } from './context/UnitContext';

const CACHE_TTL_MS = 10 * 60 * 1000;

const controlButtonSx = {
  color: 'var(--text)',
  border: '1px solid var(--border)',
  borderRadius: '10px',
  backgroundColor: 'var(--control-bg)',
  transition: 'background-color .2s ease, border-color .2s ease',
  '&:hover': {
    backgroundColor: 'var(--surface-hover)',
    borderColor: 'var(--text-muted)',
  },
  '&.Mui-disabled': {
    color: 'var(--text-muted)',
    opacity: 0.55,
  },
};

function App() {
  const { mode, toggleMode } = useThemeMode();
  const { unit, toggleUnit } = useTempUnit();
  const [todayWeather, setTodayWeather] = useState(null);
  const [todayForecast, setTodayForecast] = useState([]);
  const [weekForecast, setWeekForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [isFromCache, setIsFromCache] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [locating, setLocating] = useState(false);
  const cacheRef = useRef(new Map());
  const hasTriedGeolocation = useRef(false);
  const requestIdRef = useRef(0);

  const loadWeatherForCity = useCallback(async (enteredData, options = {}) => {
    if (!enteredData?.value) {
      return;
    }

    const { forceRefresh = false } = options;
    const [latitude, longitude] = enteredData.value.split(' ');
    const cacheKey = `${latitude},${longitude}`;
    const requestId = ++requestIdRef.current;

    setSelectedCity(enteredData);
    setError('');
    setIsLoading(true);
    setIsFromCache(false);

    const currentDate = transformDateFormat();
    const date = new Date();
    const dt_now = Math.floor(date.getTime() / 1000);
    const cachedResult = cacheRef.current.get(cacheKey);
    const cacheIsFresh =
      cachedResult && Date.now() - cachedResult.cachedAt < CACHE_TTL_MS;

    if (!forceRefresh && cacheIsFresh) {
      if (requestId === requestIdRef.current) {
        setTodayForecast(cachedResult.todayForecast);
        setTodayWeather(cachedResult.todayWeather);
        setWeekForecast(cachedResult.weekForecast);
        setLastUpdated(cachedResult.lastUpdated);
        setIsFromCache(true);
        setIsLoading(false);
      }
      return;
    }

    try {
      const [todayWeatherResponse, weekForecastResponse] =
        await fetchWeatherData(latitude, longitude);

      if (requestId !== requestIdRef.current) {
        return;
      }

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
        cachedAt: Date.now(),
      });
    } catch (loadError) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setTodayForecast([]);
      setTodayWeather(null);
      setWeekForecast(null);
      setLastUpdated('');
      setError(loadError.message || 'Something went wrong');
    }

    if (requestId === requestIdRef.current) {
      setIsLoading(false);
    }
  }, []);

  const searchChangeHandler = useCallback(
    (enteredData) => {
      loadWeatherForCity(enteredData);
    },
    [loadWeatherForCity]
  );

  const locateUser = useCallback(
    (options = {}) => {
      const { silent = false } = options;

      if (!navigator.geolocation) {
        if (!silent) {
          setError('Geolocation is not supported by this browser.');
        }
        return;
      }

      setLocating(true);
      if (!silent) {
        setError('');
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const city = await reverseGeocode(latitude, longitude);
            await loadWeatherForCity(city, { forceRefresh: true });
          } catch (geoError) {
            if (!silent) {
              setError(geoError.message || 'Unable to detect your location.');
            }
          } finally {
            setLocating(false);
          }
        },
        (geoError) => {
          setLocating(false);
          if (silent) {
            return;
          }
          if (geoError.code === geoError.PERMISSION_DENIED) {
            setError('Location permission denied. Search for a city instead.');
            return;
          }
          setError('Unable to access your location. Search for a city instead.');
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    },
    [loadWeatherForCity]
  );

  useEffect(() => {
    if (hasTriedGeolocation.current) {
      return;
    }
    hasTriedGeolocation.current = true;

    const shouldAutoLocate =
      window.localStorage.getItem('weather-auto-locate') !== 'false';

    if (shouldAutoLocate && navigator.geolocation) {
      locateUser({ silent: true });
    }
  }, [locateUser]);

  let appContent = (
    <Grid item xs={12}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: '100%',
          minHeight: { xs: '360px', sm: '420px' },
          border: '1px dashed var(--splash-border)',
          borderRadius: '16px',
          background: 'var(--panel-gradient)',
          px: { xs: 1.6, sm: 2.2 },
          animation: 'fadeIn .35s ease',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(8px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
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
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: '1.35rem', sm: '1.7rem' },
            fontFamily: 'Space Grotesk',
            fontWeight: 600,
            color: 'var(--text)',
            margin: '1rem 0 .45rem',
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          Raven Weather
        </Typography>
        <Typography
          variant="body1"
          component="p"
          sx={{
            fontSize: { xs: '13px', sm: '15px' },
            color: 'var(--text-muted)',
            fontFamily: 'IBM Plex Sans',
            textAlign: 'center',
            margin: 0,
            maxWidth: '560px',
            lineHeight: 1.6,
          }}
        >
          Search any city or use your location for current conditions and a
          multi-day forecast. Results stay cached for faster repeat lookups.
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
        <ErrorBox margin="3rem auto" flex="inherit" errorMessage={error} />
      </Grid>
    );
  }

  if (isLoading || locating) {
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
          <LoadingBox>
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
              {locating ? 'Detecting your location...' : 'Loading weather...'}
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
        background: 'var(--app-shell)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Box sx={{ width: '100%', px: { xs: 1.2, sm: 2, md: 2.6 } }}>
        <Grid
          container
          columnSpacing={{ xs: 0, md: 2.2 }}
          rowSpacing={{ xs: 1.4, md: 2 }}
        >
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
                    filter: 'var(--logo-filter)',
                  }}
                  alt="Raven Weather logo"
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
                gap={{ xs: 0.4, sm: 1 }}
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
                    Updated {lastUpdated}
                    {isFromCache ? ' (cached)' : ''}
                  </Typography>
                ) : null}

                <Tooltip
                  title={
                    unit === 'C' ? 'Switch to Fahrenheit' : 'Switch to Celsius'
                  }
                >
                  <IconButton
                    onClick={toggleUnit}
                    aria-label={
                      unit === 'C'
                        ? 'Switch temperature unit to Fahrenheit'
                        : 'Switch temperature unit to Celsius'
                    }
                    sx={{
                      ...controlButtonSx,
                      minWidth: 42,
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: 'Space Grotesk',
                    }}
                  >
                    °{unit}
                  </IconButton>
                </Tooltip>

                <Tooltip
                  title={
                    mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
                  }
                >
                  <IconButton
                    onClick={toggleMode}
                    aria-label={
                      mode === 'dark'
                        ? 'Switch to light mode'
                        : 'Switch to dark mode'
                    }
                    sx={controlButtonSx}
                  >
                    {mode === 'dark' ? (
                      <LightModeOutlinedIcon
                        sx={{ fontSize: { xs: '18px', sm: '20px' } }}
                      />
                    ) : (
                      <DarkModeOutlinedIcon
                        sx={{ fontSize: { xs: '18px', sm: '20px' } }}
                      />
                    )}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Use my location">
                  <span>
                    <IconButton
                      onClick={() => locateUser({ silent: false })}
                      disabled={isLoading || locating}
                      aria-label="Use my current location"
                      sx={controlButtonSx}
                    >
                      <MyLocationOutlinedIcon
                        sx={{ fontSize: { xs: '18px', sm: '20px' } }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>

                <Tooltip title="Refresh weather">
                  <span>
                    <IconButton
                      onClick={() =>
                        selectedCity &&
                        loadWeatherForCity(selectedCity, { forceRefresh: true })
                      }
                      disabled={!selectedCity || isLoading || locating}
                      aria-label="Refresh weather data"
                      sx={controlButtonSx}
                    >
                      <RefreshOutlinedIcon
                        sx={{ fontSize: { xs: '18px', sm: '20px' } }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>

                <Link
                  href="https://github.com/festoqufx/the-weather-forecasting-raven"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                  aria-label="Open GitHub repository"
                >
                  <IconButton sx={controlButtonSx}>
                    <GitHubIcon
                      sx={{
                        fontSize: { xs: '18px', sm: '20px', md: '22px' },
                      }}
                    />
                  </IconButton>
                </Link>
              </Box>
            </Box>
            <Search
              onSearchChange={searchChangeHandler}
              selectedCity={selectedCity}
            />
          </Grid>
          {appContent}
        </Grid>
      </Box>
    </Container>
  );
}

export default App;
