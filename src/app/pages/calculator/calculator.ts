import { Component, inject, signal, computed, AfterViewInit, ElementRef, OnDestroy, isPlatformBrowser, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  
  // New Signals for Data Logic
  readonly area = signal<number>(85);
  readonly tier = signal<'economy' | 'standard' | 'premium'>('standard');
  readonly housingType = signal<'new' | 'old'>('new');
  
  // Options
  readonly bathroomAddon = signal(false);
  readonly wiringAddon = signal(false);
  readonly ceilingAddon = signal(false);

  readonly currentStep = signal<number>(1);
  readonly displayValue = signal<number>(0);

  private readonly tierRates = { economy: 300, standard: 550, premium: 900 };
  private readonly oldFundCoeff = 1.25;
  private readonly fixedBathroom = 2500;
  private readonly wiringRate = 20; // per m2
  private readonly ceilingRate = 40; // per m2

  readonly breakdown = computed(() => {
    const base = this.tierRates[this.tier()];
    const area = this.area();
    const subtotal = area * base;
    const coeffImpact = this.housingType() === 'old' ? subtotal * (this.oldFundCoeff - 1) : 0;
    
    const extras = {
      bathroom: this.bathroomAddon() ? this.fixedBathroom : 0,
      wiring: this.wiringAddon() ? area * this.wiringRate : 0,
      ceiling: this.ceilingAddon() ? area * this.ceilingRate : 0
    };

    return {
      base: subtotal,
      coeff: coeffImpact,
      extras: extras.bathroom + extras.wiring + extras.ceiling,
      total: (subtotal + coeffImpact + extras.bathroom + extras.wiring + extras.ceiling) * (this.market.currentMarketIndex() || 1.0)
    };
  });

  readonly totalEstimate = computed(() => Math.floor(this.breakdown().total));

  constructor() {
    let lastValue = 0;
    computed(() => {
      const target = this.totalEstimate();
      if (isPlatformBrowser(this.platformId)) {
        const obj = { val: lastValue };
        gsap.to(obj, {
          val: target,
          duration: 1.5,
          ease: 'expo.out',
          onUpdate: () => this.displayValue.set(Math.floor(obj.val))
        });
        lastValue = target;
      } else {
        this.displayValue.set(target);
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initBlueprintEffect();
    }
  }

  private initBlueprintEffect(): void {
    const grid = this.el.nativeElement.querySelector('.blueprint-grid');
    if (!grid) return;
    window.addEventListener('mousemove', (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      gsap.to(grid, { x, y, duration: 1.5, ease: 'power2.out' });
    });
  }

  selectTier(t: 'economy' | 'standard' | 'premium', ev: MouseEvent) {
    this.tier.set(t);
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
    const message = `Estimate: ${this.totalEstimate()} GEL. Plan: ${this.tier()} / ${this.area()}m2 / ${this.housingType()} fund.`;
    window.open(`https://wa.me/995558105574?text=${encodeURIComponent(message)}`, '_blank');
  }

  nextStep() { this.currentStep.update(s => s + 1); }
  prevStep() { this.currentStep.update(s => s - 1); }
  
  ngOnDestroy(): void {}
}
