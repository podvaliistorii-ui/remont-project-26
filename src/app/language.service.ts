import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type LanguageCode = 'en' | 'ru' | 'ka';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly supportedLanguages: readonly LanguageCode[] = ['en', 'ru', 'ka'];
  readonly lang = signal<LanguageCode>(this.detectInitialLanguage());

  constructor() {
    this.translate.addLangs([...this.supportedLanguages]);
    this.translate.setDefaultLang('en');

    const initial = this.lang();
    this.translate.use(initial);
    this.applyLanguageState(initial);

    this.translate.onLangChange.subscribe((event) => {
      if (this.isSupported(event.lang)) {
        this.lang.set(event.lang);
        this.applyLanguageState(event.lang);
      }
    });
  }

  setLang(next: string): void {
    if (!this.isSupported(next)) {
      return;
    }

    this.translate.use(next);
  }

  t(key: string): string {
    return this.translate.instant(key);
  }

  private detectInitialLanguage(): LanguageCode {
    if (!isPlatformBrowser(this.platformId)) {
      return 'en';
    }

    const stored = localStorage.getItem('fixentro-lang');
    if (stored && this.isSupported(stored)) {
      return stored;
    }

    const browserLang = navigator.language?.slice(0, 2).toLowerCase();
    return this.isSupported(browserLang) ? browserLang : 'en';
  }

  private applyLanguageState(lang: LanguageCode): void {
    this.document.documentElement.lang = lang;
    this.document.body.classList.toggle('lang-ka', lang === 'ka');

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('fixentro-lang', lang);
    }
  }

  private isSupported(value: string): value is LanguageCode {
    return this.supportedLanguages.includes(value as LanguageCode);
  }
}
