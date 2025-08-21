import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

const FarmContext = createContext();

const initialState = {
  selectedFarm: null,
  farms: [],
  isLoading: false,
  error: null,
};

const farmReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_FARMS':
      return {
        ...state,
        farms: action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_SELECTED_FARM':
      return {
        ...state,
        selectedFarm: action.payload,
      };
    case 'ADD_FARM':
      return {
        ...state,
        farms: [...state.farms, action.payload],
      };
    case 'UPDATE_FARM':
      return {
        ...state,
        farms: state.farms.map(farm =>
          farm._id === action.payload._id ? action.payload : farm
        ),
        selectedFarm: state.selectedFarm?._id === action.payload._id ? action.payload : state.selectedFarm,
      };
    case 'DELETE_FARM':
      return {
        ...state,
        farms: state.farms.filter(farm => farm._id !== action.payload),
        selectedFarm: state.selectedFarm?._id === action.payload ? null : state.selectedFarm,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const FarmProvider = ({ children }) => {
  const [state, dispatch] = useReducer(farmReducer, initialState);

  const setLoading = useCallback((isLoading) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  }, []);

  const setFarms = useCallback((farms) => {
    dispatch({ type: 'SET_FARMS', payload: farms });
  }, []);

  const setSelectedFarm = useCallback((farm) => {
    dispatch({ type: 'SET_SELECTED_FARM', payload: farm });
  }, []);

  const addFarm = useCallback((farm) => {
    dispatch({ type: 'ADD_FARM', payload: farm });
  }, []);

  const updateFarm = useCallback((farm) => {
    dispatch({ type: 'UPDATE_FARM', payload: farm });
  }, []);

  const deleteFarm = useCallback((farmId) => {
    dispatch({ type: 'DELETE_FARM', payload: farmId });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = useMemo(() => ({
    ...state,
    setLoading,
    setFarms,
    setSelectedFarm,
    addFarm,
    updateFarm,
    deleteFarm,
    setError,
    clearError,
  }), [state, setLoading, setFarms, setSelectedFarm, addFarm, updateFarm, deleteFarm, setError, clearError]);

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};
