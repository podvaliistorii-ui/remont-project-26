import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

import { LanguageService } from '../language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslateModule, RouterLink, RouterLinkActive, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly i18n = inject(LanguageService);
}

