import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../language.service';
import { MarketIndexService } from '../../market-index.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './calculator.html',
  styleUrl: './calculator.scss',
})
export class CalculatorComponent {
  protected readonly i18n = inject(LanguageService);
  protected readonly market = inject(MarketIndexService);
  
  readonly area = signal<number>(100);
  readonly buildingType = signal<'cosmetic' | 'capital' | 'designer'>('capital');

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

  readonly formattedTotal = computed(() => {
    return new Intl.NumberFormat(this.i18n.lang() === 'ka' ? 'ka-GE' : 'en-US').format(this.totalCost());
  });

  getEstimate() {
    const message = `Hello, I'd like to get a formal estimate for a ${this.buildingType()} renovation of a ${this.area()}m² space.`;
    const whatsappUrl = `https://wa.me/995558105574?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }
}
