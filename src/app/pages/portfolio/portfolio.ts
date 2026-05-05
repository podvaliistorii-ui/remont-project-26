import { Component, inject, AfterViewInit, PLATFORM_ID, ElementRef, ViewChild, OnDestroy, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { LanguageService } from '../../language.service';
import { PortfolioService } from '../../portfolio.service';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
})
export class PortfolioComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  protected readonly i18n = inject(LanguageService);
  private readonly portfolioService = inject(PortfolioService);

  @ViewChild('scrollWrapper') scrollWrapper!: ElementRef;
  @ViewChild('track') track!: ElementRef;

  protected readonly items = this.portfolioService.projects;
  protected readonly labelLeft = signal('8Y_PRECISION_ENGINEERING');
  protected readonly labelRight = signal('TBI_GEORGIA // 41.7151° N, 44.8271° E');

  private st?: ScrollTrigger;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    // Give Angular a moment to render the DOM elements
    setTimeout(() => {
      this.initHorizontalGallery();
    }, 100);
  }

  private initHorizontalGallery(): void {
    if (window.innerWidth <= 768) {
      // For mobile, just make sure inner cards are visible since SCAP/SCSS handles layout
      const inners = gsap.utils.toArray('.project-card__inner') as HTMLElement[];
      gsap.set(inners, { opacity: 1, scale: 1, rotateY: 0, z: 0 });
      return;
    }

    const trackEl = this.track.nativeElement as HTMLElement;
    const scrollWrapperEl = this.scrollWrapper.nativeElement as HTMLElement;
    const cards = gsap.utils.toArray('.project-card') as HTMLElement[];

    this.st = ScrollTrigger.create({
      trigger: scrollWrapperEl,
      start: 'top top',
      end: () => `+=${trackEl.scrollWidth - window.innerWidth}`,
      pin: true,
      scrub: 1, // Smooth inertia scrubbing
      invalidateOnRefresh: true,
      animation: gsap.to(trackEl, {
        x: () => -(trackEl.scrollWidth - window.innerWidth),
        ease: 'none'
      }),
      onUpdate: (self) => {
        const totalWidth = trackEl.scrollWidth - window.innerWidth;
        // Update dynamic metadata based on progress
        const progress = self.progress;
        const totalProjects = this.items().length;
        const activeIndex = Math.min(Math.floor(progress * totalProjects) + 1, totalProjects);
        
        this.labelLeft.set(`SCANNING_PROJECT_0${activeIndex}`);
        
        // Subtle coordinate shift
        const lat = (41.7151 + progress * 0.05).toFixed(4);
        const lon = (44.8271 + progress * 0.08).toFixed(4);
        this.labelRight.set(`TBI_GEORGIA // ${lat}° N, ${lon}° E`);

        // 3D Perspective effect based on horizontal viewport position
        cards.forEach((card) => {
          const inner = card.querySelector('.project-card__inner') as HTMLElement;
          if (!inner) return;

          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const viewportCenter = window.innerWidth / 2;
          
          const distance = cardCenter - viewportCenter;
          const maxDistance = window.innerWidth;
          const normalizedDistance = Math.max(-1, Math.min(1, distance / maxDistance));
          
          // Center card scales to 1, edge cards scale down
          const scale = 1 - Math.abs(normalizedDistance) * 0.2;
          
          // Edge cards rotate Y to face the center
          const rotateY = normalizedDistance * 35;
          
          // Edge cards push back in Z space and fade
          const z = Math.abs(normalizedDistance) * -500;
          const opacity = 1 - Math.abs(normalizedDistance) * 0.6;

          gsap.set(inner, {
            scale: scale,
            rotateY: rotateY,
            z: z,
            opacity: opacity
          });
          
          // Dynamic vertical labels reveal when near center with blur effect
          const labels = inner.querySelectorAll('.side-label');
          if (Math.abs(normalizedDistance) < 0.25) {
             gsap.to(labels, { 
               opacity: 1, 
               filter: 'blur(0px)',
               duration: 0.6, 
               ease: 'power2.out', 
               overwrite: 'auto' 
             });
          } else {
             gsap.to(labels, { 
               opacity: 0, 
               filter: 'blur(10px)',
               duration: 0.6, 
               ease: 'power2.out', 
               overwrite: 'auto' 
             });
          }

          // Blueprint parallax shift
          const blueprint = card.querySelector('.project-blueprint-svg');
          if (blueprint) {
            gsap.set(blueprint, {
              x: normalizedDistance * 40,
              y: normalizedDistance * 20
            });
          }
        });
      }
    });

    // Force initial update to set starting positions
    if (this.st && this.st.animation) {
       this.st.animation.progress(0);
       this.st.update();
    }
  }

  ngOnDestroy(): void {
    if (this.st) {
      this.st.kill();
    }
  }

  protected navigateToProject(event: MouseEvent, id: string): void {
    // Force immediate navigation bypass for GSAP/3D conflicts
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['/portfolio', id]).then(success => {
      if (!success) {
        // Fallback for extreme cases
        window.location.href = `/portfolio/${id}`;
      }
    });
  }
}
