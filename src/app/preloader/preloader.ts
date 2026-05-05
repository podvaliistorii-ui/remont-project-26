import { Component, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-preloader',
  standalone: true,
  templateUrl: './preloader.html',
  styleUrl: './preloader.scss',
})
export class PreloaderComponent implements AfterViewInit {
  ngAfterViewInit() {
    const tl = gsap.timeline();
    
    // Animate percentage text
    const progress = { val: 0 };
    tl.to(progress, {
      val: 100,
      duration: 2,
      onUpdate: () => {
        const el = document.querySelector('.preloader-progress');
        if (el) el.textContent = Math.round(progress.val) + '%';
      }
    })
    .to('.preloader', {
      yPercent: -100,
      duration: 1,
      ease: 'power4.inOut'
    });
  }
}