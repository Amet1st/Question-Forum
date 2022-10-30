import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {UsersService} from '../../services/users.service';
import {SettingsService} from '../../services/settings.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public isLoggedIn: boolean;
  public userEmail: string;
  public userId: string;
  public isMenuOpened = false;
  public theme = 'Light';
  private destroy = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router,
    private settingsService: SettingsService
  ) {
  }

  ngOnInit(): void {
    this.theme = this.settingsService.theme;

    this.settingsService.themeStream
      .pipe(takeUntil(this.destroy))
      .subscribe(theme => {
        this.theme = theme;
      });

    this.authService.getAuthState().subscribe(user => {
        this.userEmail = user?.email;
        this.isLoggedIn = !!user;

    })
  }

  public goToProfile() {
    this.isMenuOpened = false;
    this.router.navigate(['/profile']);
  }

  public toggleMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  public logOut(): void {
    this.isMenuOpened = false;

    this.authService.signOut()
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.router.navigate(['/sign-in']))
  }

  public clickOutside(): void {
    this.isMenuOpened = false;
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
