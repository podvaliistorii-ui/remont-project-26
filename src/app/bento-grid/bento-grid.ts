import { Component, inject, ElementRef, AfterViewInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../language.service';

@Component({
  selector: 'app-bento-grid',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './bento-grid.html',
  styleUrl: './bento-grid.scss',
})
export class BentoGrid implements AfterViewInit {
  protected i18n = inject(LanguageService);
  private el = inject(ElementRef);

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger effect: add class with a delay based on index if needed, 
          // or just rely on the CSS transition
          setTimeout(() => {
            entry.target.classList.add('reveal');
          }, index * 100); 
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const cards = this.el.nativeElement.querySelectorAll('.bento-card');
    cards.forEach((card: HTMLElement) => observer.observe(card));
  }
}
