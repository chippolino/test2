import type { HourlyStatDto, StatsApiResponse, StatsChartDto } from '@/types/stats';
import { getMaxHourForDate, isToday } from '@/utils/dateUtils';

export function formatHourLabel(hour: number): string {
  return `${String(hour).padStart(2, '0')}-00`;
}

export function mapStatsToChartDto(
  response: StatsApiResponse,
  now: Date = new Date(),
): StatsChartDto {
  const maxHour = getMaxHourForDate(response.date, now);
  const countByHour = new Map(
    response.hourly_stats.map((item) => [item.hour, item.anomalous_count]),
  );

  const hourly_stats: HourlyStatDto[] = Array.from({ length: maxHour + 1 }, (_, hour) => ({
    hour,
    hourLabel: formatHourLabel(hour),
    anomalous_count: countByHour.get(hour) ?? 0,
  }));

  const total = hourly_stats.reduce((sum, item) => sum + item.anomalous_count, 0);

  return {
    date: response.date,
    isToday: isToday(response.date, now),
    hourly_stats,
    total,
  };
}
