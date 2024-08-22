import { configureStore } from '@reduxjs/toolkit';
import { activitiesReducer } from '../features/acitivities/activitiesSlice';

export const store = configureStore({
  reducer: {
    activities: activitiesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
