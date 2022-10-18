import { Directive } from '@angular/core';

@Directive({
  selector: '[appGetTheme]'
})
export class GetThemeDirective {

  private theme = localStorage.getItem('theme');

  ngOnInit() {
    switch (this.theme) {
      case 'Light':
        document.body.style.background = '#eee';
        break;
      case 'Dark':
        document.body.style.background = '#121212';
        break;
    }
  }

}
