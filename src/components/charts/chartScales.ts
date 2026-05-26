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

export function getYTickValues(data: HourlyStatDto[], logScale: boolean): number[] {
  const maxCount = d3.max(data, (d) => d.anomalous_count) ?? 0;
  const top = Math.max(Math.ceil(maxCount), 1);

  if (logScale) {
    const ticks: number[] = [];
    for (let value = 0; value <= top; value += 1) {
      ticks.push(value);
    }
    return ticks;
  }

  return d3.range(0, top + 1, 1);
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
