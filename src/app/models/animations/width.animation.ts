import {animate, style, transition, trigger} from "@angular/animations";

export const WidthAnimation = trigger('width', [
  transition('Tiled => Inline', [
    style({
      width: '30%',
    }),
    animate('500ms ease-out', style({
      width: '60%'
    }))
  ]),
  transition('Inline => Tiled', [
    style({
      width: '60%',
    }),
    animate('700ms ease-out', style({
      width: '30%'
    }))
  ])
]);
