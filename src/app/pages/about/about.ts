import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../language.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="about-hero fx-section">
      <div class="fx-container">
        <header class="editorial-header">
          <span class="mono technical-label" data-reveal>MANIFESTO_V1.0</span>
          <h1 class="fx-title fx-serif" data-reveal>{{ 'ABOUT.TITLE' | translate }}</h1>
          <div class="fx-divider is-visible"></div>
        </header>

        <div class="editorial-grid">
          <div class="editorial-text">
            <p class="lead fx-serif">{{ 'ABOUT.TEXT_1' | translate }}</p>
            <p>{{ 'ABOUT.TEXT_2' | translate }}</p>
          </div>
          
          <div class="editorial-stats">
            <div class="stat-item">
              <span class="stat-val fx-serif">12+</span>
              <span class="mono">YEARS_EXP</span>
            </div>
            <div class="stat-item">
              <span class="stat-val fx-serif">250+</span>
              <span class="mono">AUDITS_DONE</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Methodology Section integrated into About -->
    <section class="about-methodology fx-section">
      <div class="fx-container">
        <header class="section-header">
          <span class="mono technical-label">OPERATIONAL_PROTOCOL</span>
          <h2 class="fx-serif">FixEntro მეთოდოლოგია</h2>
        </header>

        <div class="methodology-timeline">
          <div class="method-step" *ngFor="let i of [1,2,3,4]">
            <div class="step-num fx-serif">0{{i}}</div>
            <div class="step-content">
              <h3 class="fx-serif">Architectural Audit</h3>
              <p>Precise analysis of existing structures and utility networks before any intervention.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; background: var(--fx-bg); }
    .editorial-header { margin-bottom: 100px; }
    .editorial-grid { display: grid; grid-template-columns: 1fr 300px; gap: 120px; }
    .editorial-text .lead { font-size: 32px; line-height: 1.2; margin-bottom: 60px; color: var(--fx-accent); }
    
    .editorial-stats { display: flex; flex-direction: column; gap: 60px; border-left: 1px solid var(--fx-line); padding-left: 60px; }
    .stat-item { display: flex; flex-direction: column; .stat-val { font-size: 64px; line-height: 1; margin-bottom: 10px; } }

    .methodology-timeline { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 60px; margin-top: 100px; }
    .method-step { border-top: 1px solid var(--fx-line); padding-top: 40px; .step-num { font-size: 48px; opacity: 0.2; margin-bottom: 20px; transition: opacity 0.3s; } &:hover .step-num { opacity: 1; color: var(--fx-accent); } }

    @media (max-width: 1000px) {
      .editorial-grid { grid-template-columns: 1fr; gap: 60px; }
      .editorial-stats { flex-direction: row; border-left: none; padding-left: 0; border-top: 1px solid var(--fx-line); padding-top: 60px; gap: 40px; }
    }
  `]
})
export class AboutComponent {
  protected readonly i18n = inject(LanguageService);
}
