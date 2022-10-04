import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';
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

  public isLoggedIn: User;
  public userEmail: string;
  public userId: string;
  public isMenuVisible = false;
  private destroy = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router
  ) {
  }

  public ngOnInit(): void {
    this.authService.getAuthState()
      .pipe(takeUntil(this.destroy))
      .subscribe(user => {
        if (user) {
          this.isLoggedIn = user;
          this.userEmail = user.email;
        }
      });

  }

  public goToProfile() {
    this.isMenuVisible = false;
    this.getUser(this.userEmail);
  }

  private getUser(email: string) {
    return this.usersService.getUserByEmail(email)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        user => {
          if (user) {
            this.userId = user.id;
            this.router.navigate(['/users/' + this.userId]);
          }
        }
      );
  }

  public toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  public logOut(): void {
    this.isMenuVisible = false;

    this.authService.signOut()
      .subscribe(
        () => this.router.navigate(['/sign-in'])
      ),
      (error: Error) => {
        console.log(error.message);
      };
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
