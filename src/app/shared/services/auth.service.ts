import { Injectable} from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthProvider, User as FirebaseUser} from 'firebase/auth';
import { Observable, from } from 'rxjs';
import { UsersService } from './users.service';
import {UserCredential} from '@firebase/auth-types';
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  public currentUser: FirebaseUser;

  constructor(
    private usersService: UsersService,
    private ngFireAuth: AngularFireAuth,
    private router: Router
  ) {}

  public signIn(email: string, password: string): Observable<UserCredential> {
    return from(this.ngFireAuth.signInWithEmailAndPassword(email, password));
  }

  public signUp(email: string, password: string): Observable<UserCredential> {
    return from(this.ngFireAuth.createUserWithEmailAndPassword(email, password));
  }

  public googleAuth(): Observable<UserCredential> {
    return this.authLogin(new auth.GoogleAuthProvider());
  }

  public facebookAuth(): Observable<UserCredential> {
    return this.authLogin(new auth.FacebookAuthProvider());
  }

  public githubAuth(): Observable<UserCredential> {
    return from(this.authLogin(new auth.GithubAuthProvider()));
  }

  private authLogin(provider: AuthProvider): Observable<UserCredential> {
    return from(this.ngFireAuth.signInWithPopup(provider)
      .then(result => {
        this.usersService.createUserWithEmail(result.user.email);
        return result;
      }));
  }

  public signOut(): Observable<void> {
    return from(this.ngFireAuth.signOut());
  }

  public getAuthState(): Observable<FirebaseUser> {
    return this.ngFireAuth.authState;
  }

}



