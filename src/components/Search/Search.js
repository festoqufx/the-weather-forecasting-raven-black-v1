import React, { useEffect, useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import { fetchCities } from '../../api/OpenWeatherService';

const Search = ({ onSearchChange, selectedCity }) => {
  const [searchValue, setSearchValue] = useState(selectedCity || null);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    setSearchValue(selectedCity || null);
  }, [selectedCity]);

  const loadOptions = async (inputValue) => {
    if (!inputValue?.trim() || inputValue.trim().length < 2) {
      setSearchError('');
      return { options: [] };
    }

    try {
      const citiesList = await fetchCities(inputValue);
      setSearchError('');

      return {
        options: citiesList.map((city) => {
          return {
            value: `${city.latitude} ${city.longitude}`,
            label: `${city.name}, ${city.countryCode}`,
          };
        }),
      };
    } catch (error) {
      setSearchError(error?.message || 'Unable to load city suggestions');
      return { options: [] };
    }
  };

  const onChangeHandler = (enteredData) => {
    setSearchValue(enteredData);
    onSearchChange(enteredData);
  };

  return (
    <AsyncPaginate
      aria-label="Search for a city"
      placeholder="Search city name (min 2 letters)"
      debounceTimeout={450}
      value={searchValue}
      onChange={onChangeHandler}
      loadOptions={loadOptions}
      isClearable
      noOptionsMessage={({ inputValue }) =>
        searchError
          ? searchError
          : inputValue?.trim()?.length < 2
            ? 'Type at least 2 letters'
            : 'No matching cities'
      }
      loadingMessage={() => 'Finding cities...'}
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: 52,
          background: 'var(--surface)',
          border: `1px solid ${
            state.isFocused ? 'var(--text-muted)' : 'var(--border)'
          }`,
          borderRadius: 12,
          boxShadow: state.isFocused ? '0 0 0 2px var(--focus-ring)' : 'none',
          transition: 'border-color .2s ease, box-shadow .2s ease',
          ':hover': {
            borderColor: 'var(--text-muted)',
          },
        }),
        singleValue: (base) => ({
          ...base,
          color: 'var(--text)',
          fontFamily: 'IBM Plex Sans, sans-serif',
        }),
        placeholder: (base) => ({
          ...base,
          color: 'var(--text-muted)',
          fontFamily: 'IBM Plex Sans, sans-serif',
          fontSize: 14,
        }),
        input: (base) => ({
          ...base,
          color: 'var(--text)',
          fontFamily: 'IBM Plex Sans, sans-serif',
        }),
        menu: (base) => ({
          ...base,
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: 'var(--shadow)',
          zIndex: 20,
        }),
        option: (base, state) => ({
          ...base,
          color: 'var(--text)',
          backgroundColor: state.isFocused
            ? 'var(--surface-hover)'
            : 'transparent',
          fontFamily: 'IBM Plex Sans, sans-serif',
          fontSize: 14,
          cursor: 'pointer',
        }),
        indicatorSeparator: (base) => ({
          ...base,
          backgroundColor: 'var(--border)',
        }),
        dropdownIndicator: (base, state) => ({
          ...base,
          color: state.isFocused ? 'var(--text)' : 'var(--text-muted)',
          ':hover': {
            color: 'var(--text)',
          },
        }),
        clearIndicator: (base) => ({
          ...base,
          color: 'var(--text-muted)',
          ':hover': {
            color: 'var(--text)',
          },
        }),
        noOptionsMessage: (base) => ({
          ...base,
          color: 'var(--text-muted)',
          fontFamily: 'IBM Plex Sans, sans-serif',
        }),
        loadingMessage: (base) => ({
          ...base,
          color: 'var(--text-muted)',
          fontFamily: 'IBM Plex Sans, sans-serif',
        }),
      }}
    />
  );
};

export default Search;
