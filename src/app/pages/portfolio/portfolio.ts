import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PortfolioService } from '../../portfolio.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
})
export class PortfolioComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly portfolioService = inject(PortfolioService);

  protected readonly items = this.portfolioService.projects;

  ngOnInit(): void {
    console.log('Portfolio initialized (Static Mode)');
    console.log('Items:', this.items());
  }

  protected navigateToProject(event: MouseEvent, id: string): void {
    event.preventDefault();
    this.router.navigate(['/portfolio', id]);
  }
}
