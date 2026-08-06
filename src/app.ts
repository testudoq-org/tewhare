// Te Whare Tapa Whā Wellbeing Reflection App
// A digital interpretation for personal reflection, not a clinical tool.

import {
  DOMAINS,
  DEFAULT_SCORE,
  STORAGE_KEY,
  type AssessmentState,
  type Domain,
  createDefaultDomains,
  cloneDomains
} from './types';
import { loadState, saveState, clearState } from './storage';
import { drawChart } from './chart';

const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

class App {
  private state: AssessmentState;

  constructor() {
    const saved = loadState();
    this.state = {
      domains: saved?.domains ?? createDefaultDomains(),
      currentStep: 0,
      showSummary: false
    };
    this.init();
  }

  private init(): void {
    this.render();
    this.bindEvents();
  }

  private bindEvents(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      if (target.matches('[data-action="start"]')) {
        this.state = {
          domains: cloneDomains(this.state.domains),
          currentStep: 1,
          showSummary: false
        };
        this.render();
      }

      if (target.matches('[data-action="next"]')) {
        if (this.state.currentStep < this.state.domains.length) {
          this.state = {
            domains: cloneDomains(this.state.domains),
            currentStep: this.state.currentStep + 1,
            showSummary: false
          };
        } else {
          this.state = {
            domains: cloneDomains(this.state.domains),
            currentStep: this.state.domains.length,
            showSummary: true
          };
        }
        this.render();
      }

      if (target.matches('[data-action="prev"]')) {
        if (this.state.showSummary) {
          this.state = {
            domains: cloneDomains(this.state.domains),
            currentStep: this.state.domains.length,
            showSummary: false
          };
        } else if (this.state.currentStep > 1) {
          this.state = {
            domains: cloneDomains(this.state.domains),
            currentStep: this.state.currentStep - 1,
            showSummary: false
          };
        }
        this.render();
      }

      if (target.matches('[data-action="reset"]')) {
        if (confirm('Start a new reflection? Your current scores and notes will be cleared.')) {
          clearState();
          this.state = {
            domains: createDefaultDomains(),
            currentStep: 0,
            showSummary: false
          };
          this.render();
        }
      }

      if (target.matches('[data-action="print"]')) {
        window.print();
      }

      if (target.matches('[data-action="edit"]')) {
        const domainId = target.getAttribute('data-domain');
        if (domainId) {
          const idx = this.state.domains.findIndex((d) => d.id === domainId);
          if (idx >= 0) {
            this.state = {
              domains: cloneDomains(this.state.domains),
              currentStep: idx + 1,
              showSummary: false
            };
            this.render();
          }
        }
      }
    });

    document.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;

      if (target.matches('[data-score]')) {
        const id = target.getAttribute('data-score');
        const domain = this.state.domains.find((d) => d.id === id);
        if (domain) {
          const newScore = Math.max(1, Math.min(5, parseInt(target.value, 10) || 1));
          domain.score = newScore;
          saveState(this.state.domains);
          this.updateChart();
          this.updateScoreDisplay(id!, newScore);
        }
      }

      if (target.matches('[data-reflection]')) {
        const id = target.getAttribute('data-reflection');
        const domain = this.state.domains.find((d) => d.id === id);
        if (domain) {
          domain.reflection = target.value;
          saveState(this.state.domains);
        }
      }
    });
  }

  private updateScoreDisplay(id: string, score: number): void {
    const el = document.querySelector('[data-score-value="' + id + '"]');
    if (el) el.textContent = String(score);
  }

  private updateChart(): void {
    if (document.getElementById('live-chart')) {
      drawChart('live-chart', this.state.domains);
    }
    if (document.getElementById('summary-chart')) {
      drawChart('summary-chart', this.state.domains);
    }
  }

  private render(): void {
    const app = document.getElementById('app');
    if (!app) return;

    if (this.state.currentStep === 0) {
      app.innerHTML = this.renderWelcome();
    } else if (this.state.showSummary) {
      app.innerHTML = this.renderSummary();
      this.updateChart();
    } else {
      app.innerHTML = this.renderAssessment();
      this.updateChart();
    }
  }

  private renderWelcome(): string {
    return '' +
      '<section class="welcome" aria-labelledby="welcome-title">' +
        '<div class="welcome-content">' +
          '<h1 id="welcome-title">Te Whare Tapa Whā</h1>' +
          '<p class="subtitle">A wellbeing reflection</p>' +
          '<p class="intro">' +
            'Te Whare Tapa Whā is a model of hauora developed by Sir Mason Durie.' +
            ' It describes four walls of a house, each representing a dimension of wellbeing.' +
            ' When the walls are strong and balanced, the house stands well.' +
          '</p>' +
          '<p class="intro">' +
            'This tool is for personal reflection and conversation. It is not a diagnosis' +
            ' or clinical assessment. The meaning of each score belongs to you.' +
          '</p>' +
          '<p class="note">' +
            'This is a digital interpretation of the framework, offered with respect.' +
          '</p>' +
          '<button type="button" class="btn primary" data-action="start">Begin reflection</button>' +
        '</div>' +
      '</section>';
  }

  private renderAssessment(): string {
    const domain = this.state.domains[this.state.currentStep - 1];
    if (!domain) return "";
    const step = this.state.currentStep;
    const total = this.state.domains.length;

    return '' +
      '<section class="assessment" aria-labelledby="domain-title">' +
        '<header class="assessment-header">' +
          '<div class="progress" role="progressbar" aria-valuenow="' + step + '" aria-valuemin="1" aria-valuemax="' + total + '" aria-label="Progress">' +
            '<span class="progress-text">Step ' + step + ' of ' + total + '</span>' +
            '<div class="progress-bar">' +
              '<div class="progress-fill" style="width: ' + ((step / total) * 100) + '%"></div>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="btn text" data-action="reset">Start over</button>' +
        '</header>' +

        '<div class="assessment-body">' +
          '<div class="domain-panel">' +
            '<h2 id="domain-title">' +
              '<span class="maori">' + domain.maoriName + '</span>' +
              '<span class="english">' + domain.name + '</span>' +
            '</h2>' +
            '<p class="domain-desc">' + domain.description + '</p>' +

            '<div class="score-control">' +
              '<label for="score-' + domain.id + '">' +
                'Where do you sit right now? <span class="score-value" data-score-value="' + domain.id + '">' + domain.score + '</span> / 5' +
              '</label>' +
              '<input' +
                ' type="range"' +
                ' id="score-' + domain.id + '"' +
                ' min="1"' +
                ' max="5"' +
                ' step="1"' +
                ' value="' + domain.score + '"' +
                ' data-score="' + domain.id + '"' +
                ' aria-valuemin="1"' +
                ' aria-valuemax="5"' +
                ' aria-valuenow="' + domain.score + '"' +
                ' aria-label="Score for ' + domain.maoriName + '"' +
              ' />' +
              '<div class="score-labels" aria-hidden="true">' +
                '<span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>' +
              '</div>' +
            '</div>' +

            '<div class="reflection-control">' +
              '<label for="reflection-' + domain.id + '">' + domain.prompt + '</label>' +
              '<textarea' +
                ' id="reflection-' + domain.id + '"' +
                ' data-reflection="' + domain.id + '"' +
                ' rows="4"' +
                ' placeholder="Your thoughts (optional)"' +
              '>' + escapeHtml(domain.reflection) + '</textarea>' +
            '</div>' +
          '</div>' +

          '<div class="chart-panel">' +
            '<h3 class="chart-title">Your current shape</h3>' +
            '<div class="chart-container" id="live-chart" role="img" aria-label="Radar chart showing current wellbeing scores"></div>' +
            '<p class="chart-note">The shape updates as you move the slider. Stronger areas sit further out.</p>' +
          '</div>' +
        '</div>' +

        '<nav class="assessment-nav">' +
          '<button type="button" class="btn secondary" data-action="prev" ' + (step === 1 ? 'disabled' : '') + '>Back</button>' +
          '<button type="button" class="btn primary" data-action="next">' +
            (step === total ? 'See summary' : 'Next') +
          '</button>' +
        '</nav>' +
      '</section>';
  }

  private renderSummary(): string {
    const domains = this.state.domains;
    const scores = domains.map((d) => d.score);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const spread = max - min;

    let shapeNote = '';
    if (spread === 0) {
      shapeNote = 'Your scores sit evenly across all four dimensions.';
    } else if (spread <= 1) {
      shapeNote = 'Your shape is fairly balanced, with only small differences between dimensions.';
    } else {
      const strongest = domains.filter((d) => d.score === max).map((d) => d.maoriName);
      const softest = domains.filter((d) => d.score === min).map((d) => d.maoriName);
      shapeNote = 'Stronger areas include ' + strongest.join(' and ') + '. Areas sitting lower include ' + softest.join(' and ') + '.';
    }

    const domainCards = domains.map((d) =>
      '<article class="summary-card">' +
        '<h3>' +
          '<span class="maori">' + d.maoriName + '</span>' +
          '<span class="score-badge">' + d.score + '/5</span>' +
        '</h3>' +
        '<p class="summary-english">' + d.name + '</p>' +
        (d.reflection
          ? '<p class="summary-note">"' + escapeHtml(d.reflection) + '"</p>'
          : '<p class="summary-note muted">No notes added.</p>') +
        '<button type="button" class="btn text small" data-action="edit" data-domain="' + d.id + '">Edit</button>' +
      '</article>'
    ).join('');

    return '' +
      '<section class="summary" aria-labelledby="summary-title">' +
        '<header class="summary-header">' +
          '<h1 id="summary-title">Your reflection</h1>' +
          '<p class="subtitle">A snapshot of where you sit right now</p>' +
        '</header>' +

        '<div class="summary-body">' +
          '<div class="chart-panel large">' +
            '<div class="chart-container" id="summary-chart" role="img" aria-label="Radar chart of your wellbeing scores"></div>' +
            '<p class="shape-note">' + shapeNote + '</p>' +
            '<p class="avg-note">Average across dimensions: ' + avg.toFixed(1) + '</p>' +
          '</div>' +

          '<div class="summary-cards">' +
            domainCards +
          '</div>' +
        '</div>' +

        '<div class="summary-footer">' +
          '<p class="disclaimer">' +
            'This is a personal reflection tool based on Te Whare Tapa Whā.' +
            ' The scores and shape are yours to interpret. They do not replace' +
            ' professional support or conversation with people you trust.' +
          '</p>' +
          '<div class="summary-actions">' +
            '<button type="button" class="btn secondary" data-action="prev">Back to edit</button>' +
            '<button type="button" class="btn primary" data-action="print">Print or save as PDF</button>' +
            '<button type="button" class="btn text" data-action="reset">Start a new reflection</button>' +
          '</div>' +
        '</div>' +
      '</section>';
  }
}

export { App };

export const bootstrap = (): void => {
  new App();
};

document.addEventListener('DOMContentLoaded', () => {
  bootstrap();
});
