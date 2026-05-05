import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, inject, signal, HostListener, PLATFORM_ID } from '@angular/core';
import { LanguageService } from '../language.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [TranslateModule, RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  protected i18n = inject(LanguageService);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  heroScale = signal(1);
  heroOpacity = signal(1);

  @HostListener('window:scroll')
  onScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    const scrollY = window.scrollY;
    const maxScroll = 600;
    const progress = Math.min(scrollY / maxScroll, 1);

    this.heroScale.set(1 - progress * 0.15);
    this.heroOpacity.set(1 - progress * 0.5);
  }
}
