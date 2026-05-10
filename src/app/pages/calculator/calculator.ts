import { Component, inject, signal, computed, AfterViewInit, ElementRef, HostListener, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../language.service';
import { MarketIndexService } from '../../market-index.service';
import { TranslateModule } from '@ngx-translate/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './calculator.html',
  styleUrl: './calculator.scss',
})
export class CalculatorComponent implements AfterViewInit, OnDestroy {
  protected readonly i18n = inject(LanguageService);
  protected readonly market = inject(MarketIndexService);
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  
  readonly area = signal<number>(85);
  readonly buildingType = signal<'cosmetic' | 'capital' | 'designer'>('capital');
  readonly currentStep = signal<number>(1);
  
  readonly displayValue = signal<number>(0);

  readonly basePrices: Record<string, number> = {
    'cosmetic': 350,
    'capital': 650,
    'designer': 950
  };

  readonly totalCost = computed(() => {
    const marketIdx = this.market.currentMarketIndex() || 1.0;
    const base = this.basePrices[this.buildingType()] || 650;
    return Math.floor(this.area() * base * marketIdx);
  });

  constructor() {
    // Animate counter when totalCost changes
    let lastValue = 0;
    computed(() => {
      const target = this.totalCost();
      if (isPlatformBrowser(this.platformId)) {
        const obj = { val: lastValue };
        gsap.to(obj, {
          val: target,
          duration: 1,
          ease: 'power2.out',
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
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      gsap.to(grid, {
        x: x,
        y: y,
        duration: 1,
        ease: 'power1.out'
      });
    });
  }

  @HostListener('window:resize')
  onResize() {
    // Logic for mobile steps could be here if needed
  }

  setBuildingType(type: 'cosmetic' | 'capital' | 'designer', event: Event): void {
    this.buildingType.set(type);
    
    // GSAP Segmented Control Animation
    const target = event.currentTarget as HTMLElement;
    const parent = target.parentElement;
    const activeBg = parent?.querySelector('.segmented-bg');
    if (activeBg && target) {
      gsap.to(activeBg, {
        x: target.offsetLeft,
        width: target.offsetWidth,
        duration: 0.4,
        ease: 'power2.inOut'
      });
    }
  }

  nextStep() { if (this.currentStep() < 3) this.currentStep.update(s => s + 1); }
  prevStep() { if (this.currentStep() > 1) this.currentStep.update(s => s - 1); }

  getEstimate() {
    const message = `Estimate: ${this.totalCost()} GEL for ${this.area()}m² (${this.buildingType()}).`;
    window.open(`https://wa.me/995558105574?text=${encodeURIComponent(message)}`, '_blank');
  }

  ngOnDestroy(): void {}
}
