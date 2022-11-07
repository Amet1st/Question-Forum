import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DOCUMENT} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public theme$ = new BehaviorSubject<string>(`${this.theme}`);

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
    this.theme$.subscribe(theme => {
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
