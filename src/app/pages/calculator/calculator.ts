import { Component, inject, signal, computed, AfterViewInit, ElementRef, HostListener, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../language.service';
import { MarketIndexService } from '../../market-index.service';
import { TranslateModule } from '@ngx-translate/core';
import { LiveIndicatorComponent } from '../../shared/live-indicator/live-indicator';
import { gsap } from 'gsap';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LiveIndicatorComponent],
  templateUrl: './calculator.html',
  styleUrl: './calculator.scss',
})
export class CalculatorComponent implements AfterViewInit, OnDestroy {
  protected readonly i18n = inject(LanguageService);
  protected readonly market = inject(MarketIndexService);
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild(LiveIndicatorComponent) liveIndicator!: LiveIndicatorComponent;
  
  // ── Signals ──
  readonly area = signal<number>(85);
  readonly tier = signal<'economy' | 'standard' | 'premium'>('standard');
  readonly district = signal<'prestige' | 'standard'>('prestige'); // Prestige: Vake, Vera, Mtatsminda
  readonly housingType = signal<'new' | 'old'>('new');
  
  // ── Options ──
  readonly bathroomAddon = signal(false);
  readonly wiringAddon = signal(false);
  readonly ceilingAddon = signal(false);

  readonly windowWidth = signal<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  readonly isMobile = computed(() => this.windowWidth() < 1100);
  readonly displayValue = signal<number>(0);

  // ── Rates ──
  private readonly tierRates = { economy: 300, standard: 550, premium: 900 };
  private readonly districtCoeff = { prestige: 1.12, standard: 1.0 };
  private readonly housingCoeff = { new: 1.0, old: 1.25 };
  private readonly fixedBathroom = 2500;
  private readonly wiringRate = 20; 
  private readonly ceilingRate = 40;

  readonly breakdown = computed(() => {
    const area = this.area();
    const baseRate = this.tierRates[this.tier()];
    const districtMod = this.districtCoeff[this.district()];
    const houseMod = this.housingCoeff[this.housingType()];
    
    const subtotalBase = area * baseRate;
    const subtotalWithMods = subtotalBase * districtMod * houseMod;
    
    const extras = {
      bathroom: this.bathroomAddon() ? this.fixedBathroom : 0,
      wiring: this.wiringAddon() ? area * this.wiringRate : 0,
      ceiling: this.ceilingAddon() ? area * this.ceilingRate : 0
    };

    const finalTotal = (subtotalWithMods + extras.bathroom + extras.wiring + extras.ceiling) * (this.market.currentMarketIndex() || 1.0);

    return {
      area,
      baseRate,
      districtMod,
      houseMod,
      subtotalBase,
      subtotalWithMods,
      extras: extras.bathroom + extras.wiring + extras.ceiling,
      total: finalTotal
    };
  });

  readonly totalEstimate = computed(() => Math.floor(this.breakdown().total));
  readonly isHighScale = computed(() => this.totalEstimate() > 50000);

  constructor() {
    let lastValue = 0;
    computed(() => {
      const target = this.totalEstimate();
      if (isPlatformBrowser(this.platformId)) {
        const obj = { val: lastValue };
        gsap.to(obj, {
          val: target,
          duration: 1.2,
          ease: 'power3.out',
          onUpdate: () => this.displayValue.set(Math.floor(obj.val))
        });
        lastValue = target;
      } else {
        this.displayValue.set(target);
      }
    });
  }

  private blueprintHandler = (e: MouseEvent) => {
    const grid = this.el.nativeElement.querySelector('.blueprint-grid');
    if (!grid) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    gsap.to(grid, { x, y, duration: 1.5, ease: 'power2.out' });
  };

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.windowWidth.set(window.innerWidth);
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('mousemove', this.blueprintHandler);
      this.initSegmentedBgs();
    }
  }

  private initSegmentedBgs() {
    // Initial position for segmented backgrounds
    const segments = this.el.nativeElement.querySelectorAll('.segmented-control');
    segments.forEach((seg: HTMLElement) => {
      const activeBtn = seg.querySelector('button.active') as HTMLElement;
      const bg = seg.querySelector('.segmented-bg') as HTMLElement;
      if (activeBtn && bg) {
        gsap.set(bg, { x: activeBtn.offsetLeft, width: activeBtn.offsetWidth });
      }
    });
  }

  selectTier(t: 'economy' | 'standard' | 'premium', ev: MouseEvent) {
    this.tier.set(t);
    this.animateSegment(ev);
  }

  selectDistrict(d: 'prestige' | 'standard', ev: MouseEvent) {
    this.district.set(d);
    this.animateSegment(ev);
  }

  selectHousing(h: 'new' | 'old', ev: MouseEvent) {
    this.housingType.set(h);
    this.animateSegment(ev);
  }

  private animateSegment(ev: MouseEvent) {
    const target = ev.currentTarget as HTMLElement;
    const bg = target.parentElement?.querySelector('.segmented-bg');
    if (bg) {
      gsap.to(bg, { x: target.offsetLeft, width: target.offsetWidth, duration: 0.5, ease: 'expo.out' });
    }
  }

  getEstimate() {
    if (this.liveIndicator) this.liveIndicator.flash();
    const message = `FixEntro Audit Request: ${this.totalEstimate()} GEL. [${this.area()}m², ${this.tier()}, ${this.district()}, ${this.housingType()}]`;
    window.open(`https://wa.me/995558105574?text=${encodeURIComponent(message)}`, '_blank');
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('mousemove', this.blueprintHandler);
    }
  }
}
