import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { HourlyStatDto } from '@/types/stats';
import { BAR_COLOR, MARGIN } from './chartConfig';
import { ChartContainer } from './ChartContainer';
import type { ChartDimensions } from './chartScales';
import { createYScale, getSvgDimensions, getYTickValues } from './chartScales';
import {
  drawPlotBorder,
  drawXLabels,
  drawYAxis,
  drawYGrid,
} from './drawChartDecorations';

interface LineChartProps {
  data: HourlyStatDto[];
  logScale: boolean;
}

function LineChartInner({
  data,
  logScale,
  dimensions,
}: LineChartProps & { dimensions: ChartDimensions }) {
  const gRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!gRef.current) {
      return;
    }

    const { innerWidth, innerHeight, xPositions, barWidth } = dimensions;
    const yScale = createYScale(data, innerHeight, logScale);
    const yTickValues = getYTickValues(data, innerHeight, logScale);

    const line = d3
      .line<HourlyStatDto>()
      .x((_, i) => xPositions[i] + barWidth / 2)
      .y((d) => yScale(d.anomalous_count))
      .curve(d3.curveMonotoneX);

    const g = d3.select(gRef.current);
    g.selectAll('*').remove();
    g.attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    drawPlotBorder(g, innerWidth, innerHeight);
    drawYGrid(g, yScale, innerWidth, yTickValues);
    drawYAxis(g, yScale, yTickValues);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', BAR_COLOR)
      .attr('stroke-width', 2)
      .attr('d', line);

    g.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', (_, i) => xPositions[i] + barWidth / 2)
      .attr('cy', (d) => yScale(d.anomalous_count))
      .attr('r', 4)
      .attr('fill', BAR_COLOR);

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

export function LineChart({ data, logScale }: LineChartProps) {
  return (
    <ChartContainer barCount={data.length} getDimensions={getSvgDimensions}>
      {(dimensions) => <LineChartInner data={data} logScale={logScale} dimensions={dimensions} />}
    </ChartContainer>
  );
}
