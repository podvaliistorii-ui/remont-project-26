import { Component, inject, AfterViewInit, OnDestroy, PLATFORM_ID, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { LanguageService } from '../../language.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  protected readonly i18n = inject(LanguageService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef);
  private revealObserver?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initRevealObserver();
    }
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
  }

  private initRevealObserver(): void {
    const host = this.el.nativeElement as HTMLElement;
    const revealElements = Array.from(
      host.querySelectorAll<HTMLElement>('[data-reveal]')
    );

    if (!revealElements.length) {
      return;
    }

    host.classList.add('about-reveal-ready');

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const eagerRevealDistance = viewportHeight * 1.35;

    this.revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          this.revealObserver?.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: '520px 0px 520px 0px'
    });

    revealElements.forEach(el => {
      if (el.getBoundingClientRect().top < eagerRevealDistance) {
        el.classList.add('is-visible');
        return;
      }

      this.revealObserver?.observe(el);
    });
  }
}
