import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MarketIndexService {
  // Current USD/GEL rate (simulated)
  readonly usdRate = signal(2.72);
  
  // Base Market Index (1.0 = average)
  private readonly baseMultiplier = signal(1.04);
  
  // Simulated volatility based on construction material costs
  private readonly materialVolatility = signal(0);

  constructor() {
    this.refreshMarketData();
    // Simulate periodic fluctuations if needed, or just static for session
  }

  readonly currentMarketIndex = computed(() => {
    const rateEffect = (this.usdRate() / 2.70) * 0.5; // 50% dependency on import costs/rate
    return (this.baseMultiplier() + this.materialVolatility() + rateEffect) / 1.5;
  });

  // Generate 7 days of trend data for the chart
  readonly trendData = computed(() => {
    const data = [];
    const base = this.currentMarketIndex();
    for (let i = 0; i < 7; i++) {
      // Create a pseudo-random but somewhat stable trend
      const variance = (Math.sin(i * 0.8) * 0.02) + (Math.random() * 0.01);
      data.push(base + variance);
    }
    return data;
  });

  readonly lastUpdated = signal(new Date());

  refreshMarketData() {
    // Simulate ±2-3% fluctuation
    this.materialVolatility.set((Math.random() * 0.05) - 0.025);
    this.lastUpdated.set(new Date());
  }

  getMultiplier() {
    return this.currentMarketIndex();
  }
}
