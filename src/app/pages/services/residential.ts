import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-residential',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="service-detail fx-section">
      <div class="fx-container">
        <header class="editorial-header">
          <span class="mono technical-label">DOMESTIC_INFRASTRUCTURE</span>
          <h1 class="fx-title fx-serif">{{ 'SERVICES.RESIDENTIAL_TITLE' | translate }}</h1>
          <div class="fx-divider is-visible"></div>
        </header>

        <div class="editorial-layout">
          <div class="hero-image-wrap">
            <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80" alt="Residential" />
          </div>

          <div class="content-block">
            <h2 class="fx-serif">High-End Living Standards</h2>
            <p class="lead fx-serif">Мы проектируем не просто интерьеры, а сложные жилые системы, где эстетика неотделима от инженерной точности.</p>
            <p>{{ 'PAGE_DESC_RESIDENTIAL' | translate }}</p>
            
            <div class="spec-list mono">
              <div class="spec-item"><span>ACOUSTIC_ISOLATION</span> <span>LEVEL_A</span></div>
              <div class="spec-item"><span>SMART_HUB_INTEGRATION</span> <span>READY</span></div>
              <div class="spec-item"><span>MATERIAL_ORIGIN</span> <span>EU_CERTIFIED</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; background: var(--fx-bg); }
    .editorial-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: start; }
    .hero-image-wrap { width: 100%; aspect-ratio: 4/5; overflow: hidden; border: 1px solid var(--fx-line); img { width: 100%; height: 100%; object-fit: cover; } }
    .content-block { padding-top: 100px; .lead { font-size: 28px; line-height: 1.3; color: var(--fx-accent); margin-bottom: 40px; } }
    .spec-list { margin-top: 80px; border-top: 1px solid var(--fx-line); .spec-item { display: flex; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid var(--fx-line); font-size: 9px; opacity: 0.5; } }

    @media (max-width: 1000px) { .editorial-layout { grid-template-columns: 1fr; gap: 60px; } .content-block { padding-top: 0; } }
  `]
})
export class ResidentialComponent {}
