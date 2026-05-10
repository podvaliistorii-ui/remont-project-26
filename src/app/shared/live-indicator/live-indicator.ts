import { Component, inject, signal, computed, effect, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-live-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="live-indicator">
      <div class="status-dot" #dot></div>
      <div class="status-text mono">
        <span class="text-content" #text>{{ currentText() }}</span>
      </div>
    </div>
  `,
  styles: [`
    .live-indicator {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 6px 12px;
      background: rgba(0,0,0,0.2);
      border: 1px solid rgba(196, 166, 122, 0.1);
      border-radius: 4px;
      pointer-events: none;
    }
    .status-dot {
      width: 6px;
      height: 6px;
      background: #22c55e;
      border-radius: 50%;
      box-shadow: 0 0 8px #22c55e;
    }
    .status-text {
      font-size: 10px;
      letter-spacing: 0.05em;
      color: var(--fx-text);
      opacity: 0.7;
      overflow: hidden;
      white-space: nowrap;
    }
    .mono { font-family: 'JetBrains Mono', monospace; }
  `]
})
export class LiveIndicatorComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  
  protected readonly currentText = signal('');
  private intervalId?: any;

  private readonly messages = [
    'ACTIVE_USERS: 04',
    'LAST_ESTIMATE: VAKE_7MIN_AGO',
    'ACTIVE_USERS: 07',
    'LAST_ESTIMATE: SABURTALO_12MIN_AGO',
    'ACTIVE_USERS: 03',
    'LAST_ESTIMATE: MTATSMINDA_2MIN_AGO',
    'SYSTEM_STATUS: STABLE_SYNC'
  ];

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentText.set(this.messages[0]);
      this.startRotation();
    }
  }

  private startRotation() {
    let idx = 0;
    this.intervalId = setInterval(() => {
      idx = (idx + 1) % this.messages.length;
      this.transitionText(this.messages[idx]);
    }, 20000);
  }

  private transitionText(newText: string) {
    const textEl = document.querySelector('.text-content');
    if (!textEl) {
      this.currentText.set(newText);
      return;
    }

    gsap.to(textEl, {
      y: -10,
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        this.currentText.set(newText);
        gsap.fromTo(textEl, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
      }
    });
  }

  flash() {
    const dot = document.querySelector('.status-dot');
    if (!dot) return;
    gsap.to(dot, {
      backgroundColor: '#fff',
      boxShadow: '0 0 20px #fff',
      scale: 1.5,
      duration: 0.3,
      yoyo: true,
      repeat: 3
    });
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
