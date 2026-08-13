import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'weather-temp-unit';

const UnitContext = createContext({
  unit: 'C',
  toggleUnit: () => {},
  setUnit: () => {},
});

function getInitialUnit() {
  if (typeof window === 'undefined') {
    return 'C';
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'F' ? 'F' : 'C';
}

export function UnitProvider({ children }) {
  const [unit, setUnitState] = useState(getInitialUnit);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, unit);
  }, [unit]);

  const setUnit = useCallback((nextUnit) => {
    if (nextUnit === 'C' || nextUnit === 'F') {
      setUnitState(nextUnit);
    }
  }, []);

  const toggleUnit = useCallback(() => {
    setUnitState((prev) => (prev === 'C' ? 'F' : 'C'));
  }, []);

  const value = useMemo(
    () => ({
      unit,
      toggleUnit,
      setUnit,
    }),
    [unit, toggleUnit, setUnit]
  );

  return (
    <UnitContext.Provider value={value}>{children}</UnitContext.Provider>
  );
}

export function useTempUnit() {
  return useContext(UnitContext);
}
