import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  public isLoggedIn: User;
  public userEmail: string;
  public isMenuVisible = false;

  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  public ngOnInit(): void {
    this.authService.authStream$
      .pipe(
        tap((user: User) => {
          this.isLoggedIn = user;
          this.userEmail = user?.email;
        })
      )
    .subscribe(
      (user: User) => {
        this.isLoggedIn = user;
        this.userEmail = user?.email;
      }
    )
  }

  public toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  public goToProfile(): void {
    this.isMenuVisible = false;
  }

  public logOut(): void {
    this.isMenuVisible = false;
    this.authService.signOut();
    this.router.navigate(['/sign-in']);
  }

  
}
