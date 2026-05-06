import { Component, inject, signal, computed, AfterViewInit, PLATFORM_ID, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService, LanguageCode } from '../../language.service';
import { ArticlesService } from '../../articles.service';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './articles.html',
  styleUrl: './articles.scss',
})
export class ArticlesComponent {
  protected readonly languageService = inject(LanguageService);
  private readonly articlesService = inject(ArticlesService);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

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
    const localized = article ? { ...article, ...article.translations[lang] } : null;
    
    if (localized) {
      this.titleService.setTitle(`${localized.title} | FixEntro Engineering`);
      this.metaService.updateTag({ name: 'description', content: localized.summary });
    } else {
      this.titleService.setTitle('Engineering Articles | FixEntro');
    }
    
    return localized;
  });

  setHoveredImage(url: string | null): void {
    this.hoveredImage.set(url);
  }

  selectArticle(article: any): void {
    this.selectedArticleId.set(article.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeArticle(): void {
    this.selectedArticleId.set(null);
    this.titleService.setTitle('Engineering Articles | FixEntro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
