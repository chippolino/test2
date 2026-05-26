import { BAR_TOP_RADIUS } from './chartConfig';

/** Прямоугольник с закруглением только сверху (8px) */
export function roundedTopBarPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number = BAR_TOP_RADIUS,
): string {
  if (height <= 0) {
    return '';
  }

  const r = Math.min(radius, width / 2, height);

  if (height <= r) {
    return [
      `M ${x} ${y + height}`,
      `L ${x} ${y + r}`,
      `Q ${x} ${y} ${x + r} ${y}`,
      `L ${x + width - r} ${y}`,
      `Q ${x + width} ${y} ${x + width} ${y + r}`,
      `L ${x + width} ${y + height}`,
      'Z',
    ].join(' ');
  }

  return [
    `M ${x} ${y + height}`,
    `L ${x} ${y + r}`,
    `Q ${x} ${y} ${x + r} ${y}`,
    `L ${x + width - r} ${y}`,
    `Q ${x + width} ${y} ${x + width} ${y + r}`,
    `L ${x + width} ${y + height}`,
    'Z',
  ].join(' ');
}
