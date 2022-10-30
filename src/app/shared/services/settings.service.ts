import {Inject, Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {DOCUMENT} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public themeStream = new Subject<string>();

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
    this.theme = this.theme;
    this.themeStream.subscribe(theme => {
      this.theme = theme;
    });
  }

  get theme(): string {
    return localStorage.getItem('theme');
  }

  set theme(theme: string) {
    localStorage.setItem('theme', theme);
    this.changeTheme(theme);
  }

  get display(): string {
    return localStorage.getItem('display');
  }

  set display(display: string) {
    localStorage.setItem('display', display);
  }

  private changeTheme(theme: string): void {
    switch (theme) {
      case 'Light':
        document.body.style.background = '#eee';
        break;
      case 'Dark':
        document.body.style.background = '#121212';
        break;
    }
  }

}
