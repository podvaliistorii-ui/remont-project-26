import { Component, AfterViewInit, inject, PLATFORM_ID, ElementRef, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preloader.html',
  styleUrl: './preloader.scss',
})
export class PreloaderComponent implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef);

  protected readonly logs = signal<string[]>([]);
  private readonly systemLogs = [
    'INITIALIZING_CORE_ENGINE...',
    'LOADING_TBILISI_DISTRICT_COORDINATES...',
    'VAKE_MODULE_LOADED',
    'SABURTALO_MODULE_LOADED',
    'MTATSMINDA_MODULE_LOADED',
    'CALCULATING_PRICE_INDEX_2026',
    'SYNCING_KNAUF_MATERIALS_DB',
    'OPTIMIZING_LAYOUT_GEOMETRY',
    'FETCHING_PORTFOLIO_MEDIA',
    'FIXENTRO_SYSTEM_READY'
  ];

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startInitialization();
    }
  }

  private startInitialization() {
    const tl = gsap.timeline({
      onComplete: () => this.removePreloader()
    });

    // 1. Logo Draw Animation
    const paths = this.el.nativeElement.querySelectorAll('.logo-path');
    tl.fromTo(paths, 
      { strokeDasharray: 500, strokeDashoffset: 500 },
      { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', stagger: 0.1 }
    );

    // 2. System Logs Simulation
    let logIdx = 0;
    const logInterval = setInterval(() => {
      if (logIdx < this.systemLogs.length) {
        this.logs.update(current => [...current, this.systemLogs[logIdx]]);
        logIdx++;
      } else {
        clearInterval(logInterval);
      }
    }, 150);

    // 3. Counter Animation
    const counter = { val: 0 };
    tl.to(counter, {
      val: 100,
      duration: 2.5,
      ease: 'none',
      onUpdate: () => {
        const pEl = this.el.nativeElement.querySelector('.preloader-num');
        if (pEl) pEl.textContent = Math.round(counter.val).toString().padStart(3, '0');
      }
    }, 0);

    // 4. Reveal App
    tl.to('.preloader-overlay', {
      yPercent: -100,
      duration: 1.2,
      ease: 'expo.inOut',
      delay: 0.5
    });

    // Pulse visualization
    tl.to('.pulse-bar', {
      scaleY: 0,
      opacity: 0,
      duration: 0.8,
      ease: 'power4.in'
    }, '-=0.5');
  }

  private removePreloader() {
    this.el.nativeElement.remove();
  }
}
