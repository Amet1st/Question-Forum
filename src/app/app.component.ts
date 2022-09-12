import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
  
export class AppComponent implements OnInit{

  isSignedIn: boolean = false;

  constructor(
    public firebaseDatabase: AngularFireDatabase,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      this.isSignedIn = true;
    } else {
      this.isSignedIn = false;
    }
  }
  
  async onSignUp(email: string, password: string) {
    await this.authService.SignUp(email, password);
    if (this.authService.isLoggedIn) {
      this.isSignedIn = true;
    }
  }

  async onSignIn(email: string, password: string) {
    await this.authService.SignIn(email, password);
    if (this.authService.isLoggedIn) {
      this.isSignedIn = true;
    }
  }

  handleLogout() {
    this.isSignedIn = false;
  }
}
