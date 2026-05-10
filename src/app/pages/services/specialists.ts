import { Component, inject, AfterViewInit, OnDestroy, ElementRef, PLATFORM_ID, ViewChildren, QueryList } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ServicesService } from '../../services.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-specialists',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="specialists-registry">
      <div class="fx-page__container">
        
        <header class="registry-header">
          <span class="fx-kicker">TECHNICAL_CREDENTIALS_2026</span>
          <h1 class="fx-title fx-serif">{{ 'SERVICES.SPECIALISTS_TITLE' | translate }}</h1>
          <p class="registry-intro">{{ 'PAGE_DESC_SPECIALISTS' | translate }}</p>
        </header>

        <div class="registry-table">
          <div class="registry-row header-row">
            <div class="cell cell--role">ROLE</div>
            <div class="cell cell--name">NAME</div>
            <div class="cell cell--exp">EXP</div>
            <div class="cell cell--spec">SPECIALIZATION</div>
          </div>

          @for (s of specialists(); track s.id) {
            <div class="registry-row content-row" #row (mouseenter)="showPreview(s.previewImage, $event)" (mouseleave)="hidePreview()">
              <div class="cell cell--role"><span class="mono-badge">{{ s.roleKey | translate }}</span></div>
              <div class="cell cell--name fx-serif">{{ s.nameKey | translate }}</div>
              <div class="cell cell--exp mono">{{ s.experience }} {{ 'SPECIALISTS.EXP_YEARS' | translate }}</div>
              <div class="cell cell--spec">{{ s.specializationKey | translate }}</div>
            </div>
          }
        </div>

      </div>

      <!-- Floating Preview -->
      <div class="floating-preview" #preview>
        <img [src]="currentPreview" alt="Work preview" *ngIf="currentPreview">
        <div class="preview-label">{{ 'SPECIALISTS.VIEW_PREVIEW' | translate }}</div>
      </div>
    </section>

    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json" *ngFor="let s of specialists()">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "{{ s.nameKey | translate }}",
      "jobTitle": "{{ s.roleKey | translate }}",
      "worksFor": {
        "@type": "Organization",
        "name": "FixEntro"
      }
    }
    </script>
  `,
  styles: [`
    :host { display: block; background: var(--fx-bg); min-height: 100vh; }
    .specialists-registry { padding: 160px 0 100px; }
    
    .registry-header { margin-bottom: 100px; max-width: 800px; }
    .registry-intro { font-size: 18px; opacity: 0.6; margin-top: 20px; line-height: 1.6; }

    .registry-table { width: 100%; border-top: 1px solid var(--fx-line-strong); }
    
    .registry-row {
      display: grid;
      grid-template-columns: 200px 300px 150px 1fr;
      padding: 40px 0;
      border-bottom: 1px solid var(--fx-line);
      align-items: center;
      transition: background 0.3s ease;
      position: relative;
    }

    .header-row { padding: 15px 0; opacity: 0.3; font-size: 10px; letter-spacing: 0.2em; font-weight: 800; border-bottom: 1px solid var(--fx-line-strong); }
    
    .cell--role .mono-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      padding: 6px 12px;
      border: 1px solid var(--fx-accent);
      color: var(--fx-accent);
      text-transform: uppercase;
    }

    .cell--name { font-size: 32px; font-weight: 300; }
    .cell--exp { opacity: 0.5; font-size: 14px; }
    .cell--spec { font-size: 16px; opacity: 0.8; max-width: 500px; }

    .mono { font-family: 'JetBrains Mono', monospace; }

    /* Floating Preview */
    .floating-preview {
      position: fixed;
      width: 300px;
      height: 400px;
      pointer-events: none;
      z-index: 100;
      opacity: 0;
      visibility: hidden;
      overflow: hidden;
      background: #000;
    }

    .floating-preview img { width: 100%; height: 100%; object-fit: cover; opacity: 0.7; transform: scale(1.1); transition: transform 0.6s ease; }
    .preview-label { position: absolute; bottom: 20px; left: 20px; font-size: 10px; color: #fff; letter-spacing: 0.2em; }

    @media (max-width: 1000px) {
      .registry-row { grid-template-columns: 1fr; gap: 20px; padding: 30px 0; }
      .header-row { display: none; }
      .cell--name { font-size: 24px; }
    }
  `]
})
export class SpecialistsComponent implements AfterViewInit, OnDestroy {
  private readonly servicesService = inject(ServicesService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef);
  
  protected readonly specialists = this.servicesService.specialists;
  protected currentPreview: string | null = null;

  @ViewChildren('row') rows!: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initMagneticRows();
    }
  }

  private initMagneticRows(): void {
    this.rows.forEach(row => {
      const el = row.nativeElement;
      
      el.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = (e.clientX - centerX) * 0.1;
        const y = (e.clientY - centerY) * 0.2;

        gsap.to(el, {
          x: x,
          y: y,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
      });
    });
  }

  showPreview(img: string, event: MouseEvent): void {
    this.currentPreview = img;
    const previewEl = this.el.nativeElement.querySelector('.floating-preview');
    if (!previewEl) return;

    gsap.set(previewEl, { visibility: 'visible' });
    gsap.to(previewEl, {
      opacity: 1,
      duration: 0.4,
      x: event.clientX + 30,
      y: event.clientY - 200,
      overwrite: 'auto'
    });
    
    // Update position on move
    const moveFn = (e: MouseEvent) => {
      gsap.to(previewEl, {
        x: e.clientX + 30,
        y: e.clientY - 200,
        duration: 0.2
      });
    };
    window.addEventListener('mousemove', moveFn);
    (previewEl as any)._moveFn = moveFn;
  }

  hidePreview(): void {
    const previewEl = this.el.nativeElement.querySelector('.floating-preview');
    if (!previewEl) return;

    gsap.to(previewEl, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        gsap.set(previewEl, { visibility: 'hidden' });
        window.removeEventListener('mousemove', (previewEl as any)._moveFn);
      }
    });
  }

  ngOnDestroy(): void {}
}
