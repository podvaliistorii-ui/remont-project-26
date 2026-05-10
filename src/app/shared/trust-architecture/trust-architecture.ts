import { Component, inject, signal, AfterViewInit, OnDestroy, ElementRef, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ServicesService, Review } from '../../services.service';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-trust-architecture',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  template: `
    <section class="trust-section fx-page">
      <div class="fx-page__container">
        
        <header class="trust-header" data-reveal>
          <span class="fx-kicker">{{ 'REVIEWS.TRUST_KICKER' | translate }}</span>
          <h2 class="fx-serif">{{ 'REVIEWS.TRUST_TITLE' | translate }}</h2>
        </header>

        <!-- Certificate Grid -->
        <div class="certificate-grid">
          @for (rev of reviews(); track rev.id) {
            <div class="cert-card" [attr.data-id]="rev.id">
              <div class="cert-hologram"></div>
              <div class="cert-content">
                <div class="cert-header">
                  <span class="mono">{{ rev.date }}</span>
                  <div class="verified-badge">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                    <span>{{ 'REVIEWS.VERIFIED' | translate }}</span>
                  </div>
                </div>

                <p class="cert-text fx-serif">"{{ rev.textKey | translate }}"</p>
                
                <div class="cert-footer">
                  <span class="client-name">{{ rev.clientName }}</span>
                  <a [routerLink]="['/portfolio', rev.projectId]" class="view-project-link mono">VIEW_CASE_STUDY &nearrow;</a>
                </div>
              </div>
              <div class="cert-watermark">FIXENTRO_APPROVED</div>
            </div>
          }
        </div>

        <!-- Vendor Marquee -->
        <div class="vendor-marquee">
          <div class="marquee-track">
            <span *ngFor="let v of vendors" class="vendor-logo mono">{{ v }}</span>
            <span *ngFor="let v of vendors" class="vendor-logo mono">{{ v }}</span>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    :host { display: block; background: var(--fx-bg); }
    .trust-section { padding: 160px 0 100px; overflow: hidden; }
    .trust-header { margin-bottom: 80px; text-align: center; }

    .certificate-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 40px;
      margin-bottom: 120px;
    }

    .cert-card {
      position: relative;
      background: #fbfbf9;
      color: #1a1a18;
      padding: 60px;
      border: 1px solid #e2e2e0;
      overflow: hidden;
      transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
      
      [data-theme='dark'] & { background: #111110; color: #fff; border-color: #222; }

      &:hover {
        transform: translateY(-10px);
        .cert-hologram { opacity: 0.15; }
      }
    }

    .cert-hologram {
      position: absolute; inset: 0;
      background: linear-gradient(135deg, #ff00ff, #00f, #00ff00, #ff0, #ff00ff);
      background-size: 400% 400%;
      opacity: 0; pointer-events: none;
      mix-blend-mode: color-dodge;
      transition: opacity 0.6s;
      animation: holoMove 10s infinite linear;
    }

    @keyframes holoMove { 0% { background-position: 0% 0%; } 100% { background-position: 100% 100%; } }

    .cert-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; .mono { font-size: 10px; opacity: 0.4; } }
    
    .verified-badge {
      display: flex; align-items: center; gap: 8px;
      font-size: 9px; font-weight: 800; letter-spacing: 0.1em; color: var(--fx-accent);
      svg { width: 12px; height: 12px; }
    }

    .cert-text { font-size: 28px; line-height: 1.3; margin-bottom: 60px; font-weight: 300; }

    .cert-footer {
      display: flex; justify-content: space-between; align-items: baseline;
      .client-name { font-size: 14px; font-weight: 600; opacity: 0.8; }
      .view-project-link { font-size: 10px; text-decoration: none; color: var(--fx-accent); }
    }

    .cert-watermark {
      position: absolute; bottom: -20px; right: -20px;
      font-size: 60px; font-weight: 900; opacity: 0.03;
      transform: rotate(-15deg); pointer-events: none;
    }

    /* ── MARQUEE ── */
    .vendor-marquee {
      width: 100vw; margin-left: calc(-50vw + 50%);
      border-top: 1px solid var(--fx-line);
      border-bottom: 1px solid var(--fx-line);
      padding: 40px 0;
      overflow: hidden;
    }

    .marquee-track {
      display: flex; gap: 80px; width: max-content;
      animation: marqueeScroll 40s infinite linear;
      &:hover { animation-play-state: paused; }
    }

    .vendor-logo { font-size: 40px; font-weight: 300; opacity: 0.2; letter-spacing: 0.2em; }

    @keyframes marqueeScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

    @media (max-width: 900px) {
      .certificate-grid { grid-template-columns: 1fr; }
      .cert-card { padding: 40px; }
      .cert-text { font-size: 22px; }
    }
  `]
})
export class TrustArchitectureComponent {
  private readonly services = inject(ServicesService);
  protected readonly reviews = this.services.reviews;
  protected readonly vendors = ['KNAUF', 'REHAU', 'CAPAROL', 'MAPEI', 'SCHNEIDER', 'GROHE', 'ANTOLINI'];
}
