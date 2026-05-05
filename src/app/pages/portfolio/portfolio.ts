import { Component, inject, signal, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
export class PortfolioComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly portfolioService = inject(PortfolioService);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('scrollWrapper') scrollWrapper!: ElementRef;
  @ViewChild('track') track!: ElementRef;

  protected readonly items = this.portfolioService.projects;
  private st?: ScrollTrigger;

  ngOnInit(): void {
    console.log('Portfolio initialized');
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initLayout();
    }
  }

  private initLayout(): void {
    // If desktop, init horizontal scroll
    if (window.innerWidth > 900) {
      this.initHorizontalGallery();
    } else {
      // For mobile, just ensure visible
      gsap.set('.project-entry', { opacity: 1, y: 0 });
    }
  }

  private initHorizontalGallery(): void {
    const trackEl = this.track.nativeElement as HTMLElement;
    const scrollWrapperEl = this.scrollWrapper.nativeElement as HTMLElement;
    
    const totalWidth = trackEl.scrollWidth - window.innerWidth;

    this.st = ScrollTrigger.create({
      trigger: scrollWrapperEl,
      start: 'top top',
      end: () => `+=${totalWidth}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      animation: gsap.to(trackEl, {
        x: () => -totalWidth,
        ease: 'none'
      })
    });
  }

  ngOnDestroy(): void {
    if (this.st) {
      this.st.kill();
    }
  }

  protected navigateToProject(event: MouseEvent, id: string): void {
    event.preventDefault();
    this.router.navigate(['/portfolio', id]);
  }
}
