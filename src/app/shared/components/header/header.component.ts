import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UsersService } from '../../services/users.service';

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
  private destroy = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router
  ) {
  }

  ngOnInit(): void {

    this.authService.getAuthState()
      .pipe(takeUntil(this.destroy))
      .subscribe(user => {
          this.isLoggedIn = !!user;
          if (user) {
            this.userEmail = user.email;
          }
      });

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
