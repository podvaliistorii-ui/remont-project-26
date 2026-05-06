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
      console.log('Portfolio items on AfterViewInit:', this.items());
      // Wait for images and layout to settle
      setTimeout(() => {
        this.initLayout();
      }, 500);
    }
  }

  private initLayout(): void {
    const items = this.items();
    console.log('Initializing portfolio layout. Item count:', items.length);
    
    if (items.length === 0) {
      console.warn('Portfolio is empty! Checking service directly...');
    }

    if (window.innerWidth > 900) {
      console.log('Desktop detected - initializing GSAP horizontal scroll');
      this.initHorizontalGallery();
    } else {
      console.log('Mobile detected - using standard vertical grid');
    }
  }

  private initHorizontalGallery(): void {
    if (!this.track || !this.scrollWrapper) return;

    const trackEl = this.track.nativeElement as HTMLElement;
    const scrollWrapperEl = this.scrollWrapper.nativeElement as HTMLElement;
    
    console.log('Track scrollWidth:', trackEl.scrollWidth);
    console.log('Viewport width:', window.innerWidth);

    this.st = ScrollTrigger.create({
      trigger: scrollWrapperEl,
      start: 'top top',
      end: () => `+=${trackEl.scrollWidth - window.innerWidth}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      animation: gsap.to(trackEl, {
        x: () => -(trackEl.scrollWidth - window.innerWidth),
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
