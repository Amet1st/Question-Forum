import {Injectable} from '@angular/core';
import * as auth from 'firebase/auth';
import {AuthProvider, User as FirebaseUser} from 'firebase/auth';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {from, Observable} from 'rxjs';
import {UsersService} from './users.service';
import {UserCredential} from '@firebase/auth-types';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private _user: FirebaseUser;

  constructor(
    private usersService: UsersService,
    private ngFireAuth: AngularFireAuth,
  ) {}

  get currentUser(): FirebaseUser {
    if (this._user) {
      return this._user;
    }

    return null;
  }

  set currentUser(user: FirebaseUser) {
    this._user = user;
  }

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

  public signOut(): Observable<void> {
    this.currentUser = null;
    return from(this.ngFireAuth.signOut());
  }

  public getAuthState(): Observable<FirebaseUser> {
    return this.ngFireAuth.authState;
  }

  private authLogin(provider: AuthProvider): Observable<UserCredential> {
    return from(this.ngFireAuth.signInWithPopup(provider)
      .then(result => {
        this.usersService.createUserWithEmail(result.user.email);
        return result;
      }));
  }

}



