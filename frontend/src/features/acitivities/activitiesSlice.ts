import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/axios';
import { AppDispatch, RootState } from '../../app/store';

interface Activity {
  id: string
  title: string
  occurs_at: string
  trip_id: string
}

interface ActivitiesByDate {
  date: string
  items: Activity[]
}

export interface AcitivitiesState {
  activities: ActivitiesByDate[],
  status: 'idle' | 'pending' | 'completed' | 'rejected'
}

interface GetActivitiesThunkParams {
  tripId: string
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState,
  dispatch: AppDispatch
}>();

export const getActivitiesThunk = createAppAsyncThunk(
  'activities/getActivitiesThunk',
  async ({ tripId }: GetActivitiesThunkParams) => {
    const response = await api.get<{ activities: ActivitiesByDate[] }>(`/trips/${tripId}/activity`);
    return response.data.activities;
  },
  {
    condition: (_, thunkApi) => {
      const acitivitiesStatus = selectActivitiesStatus(thunkApi.getState());
      const unwantedAcitivitiesStatus = ['pending', 'rejected'];
      if (unwantedAcitivitiesStatus.includes(acitivitiesStatus)) {
        return false; // Don't execute getActivitiesThunk function
      }
      return true;
    },
  },
);

const initialState: AcitivitiesState = {
  activities: [],
  status: 'idle',
};

export const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getActivitiesThunk.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getActivitiesThunk.rejected, (state) => {
        state.status = 'rejected';
      })
      .addCase(getActivitiesThunk.fulfilled, (_, action) => ({
        activities: action.payload,
        status: 'completed',
      }));
  },
});

export const activitiesReducer = activitiesSlice.reducer;

export const selectAllActivities = (state: RootState) => state.activities.activities;
export const selectActivitiesStatus = (state: RootState) => state.activities.status;
