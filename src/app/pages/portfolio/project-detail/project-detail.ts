import { Component, inject, input, AfterViewInit, ElementRef, ViewChildren, QueryList, PLATFORM_ID, signal, OnInit, effect } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PortfolioService, Project } from '../../../portfolio.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
})
export class ProjectDetailComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly platformId = inject(PLATFORM_ID);
  
  readonly id = input.required<string>();
  readonly selectedImage = signal<string | null>(null);
  readonly currentProject = signal<Project | undefined>(undefined);

  constructor() {
    // Effect to update project whenever the ID changes
    effect(() => {
      const projectId = this.id();
      console.log('ProjectDetail ID changed to:', projectId);
      const p = this.portfolioService.getProjectById(projectId);
      this.currentProject.set(p);
      console.log('Project found:', p);
    });
  }

  ngOnInit(): void {
    console.log('ProjectDetailComponent initialized with ID:', this.id());
  }

  protected openLightbox(url: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.selectedImage.set(url);
    document.body.style.overflow = 'hidden';
  }

  protected closeLightbox(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.selectedImage.set(null);
    document.body.style.overflow = '';
  }
}
