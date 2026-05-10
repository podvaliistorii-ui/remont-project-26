import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {
  // Persistence for Before/After slider position
  readonly beforeAfterPosition = signal(0.5);
  
  // Command Palette Visibility
  readonly commandPaletteOpen = signal(false);

  toggleCommandPalette() {
    this.commandPaletteOpen.update(v => !v);
  }

  closeCommandPalette() {
    this.commandPaletteOpen.set(false);
  }
}
