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
  private showFullscreenChart = false;
  private showMenu = false;
  private showSbomOverlay = false;

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
        const data = exportState();
        if (data) {
          const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
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

      if (target.matches('[data-action="chart-expand"]')) {
        this.showFullscreenChart = true;
        this.render();
        return;
      }

      if (target.matches('[data-action="chart-close"]')) {
        this.showFullscreenChart = false;
        this.render();
        return;
      }

      if (target.matches('.chart-value-level-polygons polygon')) {
        const level = parseInt(target.getAttribute('data-chart-level') || '0', 10);
        if (level >= 1 && level <= 5 && this.state.currentStep > 0 && !this.state.showSummary) {
          const domain = this.state.domains[this.state.currentStep - 1];
          if (domain) {
            domain.score = level;
            saveState(this.state.domains);
            this.render();
          }
        }
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

      if (target.matches('[data-action="toggle-menu"]')) {
        this.showMenu = !this.showMenu;
        this.render();
        return;
      }

      if (target.matches('[data-action="close-menu"]')) {
        this.showMenu = false;
        this.render();
        return;
      }

      if (target.matches('[data-action="open-sbom"]')) {
        this.showMenu = false;
        this.showSbomOverlay = true;
        this.render();
        return;
      }

      if (target.matches('[data-action="close-sbom"]')) {
        this.showSbomOverlay = false;
        this.render();
        return;
      }
    });

    document.addEventListener('mousedown', (e) => {
      const target = e.target as HTMLElement;

      if (target.matches('.chart-dot')) {
        const domainId = target.getAttribute('data-domain');
        if (domainId && this.state.currentStep > 0 && !this.state.showSummary) {
          const domain = this.state.domains[this.state.currentStep - 1];
          if (domain && domain.id === domainId) {
            this.startDotDrag(e as MouseEvent, domainId);
          }
        }
        return;
      }

      if (target.matches('.chart-data')) {
        if (this.state.currentStep > 0 && !this.state.showSummary) {
          this.startChartDrag(e as MouseEvent);
        }
        return;
      }
    });

    document.addEventListener('touchstart', (e) => {
      const target = e.target as HTMLElement;

      if (target.matches('.chart-dot')) {
        const domainId = target.getAttribute('data-domain');
        if (domainId && this.state.currentStep > 0 && !this.state.showSummary) {
          const domain = this.state.domains[this.state.currentStep - 1];
          if (domain && domain.id === domainId) {
            this.startDotDrag(e as TouchEvent, domainId);
          }
        }
        return;
      }

      if (target.matches('.chart-data')) {
        if (this.state.currentStep > 0 && !this.state.showSummary) {
          this.startChartDrag(e as TouchEvent);
        }
        return;
      }
    }, { passive: false });

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
              importState(parsed.domains);
              this.state = {
                domains: cloneDomains(parsed.domains),
                currentStep: 0,
                showSummary: false
              };
              this.render();
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

  private updateSlider(id: string, score: number): void {
    const slider = document.querySelector(`input[type="range"][data-score="${id}"]`) as HTMLInputElement | null;
    if (slider) {
      slider.value = String(score);
      slider.setAttribute('aria-valuenow', String(score));
    }
  }

  private addDragClass(): void {
    const svg = document.querySelector('.radar-svg');
    if (svg) svg.classList.add('chart-dragging');
  }

  private removeDragClass(): void {
    const svg = document.querySelector('.radar-svg');
    if (svg) svg.classList.remove('chart-dragging');
  }

  private startDotDrag(e: MouseEvent | TouchEvent, domainId: string): void {
    const svg = document.querySelector('.radar-svg') as SVGSVGElement | null;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();

    const size = 280;
    const center = size / 2;
    const maxRadius = 110;
    const domain = this.state.domains[this.state.currentStep - 1];
    if (!domain) return;

    const domainIndex = this.state.domains.findIndex((d) => d.id === domainId);
    if (domainIndex < 0) return;

    const clientX = 'touches' in e ? (e as TouchEvent).touches[0]!.clientX : e.clientX;
    const clientY = 'touches' in e ? (e as TouchEvent).touches[0]!.clientY : e.clientY;

    const svgX = ((clientX - rect.left) / (rect.width ?? size)) * size;
    const svgY = ((clientY - rect.top) / (rect.height ?? size)) * size;

    const dx = svgX - center;
    const dy = svgY - center;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const clampedDistance = Math.max(0, Math.min(distance, maxRadius));
    const newScore = Math.max(1, Math.min(5, Math.round((clampedDistance / maxRadius) * 5)));

    if (newScore !== domain.score) {
      domain.score = newScore;
      saveState(this.state.domains);
      this.updateChart();
      this.updateScoreDisplay(domainId, newScore);
      this.updateSlider(domainId, newScore);
    }

    this.addDragClass();

    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      moveEvent.preventDefault();
      const moveClientX = 'touches' in moveEvent ? (moveEvent as unknown as TouchEvent).touches[0]!.clientX : moveEvent.clientX;
      const moveClientY = 'touches' in moveEvent ? (moveEvent as unknown as TouchEvent).touches[0]!.clientY : moveEvent.clientY;

      const svgX = ((moveClientX - rect.left) / (rect.width ?? size)) * size;
      const svgY = ((moveClientY - rect.top) / (rect.height ?? size)) * size;

      const dx = svgX - center;
      const dy = svgY - center;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const clampedDistance = Math.max(0, Math.min(distance, maxRadius));
      const newScore = Math.max(1, Math.min(5, Math.round((clampedDistance / maxRadius) * 5)));

      if (newScore !== domain.score) {
        domain.score = newScore;
        saveState(this.state.domains);
        this.updateChart();
        this.updateScoreDisplay(domainId, newScore);
        this.updateSlider(domainId, newScore);
      }
    };

    const upHandler = () => {
      this.removeDragClass();
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('touchend', upHandler);
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
    document.addEventListener('touchmove', moveHandler, { passive: false });
    document.addEventListener('touchend', upHandler);
  }

  private startChartDrag(e: MouseEvent | TouchEvent): void {
    const svg = document.querySelector('.radar-svg') as SVGSVGElement | null;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const size = 280;
    const center = size / 2;
    const maxRadius = 110;
    const domains = this.state.domains;
    const currentStep = this.state.currentStep;
    if (currentStep <= 0 || this.state.showSummary) return;

    const domain = domains[currentStep - 1];
    if (!domain) return;

    const clientX = 'touches' in e ? (e as TouchEvent).touches[0]!.clientX : e.clientX;
    const clientY = 'touches' in e ? (e as TouchEvent).touches[0]!.clientY : e.clientY;

    console.log('startChartDrag', clientX, clientY, 'rect:', rect.left, rect.top, rect.width, rect.height);

    const svgX = ((clientX - rect.left) / (rect.width ?? size)) * size;
    const svgY = ((clientY - rect.top) / (rect.height ?? size)) * size;

    const dx = svgX - center;
    const dy = svgY - center;
    const angle = Math.atan2(dy, dx);

    const n = domains.length;
    const angleStep = (Math.PI * 2) / n;
    const startAngle = -Math.PI / 2;

    let closestDomainIndex = 0;
    let closestAngleDiff = Infinity;

    for (let i = 0; i < n; i++) {
      const domainAngle = startAngle + i * angleStep;
      let diff = Math.abs(angle - domainAngle);
      if (diff > Math.PI) diff = 2 * Math.PI - diff;
      if (diff < closestAngleDiff) {
        closestAngleDiff = diff;
        closestDomainIndex = i;
      }
    }

    const targetDomain = domains[closestDomainIndex]!;
    const targetDomainId = targetDomain.id;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const clampedDistance = Math.max(0, Math.min(distance, maxRadius));
    const initialScore = Math.max(1, Math.min(5, Math.round((clampedDistance / maxRadius) * 5)));

    if (initialScore !== targetDomain.score) {
      targetDomain.score = initialScore;
      saveState(this.state.domains);
      this.updateChart();
      this.updateScoreDisplay(targetDomainId, initialScore);
      this.updateSlider(targetDomainId, initialScore);
    }

    this.addDragClass();

    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      moveEvent.preventDefault();
      const moveClientX = 'touches' in moveEvent ? (moveEvent as unknown as TouchEvent).touches[0]!.clientX : moveEvent.clientX;
      const moveClientY = 'touches' in moveEvent ? (moveEvent as unknown as TouchEvent).touches[0]!.clientY : moveEvent.clientY;

      const svgX = ((moveClientX - rect.left) / (rect.width ?? size)) * size;
      const svgY = ((moveClientY - rect.top) / (rect.height ?? size)) * size;

      const dx = svgX - center;
      const dy = svgY - center;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const clampedDistance = Math.max(0, Math.min(distance, maxRadius));
    const newScore = Math.max(1, Math.min(5, Math.round((clampedDistance / maxRadius) * 5)));

    if (newScore !== targetDomain.score) {
      targetDomain.score = newScore;
      saveState(this.state.domains);
      this.updateChart();
      this.updateScoreDisplay(targetDomainId, newScore);
      this.updateSlider(targetDomainId, newScore);
    }
    };

    const upHandler = () => {
      this.removeDragClass();
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('touchend', upHandler);
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
    document.addEventListener('touchmove', moveHandler, { passive: false });
    document.addEventListener('touchend', upHandler);
  }

  private updateChart(): void {
    setTimeout(() => {
      if (document.getElementById('live-chart')) {
        drawChart('live-chart', this.state.domains);
      }
      if (document.getElementById('summary-chart')) {
        drawChart('summary-chart', this.state.domains);
      }
    }, 0);
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

    let mainContent = '';
    if (this.showLanguageSelector) {
      mainContent = this.renderLanguageSelector();
    } else if (this.showExportScreen) {
      mainContent = this.renderExportScreen();
    } else if (this.state.currentStep === 0) {
      mainContent = this.renderWelcome();
    } else if (this.showFullscreenChart) {
      mainContent = this.renderFullscreenChart();
      this.updateFullscreenChart();
    } else if (this.state.showSummary) {
      mainContent = this.renderSummary();
      this.updateChart();
    } else {
      mainContent = this.renderAssessment();
      this.updateChart();
    }

    app.innerHTML = `
      <header class="app-header">
        <h1 class="app-title">Te Whare Tapa Whā</h1>
        <button type="button" class="hamburger-btn" data-action="toggle-menu" aria-label="Menu" aria-expanded="${this.showMenu}">
          <span class="hamburger-icon" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </header>
      <main id="app-main">
        ${mainContent}
      </main>
      ${this.showMenu ? this.renderMenuOverlay() : ''}
      ${this.showSbomOverlay ? this.renderSbomOverlay() : ''}
    `;
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
            <button type="button" class="chart-expand-btn" data-action="chart-expand" aria-label="Expand chart">⛶</button>
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
            <button type="button" class="chart-expand-btn" data-action="chart-expand" aria-label="Expand chart">⛶</button>
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
            <input type="file" accept=".json" data-import-input style="display: none;" aria-label="${importBtn}" />
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

  private renderFullscreenChart(): string {
    const title = escapeHtml(t('chart.fullscreenTitle', this.language));
    const closeBtn = escapeHtml(t('nav.back', this.language));

    const chartContent = this.state.showSummary
      ? '<div class="chart-container" id="fullscreen-chart" role="img" aria-label="' + escapeHtml(t('chart.summaryAriaLabel', this.language)) + '"></div>'
      : '<div class="chart-container" id="fullscreen-chart" role="img" aria-label="' + escapeHtml(t('chart.liveAriaLabel', this.language)) + '"></div>';

    return `
      <section class="fullscreen-chart" aria-labelledby="fullscreen-chart-title">
        <div class="fullscreen-chart-content">
          <h1 id="fullscreen-chart-title">${title}</h1>
          ${chartContent}
          <button type="button" class="btn secondary chart-close" data-action="chart-close">${closeBtn}</button>
        </div>
      </section>`;
  }

  private updateFullscreenChart(): void {
    setTimeout(() => {
      if (this.state.showSummary || this.state.currentStep > 0) {
        drawChart('fullscreen-chart', this.state.domains);
      }
    }, 0);
  }

  private renderMenuOverlay(): string {
    const menuTitle = escapeHtml(t('menu.title', this.language));
    const sbomLabel = escapeHtml(t('menu.sbom', this.language));

    return `
      <div class="overlay menu-overlay" role="dialog" aria-modal="true" aria-labelledby="menu-title">
        <div class="overlay-header">
          <h2 id="menu-title">${menuTitle}</h2>
          <button type="button" class="overlay-close" data-action="close-menu" aria-label="Close menu">✕</button>
        </div>
        <ul class="menu-list">
          <li class="menu-item">
            <button type="button" class="btn secondary" data-action="open-sbom">${sbomLabel}</button>
          </li>
        </ul>
      </div>`;
  }

  private renderSbomOverlay(): string {
    const title = escapeHtml(t('menu.sbom', this.language));

    return `
      <div class="overlay sbom-overlay" role="dialog" aria-modal="true" aria-labelledby="sbom-title">
        <div class="overlay-header">
          <h2 id="sbom-title">${title}</h2>
          <button type="button" class="overlay-close" data-action="close-sbom" aria-label="Close SBOM viewer">✕</button>
        </div>
        <iframe src="/sbom-viewer.html" class="sbom-frame" title="${title}"></iframe>
      </div>`;
  }
}

export { App };

export const bootstrap = (): void => {
  new App();
};

document.addEventListener('DOMContentLoaded', () => {
  bootstrap();
});