import { Component, inject, input, AfterViewInit, ElementRef, ViewChildren, QueryList, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PortfolioService, Project } from '../../../portfolio.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
})
export class ProjectDetailComponent implements AfterViewInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly platformId = inject(PLATFORM_ID);
  
  readonly id = input.required<string>();
  readonly selectedImage = signal<string | null>(null);

  @ViewChildren('revealText') revealTextElements!: QueryList<ElementRef>;
  
  protected get project(): Project | undefined {
    return this.portfolioService.getProjectById(this.id());
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initTextReveal();
    }
  }

  private initTextReveal(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt((entry.target as HTMLElement).dataset['delay'] || '0');
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-text').forEach(el => {
      const text = el.textContent || '';
      el.textContent = '';
      text.split(/\s+/).filter(Boolean).forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'reveal-word';
        span.style.transitionDelay = `${i * 30}ms`;
        span.textContent = word;
        if (i > 0) {
          el.appendChild(document.createTextNode(' '));
        }
        el.appendChild(span);
      });
      
      observer.observe(el);
    });
  }

  protected openLightbox(url: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.selectedImage.set(url);
    document.body.style.overflow = 'hidden';
  }

  protected closeLightbox(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.selectedImage.set(null);
    document.body.style.overflow = '';
  }
}
