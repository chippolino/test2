import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { HourlyStatDto } from '@/types/stats';
import { BAR_COLOR, MARGIN } from './chartConfig';
import { roundedTopBarPath } from './barPath';
import { ChartContainer } from './ChartContainer';
import type { ChartDimensions } from './chartScales';
import { createYScale, getSvgDimensions, getYTickValues } from './chartScales';
import {
  drawPlotBorder,
  drawXLabels,
  drawYAxis,
  drawYGrid,
} from './drawChartDecorations';

interface HistogramChartProps {
  data: HourlyStatDto[];
  logScale: boolean;
}

function HistogramChartInner({
  data,
  logScale,
  dimensions,
}: HistogramChartProps & { dimensions: ChartDimensions }) {
  const gRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!gRef.current) {
      return;
    }

    const { innerWidth, innerHeight, xPositions, barWidth, barTopRadius } = dimensions;
    const yScale = createYScale(data, innerHeight, logScale);
    const yTickValues = getYTickValues(data, innerHeight, logScale);

    const g = d3.select(gRef.current);
    g.selectAll('*').remove();
    g.attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    drawPlotBorder(g, innerWidth, innerHeight);
    drawYGrid(g, yScale, innerWidth, yTickValues);
    drawYAxis(g, yScale, yTickValues);

    g.selectAll('path.bar')
      .data(data)
      .join('path')
      .attr('class', 'bar')
      .attr('fill', BAR_COLOR)
      .attr('d', (d, i) => {
        const x = xPositions[i];
        const barHeight = innerHeight - yScale(d.anomalous_count);
        const y = yScale(d.anomalous_count);
        return roundedTopBarPath(x, y, barWidth, barHeight, barTopRadius);
      });

    drawXLabels(g, data, xPositions, barWidth, innerHeight);

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -44)
      .attr('text-anchor', 'middle')
      .attr('fill', '#666')
      .attr('font-size', 12)
      .text('anomalous_count');
  }, [data, logScale, dimensions]);

  return (
    <svg width={dimensions.width} height={dimensions.height}>
      <g ref={gRef} />
    </svg>
  );
}

export function HistogramChart({ data, logScale }: HistogramChartProps) {
  return (
    <ChartContainer barCount={data.length} getDimensions={getSvgDimensions}>
      {(dimensions) => (
        <HistogramChartInner data={data} logScale={logScale} dimensions={dimensions} />
      )}
    </ChartContainer>
  );
}
