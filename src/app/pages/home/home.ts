import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, PLATFORM_ID, computed, inject, signal, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../language.service';
import { TranslateModule } from '@ngx-translate/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { BeforeAfterComponent, Hotspot } from '../../shared/before-after/before-after';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, TranslateModule, BeforeAfterComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements AfterViewInit {
  protected readonly i18n = inject(LanguageService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly engineHotspots: Hotspot[] = [
    { x: 35, y: 45, labelKey: 'ENGINEERING.REINFORCEMENT' },
    { x: 65, y: 30, labelKey: 'ENGINEERING.LASER_ALIGNED' },
    { x: 50, y: 75, labelKey: 'ENGINEERING.CONCEALED_SYSTEMS' }
  ];

  readonly revealX = signal(50);
  readonly revealY = signal(50);
  readonly revealRadius = signal(20);
  readonly scrollY = signal(0);

  readonly authorityBadges = [
    { value: '08', labelKey: 'HOME.BADGE_YEARS' },
    { value: '30+', labelKey: 'HOME.BADGE_PROJECTS' }
  ];

  readonly revealMask = computed(
    () => `circle(${this.revealRadius()}% at ${this.revealX()}% ${this.revealY()}%)`
  );

  readonly showcaseProjects = [
    {
      title: 'PROJECTS.VAKE_TITLE',
      description: 'PROJECTS.VAKE_DESC',
      area: '180 m2',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'PROJECTS.MTATSMINDA_TITLE',
      description: 'PROJECTS.MTATSMINDA_DESC',
      area: '132 m2',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    },

    {
      title: 'PROJECTS.SABURTALO_TITLE',
      description: 'PROJECTS.SABURTALO_DESC',
      area: '205 m2',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.scrollY.set(window.scrollY);
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Fade out branding title on scroll
    gsap.to('.branding-title', {
      scrollTrigger: {
        trigger: '.home-hero',
        start: 'top top',
        end: '30% top',
        scrub: true,
      },
      opacity: 0,
      y: -50,
      scale: 0.9,
      ease: 'power1.inOut'
    });

    // Fade out badges on scroll
    gsap.to('.authority-badges', {
      scrollTrigger: {
        trigger: '.home-hero',
        start: 'top top',
        end: '20% top',
        scrub: true,
      },
      opacity: 0,
      scale: 0.8,
      ease: 'power1.inOut'
    });
  }

  onRevealMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    this.revealX.set(x);
    this.revealY.set(y);
  }

  onRevealLeave(): void {
    this.revealX.set(50);
    this.revealY.set(50);
  }

  onRevealTouch(event: TouchEvent): void {
    if (!isPlatformBrowser(this.platformId) || event.touches.length === 0) return;
    const touch = event.touches[0];
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    this.revealX.set(x);
    this.revealY.set(52);
  }
}
