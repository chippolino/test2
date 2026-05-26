import axios from 'axios';
import type { StatsApiResponse } from '@/types/stats';

const client = axios.create({
  baseURL: '/api',
});

/** Пример ответа API — в проде заменить на реальный endpoint */
const MOCK_RESPONSE: StatsApiResponse = {
  date: '2026-05-18',
  hourly_stats: [
    { hour: 18, anomalous_count: 3 },
    { hour: 22, anomalous_count: 2 },
    { hour: 10, anomalous_count: 2 },
    { hour: 11, anomalous_count: 3 },
  ],
  total: 8,
};

export async function fetchHourlyStats(): Promise<StatsApiResponse> {
  const { data } = await client.get<StatsApiResponse>('/hourly-stats');
  return data;
}

export function getMockHourlyStats(): StatsApiResponse {
  return MOCK_RESPONSE;
}
