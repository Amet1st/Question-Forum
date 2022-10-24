import {animate, style, transition, trigger} from "@angular/animations";

export const AppearanceAnimation = trigger('appearance', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'scale(0.5)'
    }),
    animate('400ms ease-out', style({
    }))
  ]),
  transition(':leave', [
    style({
      opacity: 1
    }),
    animate('400ms ease-out', style({
      opacity: 0,
      transform: 'scale(0.5)'
    }))
  ])
])
