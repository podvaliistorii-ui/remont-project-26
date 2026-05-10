import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-commercial',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="fx-page fx-section">
      <div class="fx-page__container">
        <h1 class="fx-title">{{ 'SERVICES.COMMERCIAL_TITLE' | translate }}</h1>
        <div class="fx-text-block">
          <p class="lead">{{ 'PAGE_DESC_COMMERCIAL' | translate }}</p>
          <div class="services-grid">
            <div class="service-card">
              <h3>{{ 'SERVICES.OFFICE' | translate }}</h3>
              <p>Ремонт офисов и коворкингов в Тбилиси.</p>
            </div>
            <div class="service-card">
              <h3>{{ 'SERVICES.SHOP' | translate }}</h3>
              <p>Отделка магазинов, кафе и шоурумов.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; padding-top: 100px; }
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; margin-top: 60px; }
    .service-card { padding: 40px; border: 1px solid var(--fx-line); background: var(--fx-bg); }
    .service-card h3 { font-family: var(--fx-font-serif); font-size: 24px; margin-bottom: 20px; }
  `]
})
export class CommercialComponent {}
