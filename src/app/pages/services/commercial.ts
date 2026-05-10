import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-commercial',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="service-detail fx-section">
      <div class="fx-container">
        <header class="editorial-header">
          <span class="mono technical-label">COMMERCIAL_SYSTEMS_V2</span>
          <h1 class="fx-title fx-serif">{{ 'SERVICES.COMMERCIAL_TITLE' | translate }}</h1>
          <div class="fx-divider is-visible"></div>
        </header>

        <div class="editorial-layout">
          <div class="content-block">
            <h2 class="fx-serif">High-Traffic Performance</h2>
            <p class="lead fx-serif">Офисные и торговые пространства требуют особого подхода к износостойкости и логистике инженерных узлов.</p>
            <p>{{ 'PAGE_DESC_COMMERCIAL' | translate }}</p>
            
            <div class="spec-list mono">
              <div class="spec-item"><span>LOAD_BEARING_CAPACITY</span> <span>EN_1991</span></div>
              <div class="spec-item"><span>FIRE_SAFETY_PROTOCOL</span> <span>CERTIFIED</span></div>
              <div class="spec-item"><span>HVAC_REDUNDANCY</span> <span>OPTIMIZED</span></div>
            </div>
          </div>

          <div class="hero-image-wrap">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80" alt="Commercial" />
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

    @media (max-width: 1000px) { .editorial-layout { display: grid; grid-template-columns: 1fr; gap: 60px; } .content-block { padding-top: 0; order: 2; } .hero-image-wrap { order: 1; } }
  `]
})
export class CommercialComponent {}
