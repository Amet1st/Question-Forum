import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UsersService } from 'src/app/shared/services/users.service';
import {Subject} from "rxjs";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public user: User;
  public role: string;
  private destroy = new Subject<boolean>()

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.url[1].path;

    this.userService.getUserById(id)
      .pipe()
      .subscribe(user => {
        this.user = user;
        this.role = user?.isAdmin ? 'Admin' : 'User';
      });
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }

}
