import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';
import { Router } from '@angular/router';
import { OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  
  public isLoggedIn: User;
  public userEmail: string;
  public isMenuVisible = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.authService.getAuthState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (user: User) => {
          this.isLoggedIn = user;
          this.userEmail = user.email;
        }
      );
  }

  public toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  public goToProfile(): void {
    this.isMenuVisible = false;
  }

  public logOut(): void {
    this.isMenuVisible = false;

    this.authService.signOut()
      .then(
        () => this.router.navigate(['/sign-in'])
      )
      .catch((error: Error) => {
        console.warn(error.message);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
