import type { HourlyStatDto, StatsApiResponse, StatsChartDto } from '@/types/stats';

const HOURS_IN_DAY = 24;

export function formatHourLabel(hour: number): string {
  return `${String(hour).padStart(2, '0')}-00`;
}

export function mapStatsToChartDto(response: StatsApiResponse): StatsChartDto {
  const countByHour = new Map(
    response.hourly_stats.map((item) => [item.hour, item.anomalous_count]),
  );

  const hourly_stats: HourlyStatDto[] = Array.from({ length: HOURS_IN_DAY }, (_, hour) => ({
    hour,
    hourLabel: formatHourLabel(hour),
    anomalous_count: countByHour.get(hour) ?? 0,
  }));

  return {
    date: response.date,
    hourly_stats,
    total: response.total,
  };
}
