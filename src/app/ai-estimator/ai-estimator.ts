import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../language.service';

type District = 'Vake' | 'Vera' | 'Mtatsminda' | 'Saburtalo' | 'Gldani' | 'Varketili' | 'Isani' | 'Other';

type Estimate = {
  areaM2: number;
  district: District;
  districtModifier: number;
  lowGel: number; // Economy
  highGel: number; // Premium
};

@Component({
  selector: 'app-ai-estimator',
  imports: [CommonModule],
  templateUrl: './ai-estimator.html',
  styleUrl: './ai-estimator.scss',
})
export class AiEstimator {
  protected i18n = inject(LanguageService);

  status = signal<'idle' | 'processing' | 'complete'>('idle');
  logs = signal<string[]>([]);
  progress = signal<number>(0);
  query = signal<string>('');
  estimate = signal<Estimate | null>(null);
  inputDisabled = computed(() => this.status() !== 'idle');

  private readonly simulationSteps = [
    'ESTIMATOR.LOG_INIT',
    'ESTIMATOR.LOG_ENTROPY',
    'ESTIMATOR.STEP_PLASTERING',
    'ESTIMATOR.STEP_PUTTY',
    'ESTIMATOR.STEP_TILING',
    'ESTIMATOR.STEP_CEILINGS',
    'ESTIMATOR.LOG_SYNC',
    'ESTIMATOR.LOG_READY',
  ] as const;

  processEstimate(rawQuery: string) {
    if (this.status() !== 'idle') return;
    const normalized = (rawQuery ?? '').toString().trim();
    if (!normalized) return;

    this.query.set(normalized);
    this.status.set('processing');
    this.logs.set([]);
    this.progress.set(0);
    this.estimate.set(null);

    const runStep = (index: number) => {
      setTimeout(() => {
        const step = this.simulationSteps[index];
        this.logs.update((current) => [...current, this.i18n.t(step)]);
        this.progress.set(Math.round(((index + 1) / this.simulationSteps.length) * 100));

        if (index + 1 < this.simulationSteps.length) {
          runStep(index + 1);
          return;
        }

        this.status.set('complete');

        const areaM2 = this.extractAreaM2OrNull(this.query());
        if (areaM2 === null) {
          this.logs.update((current) => [...current, '[ERROR] AREA_NOT_DETECTED. TRY: "65 m² Vake".']);
          return;
        }

        const estimate = this.calculateEstimate(this.query(), areaM2);
        this.estimate.set(estimate);

        const districtLabel = this.getDistrictLabel(estimate.district);
        const economy = this.formatGelAmount(estimate.lowGel);
        const premium = this.formatGelAmount(estimate.highGel);

        this.logs.update((current) => [
          ...current,
          '[CALIBRATION_COMPLETE]',
          `DISTRICT_MODIFIER: ${districtLabel}`,
          `ESTIMATED_ECONOMY: ${economy} ₾`,
          `ESTIMATED_PREMIUM: ${premium} ₾`,
        ]);
      }, 950);
    };

    runStep(0);
  }

  contactMailto(): string {
    const subject = encodeURIComponent('Fixentro — Estimate request');
    const body = encodeURIComponent(
      `Request: ${this.query()}\n\nPreferred district: ${this.getDistrictLabel(this.estimate()?.district ?? 'Other')}\nArea: ${this.estimate()?.areaM2 ?? 0} m²`,
    );
    return `mailto:hello@fixentro.ge?subject=${subject}&body=${body}`;
  }

  formatGel(value: number): string {
    const formatted = this.formatGelAmount(value);
    return `₾${formatted}`;
  }

  private calculateEstimate(input: string, areaM2: number): Estimate {
    const district = this.detectDistrict(input);
    const districtModifier = this.getDistrictModifier(district);

    const economyPerM2 = 240;
    const premiumPerM2 = 400;

    const economyGel = this.roundTo(areaM2 * economyPerM2 * districtModifier, 50);
    const premiumGel = this.roundTo(areaM2 * premiumPerM2 * districtModifier, 50);

    return { areaM2, district, districtModifier, lowGel: economyGel, highGel: premiumGel };
  }

  private extractAreaM2OrNull(input: string): number | null {
    const normalized = (input ?? '').toString().replace(',', '.');
    const match = normalized.match(/(\d{1,4}(?:\.\d+)?)/);
    const parsed = match ? Number(match[1]) : NaN;
    if (!Number.isFinite(parsed)) return null;

    const clamped = Math.max(18, Math.min(parsed, 400));
    return Math.round(clamped * 10) / 10;
  }

  private detectDistrict(input: string): District {
    const original = (input ?? '').toString();
    const lower = original.toLowerCase();

    const matches = (needle: string, ...patterns: RegExp[]) =>
      lower.includes(needle.toLowerCase()) || patterns.some((pattern) => pattern.test(original));

    if (matches('vake', /ваке/iu, /ვაკე/iu)) return 'Vake';
    if (matches('vera', /вера/iu, /ვერა/iu)) return 'Vera';
    if (matches('mtatsminda', /мтацминда/iu, /მთაწმინდა/iu)) return 'Mtatsminda';
    if (matches('saburtalo', /сабур/iu, /საბურთალო/iu)) return 'Saburtalo';
    if (matches('gldani', /глдани/iu, /გლდანი/iu)) return 'Gldani';
    if (matches('varketili', /варкетили/iu, /ვარკეთილი/iu)) return 'Varketili';
    if (matches('isani', /исანი/iu, /ისანი/iu)) return 'Isani';

    return 'Other';
  }

  private getDistrictModifier(district: District): number {
    if (district === 'Vake' || district === 'Vera' || district === 'Mtatsminda' || district === 'Saburtalo') return 1.15;
    if (district === 'Gldani' || district === 'Varketili' || district === 'Isani') return 0.95;
    return 1.0;
  }

  private getDistrictLabel(district: District): string {
    const key = `CALCULATOR.DISTRICTS.${district.toLowerCase()}`;
    const translated = this.i18n.t(key);
    return translated === key ? district : translated;
  }

  private roundTo(value: number, step: number): number {
    return Math.round(value / step) * step;
  }

  private formatGelAmount(value: number): string {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
  }
}

