import { Component, inject, signal, computed, ElementRef, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ServicesService, Material } from '../../services.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="materials-library fx-page">
      <div class="fx-page__container">
        
        <header class="materials-header" data-reveal>
          <span class="fx-kicker">PHYSICAL_SPECIFICATIONS_2026</span>
          <h1 class="fx-title fx-serif">Material Science</h1>
          <p class="materials-intro">Technical precision meets architectural aesthetics. Explore our core material library.</p>
        </header>

        <div class="materials-grid">
          @for (m of materials(); track m.id) {
            <div class="material-card" [attr.data-id]="m.id">
              <div class="material-visual">
                <img [src]="m.image" [alt]="m.nameKey | translate" />
                <div class="material-glint"></div>
              </div>
              
              <div class="material-content">
                <div class="material-meta">
                  <span class="mono brand">{{ m.brand }}</span>
                  <span class="category-tag">{{ m.category }}</span>
                </div>
                
                <h3 class="material-name fx-serif">{{ m.nameKey | translate }}</h3>
                
                <div class="material-specs">
                  <span class="specs-label mono">{{ 'MATERIALS.SPECS_TITLE' | translate }}</span>
                  <div class="spec-row" *ngFor="let s of m.specs">
                    <span class="mono s-label">{{ s.label }}</span>
                    <span class="mono s-val">{{ s.value }}</span>
                  </div>
                </div>

                <button class="add-to-calc-btn" (click)="addToEstimate(m)">
                  <span class="mono">{{ 'MATERIALS.ADD_TO_ESTIMATE' | translate }}</span>
                  <span class="price-impact">+ ₾ {{ m.priceMod }}</span>
                </button>
              </div>
            </div>
          }
        </div>

      </div>
    </section>
  `,
  styles: [`
    :host { display: block; background: var(--fx-bg); }
    .materials-library { padding: 160px 0 100px; }
    .materials-header { margin-bottom: 80px; }
    .materials-intro { font-size: 18px; opacity: 0.6; margin-top: 20px; max-width: 600px; }

    .materials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 40px;
    }

    .material-card {
      border: 1px solid var(--fx-line);
      background: var(--fx-bg);
      overflow: hidden;
      transition: border-color 0.3s;
      &:hover { border-color: var(--fx-accent); .material-visual img { transform: scale(1.1); } .material-glint { opacity: 1; } }
    }

    .material-visual {
      width: 100%; aspect-ratio: 1/1; overflow: hidden; position: relative;
      img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
    }

    .material-glint {
      position: absolute; inset: 0;
      background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%);
      background-size: 200% 200%;
      opacity: 0; pointer-events: none;
      transition: opacity 0.3s;
      animation: glintMove 4s infinite linear;
    }

    @keyframes glintMove { 0% { background-position: 200% 200%; } 100% { background-position: -200% -200%; } }

    .material-content { padding: 40px; }

    .material-meta { display: flex; justify-content: space-between; margin-bottom: 20px; .brand { font-size: 10px; opacity: 0.4; letter-spacing: 0.2em; } .category-tag { font-size: 8px; border: 1px solid var(--fx-line); padding: 2px 8px; border-radius: 10px; text-transform: uppercase; } }

    .material-name { font-size: 24px; margin-bottom: 30px; font-weight: 300; }

    .material-specs {
      margin-bottom: 40px;
      .specs-label { font-size: 8px; opacity: 0.3; display: block; margin-bottom: 15px; letter-spacing: 0.1em; }
      .spec-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); .s-label { font-size: 10px; opacity: 0.5; } .s-val { font-size: 10px; color: var(--fx-accent); } }
    }

    .add-to-calc-btn {
      width: 100%; padding: 20px; background: transparent; border: 1px solid var(--fx-accent); color: var(--fx-accent);
      display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.3s;
      &:hover { background: var(--fx-accent); color: var(--fx-bg); }
      .price-impact { font-size: 12px; font-weight: 800; }
    }

    @media (max-width: 600px) { .materials-grid { grid-template-columns: 1fr; } .material-content { padding: 30px; } }
  `]
})
export class MaterialsComponent {
  private readonly services = inject(ServicesService);
  protected readonly materials = this.services.materials;

  addToEstimate(m: Material) {
    // Logic to bridge to EstimateService or simply notify
    console.log('Added to estimate:', m.nameKey);
    // Future: this.estimate.addMaterial(m);
  }
}
