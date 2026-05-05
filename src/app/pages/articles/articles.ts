import { Component, inject, signal, computed, AfterViewInit, PLATFORM_ID, ElementRef, effect } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService, LanguageCode } from '../../language.service';
import { ArticlesService, Article } from '../../articles.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './articles.html',
  styleUrl: './articles.scss',
})
export class ArticlesComponent implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef);
  protected readonly languageService = inject(LanguageService);
  private readonly articlesService = inject(ArticlesService);
  private readonly router = inject(Router);

  private readonly selectedArticleId = signal<number | null>(null);
  readonly hoveredImage = signal<string | null>(null);

  readonly localizedArticles = computed(() => {
    const lang = this.languageService.lang() as LanguageCode;
    return this.articlesService.articles().map(article => ({
      ...article,
      ...article.translations[lang]
    }));
  });

  readonly selectedArticle = computed(() => {
    const id = this.selectedArticleId();
    if (id === null) return null;
    const lang = this.languageService.lang() as LanguageCode;
    const article = this.articlesService.articles().find(a => a.id === id);
    return article ? { ...article, ...article.translations[lang] } : null;
  });

  constructor() {
    // Ensure IntersectionObserver re-runs when switching views or language
    effect(() => {
      this.localizedArticles();
      this.selectedArticleId();
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.initRevealObserver(), 300);
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initRevealObserver();
    }
  }

  private initRevealObserver(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const revealElements = this.el.nativeElement.querySelectorAll('[data-reveal]');
    revealElements.forEach((el: HTMLElement) => observer.observe(el));
  }

  setHoveredImage(url: string | null): void {
    this.hoveredImage.set(url);
  }

  selectArticle(article: any): void {
    this.selectedArticleId.set(article.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeArticle(): void {
    this.selectedArticleId.set(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateToCalculator(): void {
    this.router.navigate(['/calculator']);
  }
}
