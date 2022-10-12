import {AfterViewInit, Directive, ElementRef, EventEmitter, Inject, Input, Output} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Directive({
  selector: '[appSwitchTheme]'
})
export class SwitchThemeDirective implements AfterViewInit{

  @Output() isDarkTheme = new EventEmitter<boolean>();
  @Input('appSwitchTheme') theme: string;

  constructor(
    private element: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngAfterViewInit() {

  }

}
