import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getMockHourlyStats } from '@/api/statsApi';
import type { StatsChartDto } from '@/types/stats';
import { mapStatsToChartDto } from '@/utils/statsMapper';

interface StatsState {
  data: StatsChartDto | null;
  loading: boolean;
  error: string | null;
  logScale: boolean;
}

const initialState: StatsState = {
  data: null,
  loading: false,
  error: null,
  logScale: false,
};

export const loadHourlyStats = createAsyncThunk('stats/load', async () => {
  const response = getMockHourlyStats();
  return mapStatsToChartDto(response);
});

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setLogScale(state, action: { payload: boolean }) {
      state.logScale = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadHourlyStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadHourlyStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loadHourlyStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка загрузки';
      });
  },
});

export const { setLogScale } = statsSlice.actions;
export default statsSlice.reducer;
