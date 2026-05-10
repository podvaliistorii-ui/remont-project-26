import { Component, inject, signal, computed, AfterViewInit, OnDestroy, ElementRef, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { PortfolioService, Project } from '../../../portfolio.service';
import { TranslateModule } from '@ngx-translate/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss'
})
export class ProjectDetailComponent implements AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly portfolioService = inject(PortfolioService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef);

  readonly id = signal<string | null>(null);
  readonly currentProject = computed(() => {
    const currentId = this.id();
    return currentId ? this.portfolioService.getProjectById(currentId) : null;
  });

  readonly allProjects = this.portfolioService.projects;
  readonly nextProject = computed(() => {
    const projects = this.allProjects();
    const idx = projects.findIndex(p => p.id === this.id());
    if (idx === -1) return null;
    return projects[(idx + 1) % projects.length];
  });

  private triggers: ScrollTrigger[] = [];

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.id.set(params.get('id'));
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initImmersiveEffects();
    }
  }

  private initImmersiveEffects(): void {
    // Parallax for full-screen images
    const slides = this.el.nativeElement.querySelectorAll('.project-slide');
    slides.forEach((slide: HTMLElement) => {
      const img = slide.querySelector('.slide-media');
      if (img) {
        const st = ScrollTrigger.create({
          trigger: slide,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          animation: gsap.fromTo(img, { y: '-15%' }, { y: '15%', ease: 'none' })
        });
        this.triggers.push(st);
      }
    });
  }

  navigateWithCurtain(nextId: string): void {
    const curtain = document.createElement('div');
    curtain.className = 'nav-curtain';
    document.body.appendChild(curtain);

    const tl = gsap.timeline({
      onComplete: () => {
        this.router.navigate(['/portfolio', nextId]).then(() => {
          gsap.to(curtain, {
            yPercent: -100,
            duration: 0.8,
            ease: 'expo.inOut',
            onComplete: () => curtain.remove()
          });
        });
      }
    });

    tl.to(curtain, { yPercent: 0, duration: 0.8, ease: 'expo.inOut' });
  }

  ngOnDestroy(): void {
    this.triggers.forEach(st => st.kill());
  }
}
