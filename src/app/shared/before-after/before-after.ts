import { Component, Input, ElementRef, AfterViewInit, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UiStateService } from '../../ui-state.service';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

export interface Hotspot {
  x: number;
  y: number;
  labelKey: string;
}

@Component({
  selector: 'app-before-after',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ba-container" #container>
      <!-- After Image (Bottom) -->
      <div class="ba-image ba-after">
        <img [src]="afterImage" alt="After" />
        
        <!-- Hotspots -->
        <div class="hotspot" *ngFor="let h of hotspots" 
             [style.left.%]="h.x" [style.top.%]="h.y"
             (mouseenter)="activeHotspot.set(h)" (mouseleave)="activeHotspot.set(null)">
          <div class="hotspot-pulse"></div>
          <div class="hotspot-label" [class.visible]="activeHotspot() === h">
            <span class="mono">{{ h.labelKey }}</span>
          </div>
        </div>
      </div>

      <!-- Before Image (Top, Clipped) -->
      <div class="ba-image ba-before" #beforeClip>
        <div class="grain-overlay"></div>
        <img [src]="beforeImage" alt="Before" />
      </div>

      <!-- Divider / Handle -->
      <div class="ba-divider" #handle>
        <div class="divider-line"></div>
        <div class="divider-hud mono">
          <span class="hud-label">X_AXIS</span>
          <span class="hud-value">{{ Math.round(sliderPos() * 100) }}%</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 600px; position: relative; overflow: hidden; }
    .ba-container { position: relative; width: 100%; height: 100%; background: #000; cursor: col-resize; }
    .ba-image { position: absolute; inset: 0; width: 100%; height: 100%; }
    .ba-image img { width: 100%; height: 100%; object-fit: cover; }
    
    .ba-before { z-index: 2; clip-path: inset(0 50% 0 0); filter: grayscale(1) contrast(1.2); }
    .ba-after { z-index: 1; }

    .grain-overlay {
      position: absolute; inset: 0;
      background-image: url('https://grainy-gradients.vercel.app/noise.svg');
      opacity: 0.15; z-index: 3; pointer-events: none;
    }

    .ba-divider {
      position: absolute; top: 0; left: 50%; width: 2px; height: 100%;
      background: var(--fx-accent); z-index: 10; transform: translateX(-50%);
      pointer-events: all;
    }

    .divider-line { width: 100%; height: 100%; box-shadow: 0 0 20px var(--fx-accent); }

    .divider-hud {
      position: absolute; bottom: 40px; left: 20px;
      display: flex; flex-direction: column; gap: 5px;
      background: rgba(0,0,0,0.8); padding: 10px; border: 1px solid var(--fx-accent);
      width: 100px;
      .hud-label { font-size: 8px; opacity: 0.5; }
      .hud-value { font-size: 14px; color: var(--fx-accent); }
    }

    /* ── HOTSPOTS ── */
    .hotspot {
      position: absolute; width: 20px; height: 20px; z-index: 5;
      transform: translate(-50%, -50%); cursor: pointer;
    }
    .hotspot-pulse {
      width: 100%; height: 100%; background: var(--fx-accent); border-radius: 50%;
      animation: baPulse 2s infinite;
    }
    @keyframes baPulse {
      0% { transform: scale(0.5); opacity: 1; }
      100% { transform: scale(2.5); opacity: 0; }
    }
    .hotspot-label {
      position: absolute; top: 30px; left: 50%; transform: translateX(-50%);
      background: #fff; color: #000; padding: 10px 15px; font-size: 10px;
      white-space: nowrap; opacity: 0; visibility: hidden; transition: all 0.3s;
      &.visible { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(-5px); }
    }
  `]
})
export class BeforeAfterComponent implements AfterViewInit, OnDestroy {
  @Input() beforeImage = '';
  @Input() afterImage = '';
  @Input() hotspots: Hotspot[] = [];

  private readonly platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef);
  private readonly uiState = inject(UiStateService);
  
  protected readonly sliderPos = this.uiState.beforeAfterPosition;
  protected readonly activeHotspot = signal<Hotspot | null>(null);
  protected readonly Math = Math;

  private draggable?: Draggable[];

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initDraggable();
    }
  }

  private initDraggable() {
    const container = this.el.nativeElement.querySelector('.ba-container');
    const handle = this.el.nativeElement.querySelector('.ba-divider');
    const beforeClip = this.el.nativeElement.querySelector('.ba-before');

    this.draggable = Draggable.create(handle, {
      type: 'x',
      bounds: container,
      onDrag: () => this.updateClip(handle, beforeClip),
      onUpdate: () => this.updateClip(handle, beforeClip)
    });

    // Initial sync
    gsap.set(handle, { x: container.offsetWidth * this.sliderPos() });
    this.updateClip(handle, beforeClip);
  }

  private updateClip(handle: HTMLElement, beforeClip: HTMLElement) {
    const container = this.el.nativeElement.querySelector('.ba-container');
    const x = gsap.getProperty(handle, 'x') as number;
    const progress = x / container.offsetWidth;
    this.sliderPos.set(progress);
    gsap.set(beforeClip, { clipPath: `inset(0 ${100 - (progress * 100)}% 0 0)` });
  }

  ngOnDestroy() {
    if (this.draggable) {
      this.draggable[0].kill();
    }
  }
}
