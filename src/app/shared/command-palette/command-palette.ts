import { Component, inject, signal, computed, HostListener, ElementRef, ViewChild, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UiStateService } from '../../ui-state.service';
import { LanguageService } from '../../language.service';
import { ArticlesService } from '../../articles.service';
import { PortfolioService, Project } from '../../portfolio.service';
import { Article } from '../../articles.service';
import { gsap } from 'gsap';

export interface CommandResult {
  id: string | number;
  type: 'service' | 'project' | 'article' | 'action';
  title: string;
  route: string;
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="palette-overlay" [class.open]="isOpen()" (click)="close()">
      <div class="palette-window" (click)="$event.stopPropagation()" #window>
        
        <div class="search-input-wrap">
          <span class="search-icon mono">CMD_</span>
          <input type="text" [(ngModel)]="query" 
                 (input)="search()" 
                 placeholder="Search services, projects, articles..." 
                 spellcheck="false" #input />
          <span class="esc-hint mono">ESC_TO_EXIT</span>
        </div>

        <div class="results-container">
          <div class="results-group" *ngIf="filteredResults().length > 0">
            <div class="result-item" *ngFor="let res of filteredResults(); let i = index" 
                 (click)="navigate(res.route)"
                 [class.active]="i === selectedIndex()">
              <span class="res-type mono">{{ res.type }}</span>
              <span class="res-title fx-serif">{{ res.title }}</span>
              <span class="res-arrow">&rarr;</span>
            </div>
          </div>

          <div class="no-results mono" *ngIf="query() && filteredResults().length === 0">
            NO_MATCHES_FOUND_IN_FIXENTRO_DB
          </div>

          <!-- Shortcut Hints -->
          <div class="palette-footer">
            <div class="hint"><span class="key">C</span> CALCULATOR</div>
            <div class="hint"><span class="key">P</span> PORTFOLIO</div>
            <div class="hint"><span class="key">L</span> CONTACT</div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .palette-overlay {
      position: fixed; inset: 0; z-index: 10000;
      background: rgba(0,0,0,0.4); backdrop-filter: blur(10px);
      display: flex; align-items: flex-start; justify-content: center;
      padding-top: 15vh; opacity: 0; visibility: hidden; transition: all 0.3s;
      &.open { opacity: 1; visibility: visible; }
    }

    .palette-window {
      width: 100%; max-width: 600px;
      background: rgba(15, 15, 14, 0.95);
      border: 1px solid var(--fx-line-strong);
      box-shadow: 0 40px 100px rgba(0,0,0,0.5);
      overflow: hidden;
      transform: scale(0.95);
    }

    .search-input-wrap {
      display: flex; align-items: center; padding: 25px;
      border-bottom: 1px solid var(--fx-line);
      .search-icon { color: var(--fx-accent); font-size: 10px; margin-right: 20px; }
      input {
        flex: 1; background: transparent; border: none; outline: none;
        color: #fff; font-size: 18px; font-family: var(--fx-font-serif);
      }
      .esc-hint { font-size: 8px; opacity: 0.3; }
    }

    .results-container { max-height: 400px; overflow-y: auto; }

    .result-item {
      padding: 20px 25px; display: flex; align-items: center; gap: 20px;
      cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.05);
      transition: background 0.2s;
      &.active, &:hover { background: rgba(196, 166, 122, 0.1); .res-arrow { transform: translateX(5px); opacity: 1; } }
      .res-type { font-size: 8px; opacity: 0.4; text-transform: uppercase; width: 60px; }
      .res-title { font-size: 18px; flex: 1; }
      .res-arrow { opacity: 0; transition: all 0.3s; color: var(--fx-accent); }
    }

    .no-results { padding: 40px; text-align: center; font-size: 10px; opacity: 0.5; }

    .palette-footer {
      padding: 15px 25px; background: rgba(0,0,0,0.3);
      display: flex; gap: 30px; border-top: 1px solid var(--fx-line);
      .hint { font-size: 9px; opacity: 0.4; letter-spacing: 0.1em; display: flex; align-items: center; gap: 8px; }
      .key { padding: 2px 6px; border: 1px solid rgba(255,255,255,0.2); border-radius: 3px; font-weight: 800; color: var(--fx-accent); }
    }
  `]
})
export class CommandPaletteComponent implements AfterViewInit {
  private readonly uiState = inject(UiStateService);
  private readonly router = inject(Router);
  private readonly i18n = inject(LanguageService);
  private readonly portfolio = inject(PortfolioService);
  private readonly articles = inject(ArticlesService);

  @ViewChild('window') windowEl!: ElementRef;
  @ViewChild('input') inputEl!: ElementRef;

  readonly isOpen = this.uiState.commandPaletteOpen;
  readonly query = signal('');
  readonly selectedIndex = signal(0);

  private readonly staticResults: CommandResult[] = [
    { id: 'c', type: 'action', title: 'Open Calculator', route: '/calculator' },
    { id: 'p', type: 'action', title: 'View Portfolio', route: '/portfolio' },
    { id: 'l', type: 'action', title: 'Contact Us', route: '/contact' },
    { id: 's1', type: 'service', title: 'Renovation Types', route: '/services/renovation-types' },
    { id: 's2', type: 'service', title: 'Engineering Specialists', route: '/services/specialists' },
    { id: 's3', type: 'service', title: 'Commercial Renovation', route: '/services/commercial' },
    { id: 's4', type: 'service', title: 'Residential Renovation', route: '/services/residential' }
  ];

  readonly filteredResults = computed(() => {
    const q = this.query().toLowerCase();
    if (!q) return this.staticResults;

    const dynamic: CommandResult[] = [];
    
    // Add Projects
    this.portfolio.projects().forEach(p => {
      const title = this.i18n.t(p.titleKey);
      if (title.toLowerCase().includes(q)) {
        dynamic.push({ id: p.id, type: 'project', title: title, route: `/portfolio/${p.id}` });
      }
    });

    // Add Articles
    this.articles.articles().forEach(a => {
      const title = a.translations[this.i18n.lang() as 'en' | 'ru' | 'ka'].title;
      if (title.toLowerCase().includes(q)) {
        dynamic.push({ id: a.id, type: 'article', title: title, route: '/articles' });
      }
    });

    return [...this.staticResults.filter(r => r.title.toLowerCase().includes(q)), ...dynamic].slice(0, 8);
  });

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        setTimeout(() => this.inputEl.nativeElement.focus(), 100);
        gsap.to(this.windowEl.nativeElement, { scale: 1, opacity: 1, duration: 0.5, ease: 'elastic.out(1, 0.75)' });
      } else {
        if (this.windowEl) {
          gsap.to(this.windowEl.nativeElement, { scale: 0.95, opacity: 0, duration: 0.3 });
        }
      }
    });
  }

  ngAfterViewInit() {}

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(e: KeyboardEvent) {
    if (!this.isOpen()) return;

    if (e.key === 'Escape') this.close();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex.update(i => (i + 1) % this.filteredResults().length);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex.update(i => (i - 1 + this.filteredResults().length) % this.filteredResults().length);
    }
    if (e.key === 'Enter') {
      const res = this.filteredResults()[this.selectedIndex()];
      if (res) this.navigate(res.route);
    }
  }

  search() {
    this.selectedIndex.set(0);
  }

  navigate(route: string) {
    this.router.navigateByUrl(route);
    this.close();
  }

  close() {
    this.uiState.closeCommandPalette();
    this.query.set('');
  }
}
