import { useMemo, type ReactNode } from 'react';
import type { ChartDimensions } from './chartScales';
import { useElementWidth } from './useElementWidth';

interface ChartContainerProps {
  barCount: number;
  getDimensions: (barCount: number, containerWidth: number) => ChartDimensions | null;
  children: (dimensions: ChartDimensions) => ReactNode;
}

export function ChartContainer({ barCount, getDimensions, children }: ChartContainerProps) {
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const dimensions = useMemo(
    () => getDimensions(barCount, width),
    [barCount, getDimensions, width],
  );

  return (
    <div ref={ref} className="chart-container">
      {dimensions ? children(dimensions) : null}
    </div>
  );
}
