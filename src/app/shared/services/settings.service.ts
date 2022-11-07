import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {ThemeOption} from '../../models/types/theme-option.type';
import {DisplayOption} from '../../models/types/display-option.type';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public theme$ = new BehaviorSubject<ThemeOption>(`${this.theme}`);

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
    this.theme$.subscribe(theme => {
      this.theme = theme;
    });
  }

  get theme(): ThemeOption {
    return localStorage.getItem('theme') === 'null' ?
      null :
      localStorage.getItem('theme') as ThemeOption;
  }

  set theme(theme: ThemeOption) {
    localStorage.setItem('theme', theme);
    this.changeTheme(theme);
  }

  get display(): DisplayOption {
    return localStorage.getItem('display') as DisplayOption;
  }

  set display(display: DisplayOption) {
    localStorage.setItem('display', display);
  }

  private changeTheme(theme: ThemeOption): void {
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
