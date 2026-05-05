import { trigger, transition, style, animate } from '@angular/animations';

export const routeTransitionAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ opacity: 0 }),
    animate('0.5s ease-in-out', style({ opacity: 1 }))
  ])
]);
