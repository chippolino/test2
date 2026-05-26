import axios from 'axios';
import type { StatsApiResponse } from '@/types/stats';

const client = axios.create({
  baseURL: '/api',
});

const MOCK_BY_DATE: Record<string, StatsApiResponse> = {
  '2026-05-18': {
    date: '2026-05-18',
    hourly_stats: [
      { hour: 18, anomalous_count: 3 },
      { hour: 22, anomalous_count: 2 },
      { hour: 10, anomalous_count: 2 },
      { hour: 11, anomalous_count: 3 },
    ],
    total: 8,
  },
  '2026-05-11': {
    date: '2026-05-11',
    hourly_stats: [
      { hour: 8, anomalous_count: 1 },
      { hour: 14, anomalous_count: 4 },
      { hour: 20, anomalous_count: 2 },
    ],
    total: 7,
  },
};

const DEFAULT_MOCK: StatsApiResponse = {
  date: '2026-05-18',
  hourly_stats: [
    { hour: 9, anomalous_count: 1 },
    { hour: 12, anomalous_count: 2 },
  ],
  total: 3,
};

export async function fetchHourlyStats(date: string): Promise<StatsApiResponse> {
  const { data } = await client.get<StatsApiResponse>('/hourly-stats', {
    params: { date },
  });
  return data;
}

export function getMockHourlyStats(date: string): StatsApiResponse {
  const mock = MOCK_BY_DATE[date] ?? {
    ...DEFAULT_MOCK,
    date,
    hourly_stats: DEFAULT_MOCK.hourly_stats.map((item) => ({ ...item })),
  };

  return {
    ...mock,
    date,
  };
}
