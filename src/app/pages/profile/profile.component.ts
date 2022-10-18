import {Component, OnDestroy, OnInit} from '@angular/core';
import { User } from 'src/app/models/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UsersService } from 'src/app/shared/services/users.service';
import {Subject, takeUntil} from "rxjs";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  private userEmail: string;
  public user: User;
  public role: string;
  private destroy = new Subject<boolean>()

  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) { }

  ngOnInit(): void {
    this.authService.getAuthState()
      .pipe(takeUntil(this.destroy))
      .subscribe(user => {
        if (user) {
          this.userEmail = user.email;
          this.getUser(this.userEmail);
        }
      });
  }

  private getUser(email: string): void {
    this.userService.getUserByEmail(email)
      .pipe(takeUntil(this.destroy))
      .subscribe(user => {
        if (user) {
          this.user = user;
          this.role = this.user.isAdmin ? 'Admin' : 'User';
        }
      });
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }

}
