import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-specialists',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="fx-page fx-section">
      <div class="fx-page__container">
        <h1 class="fx-title">{{ 'SERVICES.SPECIALISTS_TITLE' | translate }}</h1>
        <div class="fx-text-block">
          <p class="lead">{{ 'PAGE_DESC_SPECIALISTS' | translate }}</p>
          <div class="services-grid">
            <div class="service-card">
              <h3>{{ 'SERVICES.PLUMBER' | translate }}</h3>
              <p>Услуги сантехника в Тбилиси | Срочный вызов.</p>
            </div>
            <div class="service-card">
              <h3>{{ 'SERVICES.ELECTRICIAN' | translate }}</h3>
              <p>Услуги электрика: монтаж щитов, разводка.</p>
            </div>
            <div class="service-card">
              <h3>{{ 'SERVICES.TILER' | translate }}</h3>
              <p>Профессиональная укладка плитки и керамогранита.</p>
            </div>
            <div class="service-card">
              <h3>{{ 'SERVICES.MASTER' | translate }}</h3>
              <p>Мастер на час для мелкого бытового ремонта.</p>
            </div>
            <div class="service-card">
              <h3>{{ 'SERVICES.WASTE' | translate }}</h3>
              <p>Вывоз строительного мусора после ремонта.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; padding-top: 100px; }
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; margin-top: 60px; }
    .service-card { padding: 40px; border: 1px solid var(--fx-line); background: var(--fx-bg); }
    .service-card h3 { font-family: var(--fx-font-serif); font-size: 24px; margin-bottom: 20px; }
  `]
})
export class SpecialistsComponent {}
