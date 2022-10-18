import {Directive, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {Subject, takeUntil} from "rxjs";

@Directive({
  selector: '[appSwitchTheme]'
})
export class SwitchThemeDirective implements OnInit, OnDestroy {

  @Input('appSwitchTheme') themeStream: Subject<string>;
  private destroy = new Subject<boolean>();

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {
    this.changeTheme(localStorage.getItem('theme'));

    this.themeStream
      .pipe(takeUntil(this.destroy))
      .subscribe(theme => {
        this.changeTheme(theme);
      })
  }

  private changeTheme(theme: string): void {
    switch (theme) {
      case 'Light':
        localStorage.setItem('theme', theme);
        document.body.style.background = '#eee';
        break;
      case 'Dark':
        localStorage.setItem('theme', theme);
        document.body.style.background = '#121212';
        break;
    }
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }

}
