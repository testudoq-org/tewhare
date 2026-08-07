// Te Whare Tapa Whā Wellbeing Reflection App
// A digital interpretation for personal reflection, not a clinical tool.

import {
  type AssessmentState,
  type Domain,
  createDefaultDomains,
  cloneDomains
} from './types';
import { loadState, saveState, clearState, loadLanguage, saveLanguage, exportState, importState } from './storage';
import { drawChart } from './chart';
import { t, type Language, DEFAULT_LANGUAGE } from './i18n';

const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/** Detect a likely language from the browser; returns DEFAULT_LANGUAGE on ambiguity. */
const detectBrowserLanguage = (): Language =>
  typeof navigator !== 'undefined' && navigator.language?.startsWith('mi')
    ? 'mi'
    : DEFAULT_LANGUAGE;

class App {
  private state: AssessmentState;
  private language: Language;
  private showLanguageSelector: boolean;
  private showExportScreen = false;

  constructor() {
    const savedLang = loadLanguage();
    this.language = savedLang ?? detectBrowserLanguage();
    this.showLanguageSelector = savedLang === null;

    const saved = loadState();
    this.state = {
      domains: saved?.domains ?? createDefaultDomains(),
      currentStep: 0,
      showSummary: false
    };
    this.init();
  }

  private init(): void {
    this.updateHtmlLang();
    this.render();
    this.bindEvents();
  }

  private updateHtmlLang(): void {
    document.documentElement.setAttribute('lang', this.language);
  }

  private bindEvents(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      if (target.matches('[data-action="select-lang"]')) {
        const lang = target.getAttribute('data-lang') as Language;
        this.setLanguage(lang);
        return;
      }

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
        if (confirm(t('dialog.resetConfirm', this.language))) {
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

      if (target.matches('[data-action="export"]')) {
        this.showExportScreen = true;
        this.render();
        return;
      }

      if (target.matches('[data-action="export-download"]')) {
        const json = exportState();
        if (json) {
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'te-whare-tapa-wha-assessment.json';
          a.click();
          URL.revokeObjectURL(url);
        }
        return;
      }

      if (target.matches('[data-action="export-back"]')) {
        this.showExportScreen = false;
        this.render();
        return;
      }

      if (target.matches('[data-action="import"]')) {
        const input = document.querySelector('[data-import-input]') as HTMLInputElement | null;
        input?.click();
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

    document.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;

      if (target.matches('[data-import-input]')) {
        const file = target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const parsed = JSON.parse(reader.result as string);
              if (parsed.domains && Array.isArray(parsed.domains)) {
                importState(parsed.domains);
                this.state = {
                  domains: cloneDomains(parsed.domains),
                  currentStep: 0,
                  showSummary: false
                };
                this.render();
              } else {
                alert(t('import.error', this.language));
              }
            } catch {
              alert(t('import.error', this.language));
            }
          };
          reader.readAsText(file);
        }
      }
    });
  }

  private setLanguage(lang: Language): void {
    this.language = lang;
    this.showLanguageSelector = false;
    saveLanguage(lang);
    this.updateHtmlLang();
    this.render();
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

  /** Return the domain name appropriate for the current language. */
  private domainName = (d: Domain): string =>
    this.language === 'mi' ? d.maoriName : d.name;

  /** Return the domain description appropriate for the current language. */
  private domainDescription = (d: Domain): string =>
    this.language === 'mi' ? (d.descriptionMi ?? d.description) : d.description;

  /** Return the domain prompt appropriate for the current language. */
  private domainPrompt = (d: Domain): string =>
    this.language === 'mi' ? (d.promptMi ?? d.prompt) : d.prompt;

  private render(): void {
    const app = document.getElementById('app');
    if (!app) return;

    if (this.showLanguageSelector) {
      app.innerHTML = this.renderLanguageSelector();
    } else if (this.showExportScreen) {
      app.innerHTML = this.renderExportScreen();
    } else if (this.state.currentStep === 0) {
      app.innerHTML = this.renderWelcome();
    } else if (this.state.showSummary) {
      app.innerHTML = this.renderSummary();
      this.updateChart();
    } else {
      app.innerHTML = this.renderAssessment();
      this.updateChart();
    }
  }

  private renderLanguageSelector(): string {
    const detected = detectBrowserLanguage();
    const isDetected = (lang: Language): string =>
      lang === detected ? ' selected' : '';
    const titleEn = escapeHtml(t('lang.selectTitle', 'en'));
    const titleMi = escapeHtml(t('lang.selectTitle', 'mi'));
    const subtitleEn = escapeHtml(t('lang.selectSubtitle', 'en'));
    const subtitleMi = escapeHtml(t('lang.selectSubtitle', 'mi'));

    return `
      <section class="lang-selector" aria-labelledby="lang-select-title">
        <div class="lang-selector-content">
          <h1 id="lang-select-title">
            <span class="lang-mi">${titleMi}</span>
            <span class="lang-en">${titleEn}</span>
          </h1>
          <p class="lang-subtitle">
            <span class="lang-mi">${subtitleMi}</span>
            <span class="lang-en">${subtitleEn}</span>
          </p>
          <div class="lang-options" role="radiogroup" aria-label="${escapeHtml(t('lang.selectTitle', this.language))}">
            <button type="button" class="lang-option${isDetected('en')}" data-action="select-lang" data-lang="en" aria-checked="${detected === 'en' ? 'true' : 'false'}">
              ${escapeHtml(t('lang.option.en', 'en'))}
            </button>
            <button type="button" class="lang-option${isDetected('mi')}" data-action="select-lang" data-lang="mi" aria-checked="${detected === 'mi' ? 'true' : 'false'}">
              ${escapeHtml(t('lang.option.mi', 'mi'))}
            </button>
          </div>
        </div>
      </section>`;
  }

  private renderWelcome(): string {
    return `
      <section class="welcome" aria-labelledby="welcome-title">
        <div class="welcome-content">
          <h1 id="welcome-title">Te Whare Tapa Whā</h1>
          <p class="subtitle">${escapeHtml(t('welcome.subtitle', this.language))}</p>
          <p class="intro">${escapeHtml(t('welcome.intro1', this.language))}</p>
          <p class="intro">${escapeHtml(t('welcome.intro2', this.language))}</p>
          <p class="note">${escapeHtml(t('welcome.note', this.language))}</p>
          <button type="button" class="btn primary" data-action="start">
            ${escapeHtml(t('welcome.startButton', this.language))}
          </button>
        </div>
      </section>`;
  }

  private renderAssessment(): string {
    const domain = this.state.domains[this.state.currentStep - 1];
    if (!domain) return '';
    const step = this.state.currentStep;
    const total = this.state.domains.length;

    const desc = escapeHtml(this.domainDescription(domain));
    const prompt = escapeHtml(this.domainPrompt(domain));
    const scoreLabel = escapeHtml(t('assessment.scoreLabel', this.language));
    const progLabel = escapeHtml(t('assessment.progressLabel', this.language));
    const stepOf = escapeHtml(
      t('assessment.stepOf', this.language, { step: String(step), total: String(total) })
    );
    const startOver = escapeHtml(t('assessment.startOver', this.language));
    const placeholder = escapeHtml(t('assessment.reflectionPlaceholder', this.language));
    const chartTitle = escapeHtml(t('assessment.chartTitle', this.language));
    const chartNote = escapeHtml(t('assessment.chartNote', this.language));
    const scoreFormat = escapeHtml(t('assessment.scoreFormat', this.language));
    const scoreAria = escapeHtml(
      t('assessment.chartScoreAria', this.language, { name: domain.maoriName })
    );
    const liveAria = escapeHtml(t('chart.liveAriaLabel', this.language));
    const backBtn = escapeHtml(t('nav.back', this.language));
    const nextBtn = step === total
      ? escapeHtml(t('nav.seeSummary', this.language))
      : escapeHtml(t('nav.next', this.language));

    return `
      <section class="assessment" aria-labelledby="domain-title">
        <header class="assessment-header">
          <div class="progress" role="progressbar" aria-valuenow="${step}" aria-valuemin="1" aria-valuemax="${total}" aria-label="${progLabel}">
            <span class="progress-text">${stepOf}</span>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${((step / total) * 100)}%"></div>
            </div>
          </div>
          <button type="button" class="btn text" data-action="reset">${startOver}</button>
        </header>

        <div class="assessment-body">
          <div class="domain-panel">
            <h2 id="domain-title">
              <span class="maori">${escapeHtml(domain.maoriName)}</span>
              <span class="english">${escapeHtml(domain.name)}</span>
            </h2>
            <p class="domain-desc">${desc}</p>

            <div class="score-control">
              <label for="score-${domain.id}">
                ${scoreLabel} <span class="score-value" data-score-value="${domain.id}">${domain.score}</span>${scoreFormat}
              </label>
              <input
                type="range"
                id="score-${domain.id}"
                min="1"
                max="5"
                step="1"
                value="${domain.score}"
                data-score="${domain.id}"
                aria-valuemin="1"
                aria-valuemax="5"
                aria-valuenow="${domain.score}"
                aria-label="${scoreAria}"
              />
              <div class="score-labels" aria-hidden="true">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
              </div>
            </div>

            <div class="reflection-control">
              <label for="reflection-${domain.id}">${prompt}</label>
              <textarea
                id="reflection-${domain.id}"
                data-reflection="${domain.id}"
                rows="4"
                placeholder="${placeholder}"
              >${escapeHtml(domain.reflection)}</textarea>
            </div>
          </div>

          <div class="chart-panel">
            <h3 class="chart-title">${chartTitle}</h3>
            <div class="chart-container" id="live-chart" role="img" aria-label="${liveAria}"></div>
            <p class="chart-note">${chartNote}</p>
          </div>
        </div>

        <nav class="assessment-nav">
          <button type="button" class="btn secondary" data-action="prev" ${step === 1 ? 'disabled' : ''}>${backBtn}</button>
          <button type="button" class="btn primary" data-action="next">
            ${nextBtn}
          </button>
        </nav>
      </section>`;
  }

  private renderSummary(): string {
    const domains = this.state.domains;
    const scores = domains.map((d) => d.score);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const spread = max - min;
    const andWord = t('common.and', this.language);
    const scoreFormat = escapeHtml(t('assessment.scoreFormat', this.language));

    let shapeNote = '';
    if (spread === 0) {
      shapeNote = escapeHtml(t('summary.scoreEven', this.language));
    } else if (spread <= 1) {
      shapeNote = escapeHtml(t('summary.scoreBalanced', this.language));
    } else {
      const strongest = domains
        .filter((d) => d.score === max)
        .map((d) => this.domainName(d));
      const softest = domains
        .filter((d) => d.score === min)
        .map((d) => this.domainName(d));
      shapeNote = escapeHtml(
        t('summary.scoreSpread', this.language, {
          strongest: strongest.join(andWord),
          softest: softest.join(andWord)
        })
      );
    }

    const title = escapeHtml(t('summary.title', this.language));
    const subtitle = escapeHtml(t('summary.subtitle', this.language));
    const noNotes = escapeHtml(t('summary.noNotes', this.language));
    const editBtn = escapeHtml(t('summary.edit', this.language));
    const disclaimer = escapeHtml(t('summary.disclaimer', this.language));
    const backToEdit = escapeHtml(t('summary.backToEdit', this.language));
    const printBtn = escapeHtml(t('summary.print', this.language));
    const startNew = escapeHtml(t('summary.startNew', this.language));
    const exportBtn = escapeHtml(t('export.button', this.language));
    const importBtn = escapeHtml(t('import.button', this.language));
    const avgNote = escapeHtml(
      t('summary.avgNote', this.language, { avg: avg.toFixed(1) })
    );
    const summaryAria = escapeHtml(t('chart.summaryAriaLabel', this.language));

    const domainCards = domains.map((d) => `
      <article class="summary-card">
        <h3>
          <span class="domain-names">
            <span class="maori">${escapeHtml(d.maoriName)}</span>
            <span class="english">${escapeHtml(d.name)}</span>
          </span>
          <span class="score-badge">${d.score}${scoreFormat}</span>
        </h3>
        ${d.reflection
          ? `<p class="summary-note">"${escapeHtml(d.reflection)}"</p>`
          : `<p class="summary-note muted">${noNotes}</p>`}
        <button type="button" class="btn text small" data-action="edit" data-domain="${d.id}">${editBtn}</button>
      </article>
    `).join('');

    return `
      <section class="summary" aria-labelledby="summary-title">
        <header class="summary-header">
          <h1 id="summary-title">${title}</h1>
          <p class="subtitle">${subtitle}</p>
        </header>

        <div class="summary-body">
          <div class="chart-panel large">
            <div class="chart-container" id="summary-chart" role="img" aria-label="${summaryAria}"></div>
            <p class="shape-note">${shapeNote}</p>
            <p class="avg-note">${avgNote}</p>
          </div>

          <div class="summary-cards">
            ${domainCards}
          </div>
        </div>

        <div class="summary-footer">
          <p class="disclaimer">${disclaimer}</p>
          <div class="summary-actions">
            <button type="button" class="btn secondary" data-action="prev">${backToEdit}</button>
            <button type="button" class="btn primary" data-action="print">${printBtn}</button>
            <button type="button" class="btn text" data-action="export">${exportBtn}</button>
            <button type="button" class="btn text" data-action="import">${importBtn}</button>
            <input type="file" accept=".json" data-import-input style="display: none;" />
            <button type="button" class="btn text" data-action="reset">${startNew}</button>
          </div>
        </div>
      </section>`;
  }

  private renderExportScreen(): string {
    const title = escapeHtml(t('export.title', this.language));
    const description = escapeHtml(t('export.description', this.language));
    const downloadBtn = escapeHtml(t('export.downloadButton', this.language));
    const backBtn = escapeHtml(t('export.back', this.language));
    const domains = this.state.domains;
    const domainList = domains.map((d) => {
      const name = this.language === 'mi' ? d.maoriName : d.name;
      return `<li>${escapeHtml(name)}: ${d.score} / 5</li>`;
    }).join('');

    return `
      <section class="export-screen" aria-labelledby="export-title">
        <div class="export-content">
          <h1 id="export-title">${title}</h1>
          <p class="export-description">${description}</p>
          <ul class="export-domain-list">
            ${domainList}
          </ul>
          <div class="export-actions">
            <button type="button" class="btn secondary" data-action="export-back">${backBtn}</button>
            <button type="button" class="btn primary" data-action="export-download">${downloadBtn}</button>
          </div>
        </div>
      </section>`;
  }
}

export { App };

export const bootstrap = (): void => {
  new App();
};

document.addEventListener('DOMContentLoaded', () => {
  bootstrap();
});