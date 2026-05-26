export const BAR_COLOR = '#DF466B';
export const BAR_WIDTH = 40;
export const BAR_GAP = 10;
export const BAR_TOP_RADIUS = 8;
export const CHART_HEIGHT = 320;
export const MARGIN = { top: 24, right: 24, bottom: 56, left: 56 };
export const CHART_BORDER_PADDING = 16;
export const CHART_BORDER_COLOR = '#D9D9D9';
export const GRID_COLOR = '#D9D9D9';

export function getChartInnerWidth(barCount: number): number {
  return barCount * BAR_WIDTH + (barCount - 1) * BAR_GAP;
}
