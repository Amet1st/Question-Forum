import { Component, OnInit, SimpleChanges } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import * as firebse  from '@angular/fire/compat/auth';
import { User } from 'firebase/auth';
import { tap } from 'rxjs/operators';
import { OnChanges } from '@angular/core';
import { DoCheck } from '@angular/core';
import { Output } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, DoCheck {

  @Output() isLogout = new EventEmitter<void>();
  
  public isLoggedIn: User;
  public userEmail: string;
  public isMenuVisible = false;

  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  ngOnInit(): void {
    
  }

  ngDoCheck(): void {
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

  public toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  goToProfile() {
    
  }

  logout() {
    this.authService.signOut();
    this.isLogout.emit();
    this.router.navigate(['sign-in']);
  }
  
}
