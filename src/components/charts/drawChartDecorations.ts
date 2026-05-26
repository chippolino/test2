import * as d3 from 'd3';
import type { Selection } from 'd3';
import type { HourlyStatDto } from '@/types/stats';
import { GRID_COLOR } from './chartConfig';

type GroupSelection = Selection<SVGGElement, unknown, null, undefined>;

export function drawYGrid(
  g: GroupSelection,
  yScale: d3.ScaleContinuousNumeric<number, number>,
  innerWidth: number,
  tickValues: number[],
): void {
  g.selectAll('line.grid-line')
    .data(tickValues)
    .join('line')
    .attr('class', 'grid-line')
    .attr('x1', 0)
    .attr('x2', innerWidth)
    .attr('y1', (value) => yScale(value))
    .attr('y2', (value) => yScale(value))
    .attr('stroke', GRID_COLOR)
    .attr('stroke-width', 1);
}

export function drawYAxis(
  g: GroupSelection,
  yScale: d3.ScaleContinuousNumeric<number, number>,
  tickValues: number[],
): void {
  g.append('g')
    .attr('class', 'y-axis')
    .call(
      d3
        .axisLeft(yScale)
        .tickValues(tickValues)
        .tickFormat((value) => d3.format('.1f')(Number(value))),
    )
    .selectAll('text')
    .attr('font-size', 12);

  g.select('.y-axis .domain').remove();
  g.selectAll('.y-axis .tick line').remove();
}

export function drawXLabels(
  g: GroupSelection,
  data: HourlyStatDto[],
  xPositions: number[],
  barWidth: number,
  innerHeight: number,
): void {
  g.append('g')
    .attr('class', 'x-labels')
    .attr('transform', `translate(0,${innerHeight + 20})`)
    .selectAll('text')
    .data(data)
    .join('text')
    .attr('x', (_, index) => xPositions[index] + barWidth / 2)
    .attr('y', 0)
    .attr('text-anchor', 'middle')
    .attr('font-size', 10)
    .attr('fill', '#666')
    .text((d) => d.hourLabel);
}

export function drawPlotBorder(
  g: GroupSelection,
  innerWidth: number,
  innerHeight: number,
): void {
  g.insert('rect', ':first-child')
    .attr('class', 'plot-border')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('fill', 'none')
    .attr('stroke', GRID_COLOR)
    .attr('stroke-width', 1);
}
