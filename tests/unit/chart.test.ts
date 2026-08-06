// Te Whare Tapa Whā Wellbeing Reflection App
// Unit tests for SVG radar chart rendering

import { describe, it, expect, beforeEach } from 'vitest';
import { drawChart } from '@src/chart';
import type { Domain } from '@src/types';

const createDomain = (overrides: Partial<Domain> = {}): Domain => ({
  id: 'tinana',
  name: 'Physical wellbeing',
  maoriName: 'Taha tinana',
  description: 'Test description',
  prompt: 'Test prompt',
  score: 3,
  reflection: '',
  ...overrides
});

describe('Chart', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    const old = document.getElementById('test-chart');
    if (old) old.remove();

    container = document.createElement('div');
    container.id = 'test-chart';
    document.body.appendChild(container);
  });

  it('should render an SVG element', () => {
    const domains = [createDomain(), createDomain({ id: 'hinengaro', maoriName: 'Taha hinengaro', score: 4 })];
    drawChart('test-chart', domains);

    expect(container.innerHTML).toContain('<svg');
    expect(container.innerHTML).toContain('viewBox="0 0 280 280"');
  });

  it('should render nested polygon levels', () => {
    const domains = [createDomain()];
    drawChart('test-chart', domains);

    for (let level = 5; level >= 1; level--) {
      expect(container.innerHTML).toContain('class="chart-level level-' + level + '"');
    }
  });

  it('should render axes for each domain', () => {
    const domains = [
      createDomain(),
      createDomain({ id: 'hinengaro' }),
      createDomain({ id: 'wairua' }),
      createDomain({ id: 'whanau' })
    ];
    drawChart('test-chart', domains);

    expect(container.innerHTML).toContain('class="chart-axis"');
    const axisCount = (container.innerHTML.match(/class="chart-axis"/g) || []).length;
    expect(axisCount).toBe(4);
  });

  it('should render data polygon and dots', () => {
    const domains = [createDomain()];
    drawChart('test-chart', domains);

    expect(container.innerHTML).toContain('class="chart-data"');
    expect(container.innerHTML).toContain('class="chart-dot"');
  });

  it('should render labels without Taha prefix', () => {
    const domains = [createDomain()];
    drawChart('test-chart', domains);

    expect(container.innerHTML).toContain('>tinana<');
  });

  it('should calculate correct point positions', () => {
    const domains = [createDomain({ score: 5 })];
    drawChart('test-chart', domains);

    // At score 5, radius should be maxRadius (110), centered at 140
    // Top axis: x = 140, y = 140 - 110 = 30
    expect(container.innerHTML).toContain('cx="140"');
    expect(container.innerHTML).toContain('cy="30"');
  });

  it('should do nothing when container does not exist', () => {
    expect(() => drawChart('nonexistent', [createDomain()])).not.toThrow();
  });

  it('should render background SVG group as first child of SVG', () => {
    const domains = [createDomain()];
    drawChart('test-chart', domains);

    expect(container.innerHTML).toContain('class="chart-bg-custom"');
    expect(container.innerHTML).toContain('aria-hidden="true"');
    const svgStart = container.innerHTML.indexOf('<svg');
    const bgCustomStart = container.innerHTML.indexOf('chart-bg-custom');
    expect(bgCustomStart).toBeGreaterThan(svgStart);
  });

  it('should render value-level polygons group after background and before chart-bg', () => {
    const domains = [createDomain()];
    drawChart('test-chart', domains);

    const bgCustomIdx = container.innerHTML.indexOf('chart-bg-custom');
    const valueLevelIdx = container.innerHTML.indexOf('chart-value-level-polygons');
    const chartBgIdx = container.innerHTML.indexOf('class="chart-bg"');

    expect(valueLevelIdx).toBeGreaterThan(bgCustomIdx);
    expect(chartBgIdx).toBeGreaterThan(valueLevelIdx);
  });

  it('should render exactly 5 value-level polygons', () => {
    const domains = [createDomain()];
    drawChart('test-chart', domains);

    const groupMatch = container.innerHTML.match(/class="chart-value-level-polygons"[\s\S]*?<\/g>/);
    expect(groupMatch).not.toBeNull();
    const groupContent = groupMatch![0];
    const polygonCount = (groupContent.match(/<polygon/g) || []).length;
    expect(polygonCount).toBe(5);
  });

  it('should render value-level polygons with no fill and a light stroke', () => {
    const domains = [createDomain()];
    drawChart('test-chart', domains);

    const groupMatch = container.innerHTML.match(/class="chart-value-level-polygons"[\s\S]*?<\/g>/);
    expect(groupMatch).not.toBeNull();
    const groupContent = groupMatch![0];
    const polygons = groupContent.match(/<polygon[^>]*>/g) || [];
    expect(polygons.length).toBe(5);
    polygons.forEach(p => {
      expect(p).toContain('fill="none"');
      expect(p).toContain('stroke="var(--chart-value-level-stroke)"');
    });
  });

  it('should render background SVG with concentric circles and house outline', () => {
    const domains = [createDomain()];
    drawChart('test-chart', domains);

    expect(container.innerHTML).toContain('r="120"');
    expect(container.innerHTML).toContain('r="90"');
    expect(container.innerHTML).toContain('r="60"');
    expect(container.innerHTML).toContain('stroke="var(--chart-bg-custom)"');
  });

  it('should keep all new decorative groups non-interactive', () => {
    const domains = [createDomain()];
    drawChart('test-chart', domains);

    expect(container.innerHTML).toContain('class="chart-bg-custom" aria-hidden="true"');
    expect(container.innerHTML).toContain('class="chart-value-level-polygons" aria-hidden="true"');
  });
});
