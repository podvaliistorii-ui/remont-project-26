import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class CalculatorComponent {
  protected readonly i18n = inject(LanguageService);
  protected readonly market = inject(MarketIndexService);
  
  // Inputs with robust defaults
  readonly area = signal<number>(120);
  readonly district = signal<string>('vake');
  readonly buildingType = signal<'new' | 'old' | 'historic'>('new');
  readonly specTier = signal<1 | 2 | 3>(2);
  readonly hasFreightElevator = signal<boolean>(true);
  readonly narrowStreet = signal<boolean>(false);
  readonly floorCount = signal<number>(1);

  // Form signals
  readonly phone = signal<string>('');
  readonly name = signal<string>('');
  readonly noiseMapEnabled = signal<boolean>(false);
  readonly sunlightMapEnabled = signal<boolean>(false);

  readonly districts = ['vake', 'mtatsminda', 'saburtalo', 'vera', 'gldani', 'isani', 'other'];
  readonly districtProfiles: Record<string, { noise: number; sunlight: number }> = {
    vake: { noise: 0.62, sunlight: 0.72 },
    mtatsminda: { noise: 0.46, sunlight: 0.64 },
    saburtalo: { noise: 0.75, sunlight: 0.69 },
    vera: { noise: 0.56, sunlight: 0.57 },
    gldani: { noise: 0.41, sunlight: 0.54 },
    isani: { noise: 0.67, sunlight: 0.61 },
    other: { noise: 0.5, sunlight: 0.5 }
  };

  readonly specTierBasePrices: Record<number, number> = {
    1: 240,
    2: 400,
    3: 570
  };

  readonly archetypeMultipliers: Record<string, number> = {
    'new': 1.0,
    'old': 1.18,
    'historic': 1.35
  };

  readonly districtCoefficients: Record<string, number> = {
    'vake': 1.25,
    'mtatsminda': 1.30,
    'saburtalo': 1.10,
    'vera': 1.15,
    'gldani': 1.05,
    'isani': 1.08,
    'other': 1.00
  };

  readonly billOfQuantities = computed(() => {
    try {
      const marketIdx = this.market.currentMarketIndex() || 1.0;
      const areaVal = Math.max(0, this.area() || 0);
      const basePrice = this.specTierBasePrices[this.specTier()] || 400;
      const distMult = this.districtCoefficients[this.district()] || 1.0;
      const archMult = this.archetypeMultipliers[this.buildingType()] || 1.0;
      
      const baseSum = areaVal * basePrice;
      const total = baseSum * distMult * archMult * marketIdx;
      
      const totalWithoutArch = baseSum * distMult * marketIdx;
      const archetypeAdjustment = total - totalWithoutArch;
      
      const totalWithoutDist = baseSum * marketIdx;
      const logisticsFee = totalWithoutArch - totalWithoutDist;
      
      const marketAdjustment = totalWithoutDist - baseSum;

      const elevatorComplexity = !this.hasFreightElevator() ? (areaVal * 45 * marketIdx) : 0;
      const environmentalUpgrade = this.environmentalUpgradeCost();
      const finalTotal = total + elevatorComplexity + environmentalUpgrade;

      return {
        baseEngineering: Math.floor(baseSum),
        archetypeAdjustment: Math.floor(archetypeAdjustment),
        logisticsFee: Math.floor(logisticsFee + marketAdjustment),
        elevatorComplexity: Math.floor(elevatorComplexity),
        environmentalUpgrade: Math.floor(environmentalUpgrade),
        total: Math.floor(finalTotal)
      };
    } catch (e) {
      console.error('BOQ Calculation Error:', e);
      return { baseEngineering: 0, archetypeAdjustment: 0, logisticsFee: 0, elevatorComplexity: 0, environmentalUpgrade: 0, total: 0 };
    }
  });

  readonly districtEnvironment = computed(() => {
    return this.districtProfiles[this.district()] || this.districtProfiles['other'];
  });

  readonly boqEngineeringSuggestions = computed(() => {
    this.i18n.lang();

    const profile = this.districtEnvironment();
    const suggestions: string[] = [];
    if (this.noiseMapEnabled() && profile.noise >= 0.65) {
      suggestions.push(this.i18n.t('CALCULATOR.DASHBOARD.NOTES_NOISE_HIGH'));
    } else if (this.noiseMapEnabled()) {
      suggestions.push(this.i18n.t('CALCULATOR.DASHBOARD.NOTES_NOISE_STANDARD'));
    }

    if (this.sunlightMapEnabled() && profile.sunlight >= 0.65) {
      suggestions.push(this.i18n.t('CALCULATOR.DASHBOARD.NOTES_SUN_HIGH'));
    } else if (this.sunlightMapEnabled()) {
      suggestions.push(this.i18n.t('CALCULATOR.DASHBOARD.NOTES_SUN_STANDARD'));
    }

    if (!suggestions.length) {
      suggestions.push(this.i18n.t('CALCULATOR.DASHBOARD.NOTES_DEFAULT'));
    }

    return suggestions;
  });

  readonly primaryCtaText = computed(() => {
    this.i18n.lang();

    switch (this.buildingType()) {
      case 'historic':
        return this.i18n.t('CALCULATOR.DASHBOARD.CTA_HERITAGE');
      case 'old':
        return this.i18n.t('CALCULATOR.DASHBOARD.CTA_STRUCTURAL');
      default:
        return this.i18n.t('CALCULATOR.DASHBOARD.CTA_BLACK_FRAME');
    }
  });

  readonly leadMagnetTitle = computed(() => {
    return this.buildingType() === 'historic'
      ? 'Heritage Structural Preservation Checklist'
      : 'Black-Frame Acceptance Protocol';
  });

  readonly formattedTotal = computed(() => {
    const total = this.billOfQuantities().total;
    const locale = this.i18n.lang() === 'ka' ? 'ka-GE' : 'en-US';
    return new Intl.NumberFormat(locale).format(total);
  });

  readonly environmentalUpgradeCost = computed(() => {
    const areaVal = Math.max(0, this.area() || 0);
    const profile = this.districtEnvironment();
    let cost = 0;
    if (this.noiseMapEnabled()) {
      cost += areaVal * (45 + profile.noise * 30);
    }
    if (this.sunlightMapEnabled()) {
      cost += areaVal * (28 + profile.sunlight * 24);
    }
    return cost;
  });

  readonly chartPath = computed(() => {
    const data = this.market.trendData();
    if (!data.length) return '';
    const width = 300;
    const height = 60;
    const padding = 5;
    const min = Math.min(...data) * 0.995;
    const max = Math.max(...data) * 1.005;
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
      const y = height - ((val - min) / (max - min)) * (height - 2 * padding) - padding;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  });

  switchLang(lang: string) {
    this.i18n.setLang(lang);
  }

  setDistrict(district: string): void {
    this.district.set(district);
  }

  getDistrictHeatmapStyle(district: string): string {
    const profile = this.districtProfiles[district] || this.districtProfiles['other'];
    const layers: string[] = [];
    if (this.noiseMapEnabled()) {
      const alpha = 0.12 + profile.noise * 0.28;
      layers.push(`linear-gradient(135deg, rgba(44, 104, 171, ${alpha}) 0%, rgba(44, 104, 171, ${alpha * 0.45}) 100%)`);
    }
    if (this.sunlightMapEnabled()) {
      const alpha = 0.12 + profile.sunlight * 0.28;
      layers.push(`linear-gradient(315deg, rgba(196, 132, 35, ${alpha}) 0%, rgba(196, 132, 35, ${alpha * 0.45}) 100%)`);
    }
    return layers.length ? layers.join(',') : 'none';
  }

  submitConsultation() {
    const data = {
      name: this.name(),
      phone: this.phone(),
      specs: {
        area: this.area(),
        district: this.district(),
        type: this.buildingType(),
        tier: this.specTier(),
        logistics: {
          narrow: this.narrowStreet(),
          hasElevator: this.hasFreightElevator(),
          floor: this.floorCount()
        }
      },
      total: this.billOfQuantities().total,
      environmentalLayers: {
        noise: this.noiseMapEnabled(),
        sunlight: this.sunlightMapEnabled()
      }
    };
    console.info('Consultation request processed.');
  }
}
