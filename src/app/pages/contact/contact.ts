import { Component, inject, AfterViewInit, PLATFORM_ID, ElementRef, signal, HostListener, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LanguageService } from '../../language.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent implements AfterViewInit {
  protected readonly i18n = inject(LanguageService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly el = inject(ElementRef);

  name = '';
  phone = '';
  district = '';
  brief = '';
  
  isSubmitting = signal(false);
  sent = signal(false);

  // Signals for architectural interaction
  mouseX = signal(0);
  mouseY = signal(0);
  copyToast = signal<{ show: boolean, text: string }>({ show: false, text: '' });

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.mouseX.set(e.clientX);
    this.mouseY.set(e.clientY);
  }

  readonly displayCoords = computed(() => {
    const lat = 41.7100 + (this.mouseY() / 100000);
    const lon = 44.7600 + (this.mouseX() / 100000);
    return `${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`;
  });

  copyToClipboard(text: string, label: string): void {
    if (isPlatformBrowser(this.platformId)) {
      navigator.clipboard.writeText(text).then(() => {
        this.copyToast.set({ show: true, text: `${label} copied` });
        setTimeout(() => this.copyToast.set({ show: false, text: '' }), 2000);
      });
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initRevealObserver();
    }
  }

  private initRevealObserver(): void {
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

  submit(form: NgForm): void {
    if (form.invalid || this.isSubmitting()) return;
    
    this.isSubmitting.set(true);

    if (isPlatformBrowser(this.platformId)) {
      window.open(this.buildWhatsAppUrl(), '_blank', 'noopener,noreferrer');
    }

    this.isSubmitting.set(false);
    this.sent.set(true);

    setTimeout(() => {
      this.sent.set(false);
      form.resetForm({ district: '' });
    }, 2500);
  }

  private buildWhatsAppUrl(): string {
    const districtLabel = this.district ? this.i18n.t(`CALCULATOR.DISTRICTS.${this.district}`) : 'Other';
    const message = [
      'FixEntro inquiry',
      `Name: ${this.clean(this.name)}`,
      `Phone: ${this.clean(this.phone)}`,
      `District: ${this.clean(districtLabel)}`,
      `Brief: ${this.clean(this.brief)}`,
    ].join('\n');

    return `https://wa.me/995558105574?text=${encodeURIComponent(message)}`;
  }

  private clean(value: string): string {
    return value.replace(/\s+/g, ' ').trim().slice(0, 900);
  }
}
