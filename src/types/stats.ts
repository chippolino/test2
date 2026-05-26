/** Ответ API */
export interface HourlyStatRaw {
  hour: number;
  anomalous_count: number;
}

export interface StatsApiResponse {
  date: string;
  hourly_stats: HourlyStatRaw[];
  total: number;
}

/** DTO для графиков */
export interface HourlyStatDto {
  hour: number;
  hourLabel: string;
  anomalous_count: number;
}

export interface StatsChartDto {
  date: string;
  hourly_stats: HourlyStatDto[];
  total: number;
}
