import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about').then((m) => m.AboutComponent),
  },
  {
    path: 'portfolio',
    loadComponent: () =>
      import('./pages/portfolio/portfolio').then((m) => m.PortfolioComponent),
  },
  {
    path: 'portfolio/:id',
    loadComponent: () =>
      import('./pages/portfolio/project-detail/project-detail').then((m) => m.ProjectDetailComponent),
  },
  {
    path: 'calculator',
    loadComponent: () =>
      import('./pages/calculator/calculator').then((m) => m.CalculatorComponent),
  },
  {
    path: 'articles',
    loadComponent: () =>
      import('./pages/articles/articles').then((m) => m.ArticlesComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact').then((m) => m.ContactComponent),
  },
  {
    path: 'services/renovation-types',
    loadComponent: () =>
      import('./pages/services/renovation-types').then((m) => m.RenovationTypesComponent),
  },
  {
    path: 'services/specialists',
    loadComponent: () =>
      import('./pages/services/specialists').then((m) => m.SpecialistsComponent),
  },
  {
    path: 'services/commercial',
    loadComponent: () =>
      import('./pages/services/commercial').then((m) => m.CommercialComponent),
  },
  {
    path: 'services/residential',
    loadComponent: () =>
      import('./pages/services/residential').then((m) => m.ResidentialComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
