// Te Whare Tapa Whā Wellbeing Reflection App
// A digital interpretation for personal reflection, not a clinical tool.

import type { Domain } from './types';

export interface ChartPoint {
  readonly x: number;
  readonly y: number;
  readonly labelX: number;
  readonly labelY: number;
  readonly domain: Domain;
}

const buildBackgroundSvg = (size: number): string => {
  const center = size / 2;
  return '' +
    '<circle cx="' + center + '" cy="' + center + '" r="120" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.5" opacity="0.15"/>' +
    '<circle cx="' + center + '" cy="' + center + '" r="90" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.5" opacity="0.12"/>' +
    '<circle cx="' + center + '" cy="' + center + '" r="60" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.5" opacity="0.1"/>' +
    '<path d="M' + center + ',50 L' + (center + 70) + ',100 L' + (center + 70) + ',170 L' + center + ',220 L' + (center - 70) + ',170 L' + (center - 70) + ',100 Z" fill="none" stroke="var(--chart-bg-custom)" stroke-width="1.2" opacity="0.1"/>' +
    '<path d="M' + center + ',80 L' + (center + 40) + ',110 L' + (center + 40) + ',160 L' + center + ',190 L' + (center - 40) + ',160 L' + (center - 40) + ',110 Z" fill="none" stroke="var(--chart-bg-custom)" stroke-width="0.8" opacity="0.08"/>';
};

const buildValueLevelPolygons = (size: number, domains: readonly Domain[]): string => {
  const center = size / 2;
  const maxRadius = 110;
  const levels = 5;
  const n = domains.length;
  const angleStep = (Math.PI * 2) / n;
  const startAngle = -Math.PI / 2;
  const stroke = 'var(--chart-value-level-stroke)';

  let html = '';
  for (let level = 1; level <= levels; level++) {
    const r = (level / levels) * maxRadius;
    const pts: string[] = [];
    for (let i = 0; i < n; i++) {
      const angle = startAngle + i * angleStep;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      pts.push(x.toFixed(2) + ',' + y.toFixed(2));
    }
    html += '<polygon points="' + pts.join(' ') + '" fill="none" stroke="' + stroke + '" stroke-width="1" opacity="0.35"/>';
  }
  return html;
};

export const drawChart = (containerId: string, domains: readonly Domain[]): void => {
  const container = document.getElementById(containerId);
  if (!container) return;

  const size = 280;
  const center = size / 2;
  const maxRadius = 110;
  const levels = 5;
  const n = domains.length;
  const angleStep = (Math.PI * 2) / n;
  const startAngle = -Math.PI / 2;

  const points: readonly ChartPoint[] = domains.map((d, i) => {
    const angle = startAngle + i * angleStep;
    const r = (d.score / 5) * maxRadius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (maxRadius + 28) * Math.cos(angle),
      labelY: center + (maxRadius + 28) * Math.sin(angle),
      domain: d
    };
  });

  // Background levels (nested polygons)
  const levelsHtml = Array.from({ length: levels }, (_, idx) => {
    const level = levels - idx;
    const r = (level / levels) * maxRadius;
    const pts = Array.from({ length: n }, (_, i) => {
      const angle = startAngle + i * angleStep;
      return '' + center + r * Math.cos(angle) + ',' + center + r * Math.sin(angle);
    }).join(' ');
    return '<polygon points="' + pts + '" class="chart-level level-' + level + '" />';
  }).join('');

  // Axes
  const axesHtml = Array.from({ length: n }, (_, i) => {
    const angle = startAngle + i * angleStep;
    const x2 = center + maxRadius * Math.cos(angle);
    const y2 = center + maxRadius * Math.sin(angle);
    return '<line x1="' + center + '" y1="' + center + '" x2="' + x2 + '" y2="' + y2 + '" class="chart-axis" />';
  }).join('');

  // Data polygon
  const dataPts = points.map((p) => p.x + ',' + p.y).join(' ');
  const dataPolygon = '<polygon points="' + dataPts + '" class="chart-data" />';

  // Data points
  const dots = points.map((p) => '<circle cx="' + p.x + '" cy="' + p.y + '" r="5" class="chart-dot" />').join('');

  // Labels
  const labels = points.map((p) => {
    const name = p.domain.maoriName.replace('Taha ', '');
    return '<text x="' + p.labelX + '" y="' + p.labelY + '" class="chart-label" text-anchor="middle" dominant-baseline="middle">' + name + '</text>';
  }).join('');

  // Score labels on axes
  const scoreLabels = Array.from({ length: levels }, (_, idx) => {
    const level = idx + 1;
    const r = (level / levels) * maxRadius;
    const angle = startAngle;
    const x = center + r * Math.cos(angle) + 10;
    const y = center + r * Math.sin(angle);
    return '<text x="' + x + '" y="' + y + '" class="chart-level-label">' + level + '</text>';
  }).join('');

  const backgroundSvg = buildBackgroundSvg(size);
  const valueLevelPolygons = buildValueLevelPolygons(size, domains);

  container.innerHTML =
    '<svg viewBox="0 0 ' + size + ' ' + size + '" width="100%" height="100%" class="radar-svg" aria-hidden="true">' +
      '<g class="chart-bg-custom" aria-hidden="true">' +
        backgroundSvg +
      '</g>' +
      '<g class="chart-value-level-polygons" aria-hidden="true">' +
        valueLevelPolygons +
      '</g>' +
      '<g class="chart-bg">' +
        levelsHtml +
        axesHtml +
      '</g>' +
      dataPolygon +
      dots +
      labels +
      scoreLabels +
    '</svg>';
};

