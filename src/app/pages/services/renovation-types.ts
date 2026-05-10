import { Component, inject, AfterViewInit, OnDestroy, PLATFORM_ID, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ServicesService } from '../../services.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

@Component({
  selector: 'app-renovation-types',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="editorial-page">
      <div class="fx-page__container">
        
        <header class="editorial-header">
          <span class="fx-kicker" data-reveal>SERVICE_STRUCTURE_2026</span>
          <h1 class="fx-title fx-serif" data-reveal>{{ 'SERVICES.TYPES_TITLE' | translate }}</h1>
          <div class="header-divider"></div>
        </header>

        <div class="bento-grid">
          @for (type of types(); track type.id) {
            <div class="bento-item" [ngClass]="type.gridClass" [attr.data-id]="type.id">
              <div class="bento-item__parallax-wrap">
                <img [src]="type.image" [alt]="type.titleKey | translate" class="bento-item__img" />
              </div>
              
              <div class="bento-item__content">
                <div class="content-inner">
                  <span class="type-tagline">{{ type.taglineKey | translate }}</span>
                  <h2 class="type-title fx-serif">{{ type.titleKey | translate }}</h2>
                  <div class="type-divider"></div>
                  <p class="type-desc">{{ type.descriptionKey | translate }}</p>
                </div>
              </div>

              <div class="bento-item__overlay"></div>
            </div>
          }
        </div>

      </div>
    </section>
  `,
  styles: [`
    :host { display: block; background: var(--fx-bg); }

    .editorial-page {
      padding: 160px 0 100px;
    }

    .editorial-header {
      margin-bottom: 80px;
      position: relative;
    }

    .header-divider {
      width: 100%;
      height: 0.5px;
      background: var(--fx-accent);
      opacity: 0.3;
      margin-top: 40px;
    }

    /* ── BENTO GRID ── */
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-auto-rows: 250px;
      gap: 24px;
    }

    .bento-item {
      position: relative;
      overflow: hidden;
      border: 1px solid var(--fx-line-strong);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 40px;
      background: #000;
    }

    /* Asymmetric Layout */
    .bento-capital { grid-column: span 8; grid-row: span 2; }
    .bento-designer { grid-column: span 4; grid-row: span 3; }
    .bento-cosmetic { grid-column: span 4; grid-row: span 2; }
    .bento-turnkey  { grid-column: span 8; grid-row: span 1; justify-content: center; }

    .bento-item__parallax-wrap {
      position: absolute;
      top: -10%;
      left: 0;
      width: 100%;
      height: 120%;
      z-index: 1;
    }

    .bento-item__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.6;
      filter: grayscale(20%) contrast(1.1);
    }

    .bento-item__content {
      position: relative;
      z-index: 3;
      max-width: 400px;
    }

    .bento-item__overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
      z-index: 2;
    }

    .type-tagline {
      font-size: 10px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--fx-accent);
      display: block;
      margin-bottom: 12px;
    }

    .type-title {
      font-size: 38px;
      font-weight: 300;
      color: #fff;
      margin-bottom: 20px;
      line-height: 1;
    }

    .type-divider {
      width: 40px;
      height: 0.5px;
      background: var(--fx-accent);
      margin-bottom: 20px;
    }

    .type-desc {
      font-size: 15px;
      line-height: 1.6;
      color: rgba(255,255,255,0.7);
    }

    @media (max-width: 1000px) {
      .bento-grid { grid-auto-rows: min-content; gap: 16px; }
      .bento-item { grid-column: span 12 !important; grid-row: span 1 !important; aspect-ratio: 16/10; padding: 30px; }
      .type-title { font-size: 28px; }
    }
  `]
})
export class RenovationTypesComponent implements AfterViewInit, OnDestroy {
  private readonly servicesService = inject(ServicesService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef);
  
  protected readonly types = this.servicesService.renovationTypes;
  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initParallax();
      this.initReveals();
    }
  }

  private initParallax(): void {
    const items = this.el.nativeElement.querySelectorAll('.bento-item');
    
    items.forEach((item: HTMLElement) => {
      const img = item.querySelector('.bento-item__img');
      if (!img) return;

      const st = ScrollTrigger.create({
        trigger: item,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        animation: gsap.fromTo(img, 
          { y: '-10%' }, 
          { y: '10%', ease: 'none' }
        )
      });
      
      this.triggers.push(st);
    });
  }

  private initReveals(): void {
    const reveals = this.el.nativeElement.querySelectorAll('[data-reveal]');
    reveals.forEach((el: HTMLElement) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });
  }

  ngOnDestroy(): void {
    this.triggers.forEach(st => st.kill());
    ScrollTrigger.getAll().filter(st => st.vars.trigger === this.el.nativeElement).forEach(st => st.kill());
  }
}
