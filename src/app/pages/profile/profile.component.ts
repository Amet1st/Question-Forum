import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/interfaces/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user: User;
  public role: string;

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.url[1].path;

    this.userService.getUserById(id)
      .subscribe(user => {
        this.user = user;
        this.role = user?.isAdmin ? 'Admin' : 'User';
      });
  }

}
