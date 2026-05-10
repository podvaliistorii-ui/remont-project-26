import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-renovation-types',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="fx-page fx-section">
      <div class="fx-page__container">
        <h1 class="fx-title">{{ 'SERVICES.TYPES_TITLE' | translate }}</h1>
        <div class="fx-text-block">
          <p class="lead">{{ 'PAGE_DESC_RENOVATION' | translate }}</p>
          <div class="services-grid">
            <div class="service-card">
              <h3>{{ 'SERVICES.CAPITAL' | translate }}</h3>
              <p>Полная реконструкция с заменой коммуникаций.</p>
            </div>
            <div class="service-card">
              <h3>{{ 'SERVICES.COSMETIC' | translate }}</h3>
              <p>Обновление отделки без изменения конструкций.</p>
            </div>
            <div class="service-card">
              <h3>{{ 'SERVICES.DESIGNER' | translate }}</h3>
              <p>Эксклюзивный проект и премиальные материалы.</p>
            </div>
            <div class="service-card">
              <h3>{{ 'SERVICES.TURNKEY' | translate }}</h3>
              <p>ბინის სრული რემონტი თბილისი.</p>
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
export class RenovationTypesComponent {}
