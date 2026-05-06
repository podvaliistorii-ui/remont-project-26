import { DOCUMENT, isPlatformBrowser, CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  PLATFORM_ID,
  inject,
  signal,
  computed,
  effect,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet, Data } from '@angular/router';
import { trigger, transition, style, query, animate } from '@angular/animations';
import { filter } from 'rxjs/operators';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { Footer } from './footer/footer';
import { PreloaderComponent } from './preloader/preloader';
import { LanguageService, LanguageCode } from './language.service';
import { TranslateModule } from '@ngx-translate/core';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Footer, TranslateModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          })
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(30%)' })
        ], { optional: true }),
        query(':leave', [
          animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-30%)' }))
        ], { optional: true }),
        query(':enter', [
          animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
        ], { optional: true }),
      ])
    ])
  ]
})
export class App implements AfterViewInit {
  protected readonly i18n = inject(LanguageService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  @ViewChild('progressBar') progressBar!: ElementRef;

  readonly isLoading = signal(true);
  readonly loadProgress = signal(0);
  readonly menuOpen = signal(false);
  readonly isScrolled = signal(false);
  readonly isHome = signal(true);
  readonly isDark = signal(false);
  readonly scrollThreshold = signal(false);

  readonly isHeaderLogoVisible = computed(() => {
    return !this.isHome() || this.scrollThreshold();
  });

  readonly navLinks = [
    { path: '/', key: 'NAV.HOME', exact: true },
    { path: '/about', key: 'NAV.ABOUT', exact: false },
    { path: '/portfolio', key: 'NAV.PORTFOLIO', exact: false },
    { path: '/articles', key: 'NAV.ARTICLES', exact: false },
    { path: '/calculator', key: 'NAV.CALCULATOR', exact: false },
    { path: '/contact', key: 'NAV.CONTACT', exact: false },
  ];

  readonly languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' },
    { code: 'ka', label: 'KA' },
  ];

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const currentPath = event.urlAfterRedirects.split('?')[0].split('#')[0];
        this.isHome.set(currentPath === '/');
        this.menuOpen.set(false);
        
        const cursorEl = this.document.getElementById('fx-cursor');
        if (cursorEl) {
          cursorEl.classList.remove('cursor-hover', 'cursor-explore');
        }

        if (isPlatformBrowser(this.platformId)) {
          // Explicitly reset scroll state and position
          this.isScrolled.set(false);
          this.scrollThreshold.set(false);
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          
          // Re-sync Lenis if it exists
          const lenisInstance = (window as any).lenis;
          if (lenisInstance) {
            lenisInstance.scrollTo(0, { immediate: true });
          }
        }
        
        this.updateMetaTags(currentPath);
      });

    effect(() => {
      const dark = this.isDark();
      if (isPlatformBrowser(this.platformId)) {
        this.document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        localStorage.setItem('fx-theme', dark ? 'dark' : 'light');
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('fx-theme');
      this.isDark.set(saved === 'dark');
    }
  }

  private updateMetaTags(path: string): void {
    const lang = this.i18n.lang();
    let title = '';
    let description = '';
    let keywords = '';

    if (lang === 'ru') {
      title = 'Ремонт квартир в Тбилиси | Профессиональная отделка | FixEntro';
      description = 'Качественный ремонт квартир в Тбилиси (Ваке, Сабуртало, Дидубе). Профессиональная отделка, дизайн и архитектурный аудит. Калькулятор сметы онлайн.';
      keywords = 'Ремонт квартир Тбилиси, ремонт Ваке, Сабуртало, Дидубе, отделка под ключ Грузия, дизайн интерьера Тбилиси';
    } else if (lang === 'ka') {
      title = 'ბინის რემონტი თბილისში | პროფესიონალური მომსახურება | FixEntro';
      description = 'ბინის ხარისხიანი რემონტი თბილისში (ვაკე, საბურთალო, დიდუბე). დიზაინი და არქიტექტურული აუდიტი. ხარჯთაღრიცხვის კალკულატორი ონლაინ.';
      keywords = 'ბინის რემონტი თბილისი, რემონტი ვაკეში, საბურთალოზე, დიდუბეში, რემონტი საქართველო, ინტერიერის დიზაინი';
    } else {
      title = 'Apartment Renovation in Tbilisi | Professional Finish | FixEntro';
      description = 'High-quality apartment renovation in Tbilisi (Vake, Saburtalo, Didube). Professional design and architectural audit. Online cost calculator.';
      keywords = 'Apartment renovation Tbilisi, renovation Vake, Saburtalo, Didube, turnkey renovation Georgia, interior design Tbilisi';
    }

    if (path.includes('portfolio')) {
      if (lang === 'ru') title = 'Наши работы | Ремонт в Ваке, Сабуртало, Тбилиси';
      else if (lang === 'ka') title = 'ჩვენი ნამუშევრები | რემონტი ვაკეში, საბურთალოზე, თბილისში';
      else title = 'Our Works | Renovation in Vake, Saburtalo, Tbilisi';
    } else if (path.includes('calculator')) {
      if (lang === 'ru') title = 'Калькулятор ремонта в Тбилиси | FixEntro';
      else if (lang === 'ka') title = 'რემონტის კალკულატორი თბილისი | FixEntro';
      else title = 'Renovation Calculator Tbilisi | FixEntro';
    }

    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'keywords', content: keywords });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.runPreloader();
      this.initAccelerometerShadows();
    }
  }

  private initAccelerometerShadows(): void {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', (event) => {
        const { beta, gamma } = event; // beta: front-to-back, gamma: left-to-right
        if (beta !== null && gamma !== null) {
          // Limit the shift to max 10px
          const x = Math.max(-10, Math.min(10, gamma / 4));
          const y = Math.max(-10, Math.min(10, beta / 4));
          
          this.document.documentElement.style.setProperty('--fx-shadow-offset-x', `${x}px`);
          this.document.documentElement.style.setProperty('--fx-shadow-offset-y', `${y}px`);
        }
      });
    }
  }

  private runPreloader(): void {
    const preloaderEl = this.document.getElementById('preloader');
    const progressEl = this.document.getElementById('progress');
    
    const timeout = setTimeout(() => {
      this.finishLoading();
    }, 3000);

    if (!preloaderEl || !progressEl) {
      this.finishLoading();
      clearTimeout(timeout);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(timeout);
        this.finishLoading();
      }
    });

    const counter = { val: 0 };
    tl.to(counter, {
      val: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const p = Math.floor(counter.val);
        if (progressEl) progressEl.textContent = `${p}%`;
      }
    });
  }

  private finishLoading(): void {
    const preloaderEl = this.document.getElementById('preloader');
    if (preloaderEl) {
      gsap.to(preloaderEl, {
        opacity: 0,
        duration: 0.6,
        onComplete: () => {
          preloaderEl.style.display = 'none';
          this.isLoading.set(false);
          this.initScrollAnimations();
        }
      });
    } else {
      this.isLoading.set(false);
      this.initScrollAnimations();
    }
  }

  private initScrollAnimations(): void {
    try {
      if (isPlatformBrowser(this.platformId)) {
        const cursorEl = this.document.getElementById('fx-cursor');
        if (cursorEl) {
          // Force apply the active class immediately
          this.document.documentElement.classList.add('custom-cursor-active');
          if (!cursorEl.querySelector('.cursor-text')) {
            const label = this.document.createElement('span');
            label.className = 'cursor-text';
            label.textContent = this.i18n.t('CURSOR.EXPLORE');
            cursorEl.appendChild(label);
          }
        }
      }

      // @ts-ignore
      const lenis = new Lenis({
        duration: 1.5,
        lerp: 0.08,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      (window as any).lenis = lenis;

      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);

      if (this.progressBar?.nativeElement) {
        gsap.to(this.progressBar.nativeElement, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.1
          }
        });
      }
    } catch (err) {
      console.warn('Scroll animations initialization passed quietly:', err);
    }
  }

  prepareRoute(outlet: RouterOutlet): Data | string {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const y = window.scrollY;
    this.isScrolled.set(y > 20);
    this.scrollThreshold.set(y > 100);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const cursorEl = this.document.getElementById('fx-cursor');
    if (cursorEl) {
      // Use GSAP for buttery smooth cursor movement
      gsap.to(cursorEl, {
        x: event.clientX,
        y: event.clientY,
        xPercent: -50,
        yPercent: -50,
        duration: 0.1,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
    
    // Magnetic pull logic for buttons/links
    this.handleMagneticEffect(event);
  }

  private handleMagneticEffect(event: MouseEvent): void {
    const targets = this.document.querySelectorAll('.btn-one, .back-link, .nav-link, .header__lang-link, .header__theme-btn, .footer-nav a, .social-link, .wa-float');
    targets.forEach((target: any) => {
      const rect = target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = event.clientX - centerX;
      const distanceY = event.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      const triggerDistance = 100;
      if (distance < triggerDistance) {
        // Magnetic pull: max 15px shift
        const power = (triggerDistance - distance) / triggerDistance;
        const maxShift = 15;
        const x = (distanceX / triggerDistance) * maxShift * power;
        const y = (distanceY / triggerDistance) * maxShift * power;
        
        gsap.to(target, {
          x: x,
          y: y,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else {
        gsap.to(target, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }
    });
  }

  @HostListener('document:mouseover', ['$event'])
  onMouseOver(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const cursorEl = this.document.getElementById('fx-cursor');
    if (!cursorEl) return;

    const target = event.target as HTMLElement;
    const clickable = target.closest('a, button, .nav-btn, .btn-one, .district-map-chip, .tier-card');
    const projectCard = target.closest('.project-card');
    const cursorText = cursorEl.querySelector('.cursor-text');

    if (projectCard) {
      cursorEl.classList.add('cursor-explore');
      cursorEl.classList.remove('cursor-hover');
      if (cursorText) {
        cursorText.textContent = this.i18n.t('CURSOR.VIEW');
      }
    } else if (clickable) {
      cursorEl.classList.add('cursor-hover');
      cursorEl.classList.remove('cursor-explore');
      if (cursorText) cursorText.textContent = this.i18n.t('CURSOR.OPEN');
    } else {
      cursorEl.classList.remove('cursor-hover', 'cursor-explore');
    }
  }

  @HostListener('document:mouseout', ['$event'])
  onMouseOut(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const cursorEl = this.document.getElementById('fx-cursor');
    if (!cursorEl) return;
    
    // Clear classes if the mouse leaves the viewport entirely
    if (!event.relatedTarget) {
      cursorEl.classList.remove('cursor-hover', 'cursor-explore');
    }
  }

  toggleTheme(): void { this.isDark.update(v => !v); }
  toggleMenu(): void { this.menuOpen.update((value) => !value); }
  closeMenu(): void { this.menuOpen.set(false); }
  switchLang(lang: string): void { this.i18n.setLang(lang as LanguageCode); }
}
