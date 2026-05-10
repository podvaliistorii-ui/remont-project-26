import { Component, inject, signal, computed, AfterViewInit, OnDestroy, PLATFORM_ID, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService, LanguageCode } from '../../language.service';
import { ArticlesService, Article } from '../../articles.service';
import { Title, Meta } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './articles.html',
  styleUrl: './articles.scss',
})
export class ArticlesComponent implements AfterViewInit, OnDestroy {
  protected readonly languageService = inject(LanguageService);
  private readonly articlesService = inject(ArticlesService);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef);

  private readonly selectedArticleId = signal<number | null>(null);
  readonly readingProgress = signal(0);
  
  private scrollTriggerInstance?: ScrollTrigger;

  readonly localizedArticles = computed(() => {
    const lang = this.languageService.lang() as LanguageCode;
    return this.articlesService.articles().map((article: Article) => ({
      ...article,
      ...article.translations[lang]
    }));
  });

  readonly recommendedArticles = computed(() => {
    const currentId = this.selectedArticleId();
    return this.localizedArticles().filter((a: any) => a.id !== currentId).slice(0, 3);
  });

  readonly selectedArticle = computed(() => {
    const id = this.selectedArticleId();
    if (id === null) return null;
    const lang = this.languageService.lang() as LanguageCode;
    const article = this.articlesService.articles().find((a: Article) => a.id === id);
    const localized = article ? { ...article, ...article.translations[lang] } : null;
    
    if (localized) {
      this.titleService.setTitle(`${localized.title} | FixEntro Engineering`);
      this.metaService.updateTag({ name: 'description', content: localized.excerpt });
    }
    
    return localized;
  });

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initProgressTracking();
    }
  }

  private initProgressTracking(): void {
    if (this.scrollTriggerInstance) this.scrollTriggerInstance.kill();

    this.scrollTriggerInstance = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        this.readingProgress.set(Math.round(self.progress * 100));
      }
    });
  }

  selectArticle(article: any): void {
    this.selectedArticleId.set(article.id);
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    setTimeout(() => this.initProgressTracking(), 100);
  }

  closeArticle(): void {
    this.selectedArticleId.set(null);
    this.titleService.setTitle('Engineering Articles | FixEntro');
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    this.readingProgress.set(0);
    if (this.scrollTriggerInstance) this.scrollTriggerInstance.kill();
  }

  ngOnDestroy(): void {
    if (this.scrollTriggerInstance) this.scrollTriggerInstance.kill();
  }
}
