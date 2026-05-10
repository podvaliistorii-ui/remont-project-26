import { Component } from '@angular/core';
import { CommonModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-residential',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="fx-page fx-section">
      <div class="fx-page__container">
        <h1 class="fx-title">{{ 'SERVICES.RESIDENTIAL_TITLE' | translate }}</h1>
        <div class="fx-text-block">
          <p class="lead">{{ 'PAGE_DESC_RESIDENTIAL' | translate }}</p>
          <div class="services-grid">
            <div class="service-card">
              <h3>{{ 'SERVICES.APARTMENT' | translate }}</h3>
              <p>Ремонт квартир в Тбилиси цена за м2.</p>
            </div>
            <div class="service-card">
              <h3>{{ 'SERVICES.HOUSE' | translate }}</h3>
              <p>Строительство и отделка частных домов.</p>
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
export class ResidentialComponent {}
