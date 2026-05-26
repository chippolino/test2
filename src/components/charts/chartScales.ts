import * as d3 from 'd3';
import type { HourlyStatDto } from '@/types/stats';
import {
  BAR_GAP,
  BAR_TOP_RADIUS,
  BAR_WIDTH,
  CHART_BORDER_PADDING,
  CHART_HEIGHT,
  MARGIN,
  getChartInnerWidth,
} from './chartConfig';

export interface BarLayout {
  barWidth: number;
  barGap: number;
  barTopRadius: number;
  innerWidth: number;
}

export interface ChartDimensions extends BarLayout {
  width: number;
  height: number;
  innerHeight: number;
  xPositions: number[];
}

export function createXPositions(
  barCount: number,
  barWidth: number,
  barGap: number,
): number[] {
  return Array.from({ length: barCount }, (_, index) => index * (barWidth + barGap));
}

export function getBarLayout(barCount: number, targetInnerWidth: number): BarLayout {
  const baseInnerWidth = getChartInnerWidth(barCount);
  const scale = targetInnerWidth / baseInnerWidth;
  const barWidth = BAR_WIDTH * scale;
  const barGap = BAR_GAP * scale;

  return {
    barWidth,
    barGap,
    innerWidth: targetInnerWidth,
    barTopRadius: Math.min(BAR_TOP_RADIUS * scale, barWidth / 2),
  };
}

const MIN_TICK_PIXELS = 40;
const MAX_Y_TICKS = 8;
/** При max ≤ этого порога — шаг 1 (0, 1, 2, …) */
const INTEGER_STEP_THRESHOLD = 12;

export function formatYTick(value: d3.NumberValue): string {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return '';
  }
  if (Number.isInteger(num)) {
    return String(num);
  }
  return d3.format('.1f')(num);
}

export function getYTickValues(
  data: HourlyStatDto[],
  innerHeight: number,
  logScale: boolean,
): number[] {
  const maxCount = d3.max(data, (d) => d.anomalous_count) ?? 0;
  const domainMax = Math.max(Math.ceil(maxCount), 1);
  const tickCount = Math.max(2, Math.min(MAX_Y_TICKS, Math.floor(innerHeight / MIN_TICK_PIXELS)));

  if (logScale) {
    const scale = d3.scaleSymlog().domain([0, domainMax]).range([innerHeight, 0]);
    return scale.ticks(tickCount);
  }

  if (domainMax <= INTEGER_STEP_THRESHOLD) {
    return d3.range(0, domainMax + 1, 1);
  }

  const scale = d3.scaleLinear().domain([0, domainMax]).range([innerHeight, 0]);
  const ticks = scale.ticks(tickCount);

  if (ticks[0] !== 0) {
    return [0, ...ticks];
  }

  return ticks;
}

export function createYScale(
  data: HourlyStatDto[],
  innerHeight: number,
  logScale: boolean,
): d3.ScaleContinuousNumeric<number, number> {
  const maxCount = d3.max(data, (d) => d.anomalous_count) ?? 0;
  const domainMax = Math.max(Math.ceil(maxCount), 1);

  if (logScale) {
    return d3.scaleSymlog().domain([0, domainMax]).range([innerHeight, 0]);
  }

  return d3.scaleLinear().domain([0, domainMax]).range([innerHeight, 0]);
}

export function getSvgDimensions(barCount: number, containerWidth: number): ChartDimensions | null {
  if (containerWidth <= 0 || barCount === 0) {
    return null;
  }

  const innerHeight = CHART_HEIGHT - MARGIN.top - MARGIN.bottom;
  const contentWidth = containerWidth - CHART_BORDER_PADDING * 2;
  const plotInnerWidth = Math.max(contentWidth - MARGIN.left - MARGIN.right, 1);
  const barLayout = getBarLayout(barCount, plotInnerWidth);
  const xPositions = createXPositions(barCount, barLayout.barWidth, barLayout.barGap);

  return {
    width: containerWidth,
    height: CHART_HEIGHT,
    innerHeight,
    xPositions,
    ...barLayout,
  };
}
