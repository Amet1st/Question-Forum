import { Injectable} from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthProvider, User} from 'firebase/auth';
import { Observable, from } from 'rxjs';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
  
export class AuthService {

  constructor(
    private usersService: UsersService,
    private ngFireAuth: AngularFireAuth,
  ) {}
  
  public signIn(email: string, password: string): Observable<firebase.default.auth.UserCredential> {
    return from(this.ngFireAuth.signInWithEmailAndPassword(email, password));
  }

  public signUp(email: string, password: string): Observable<firebase.default.auth.UserCredential> {
    return from(this.ngFireAuth.createUserWithEmailAndPassword(email, password));
  }

  public googleAuth(): Observable<firebase.default.auth.UserCredential> {
    return this.authLogin(new auth.GoogleAuthProvider());
  }

  public facebookAuth(): Observable<firebase.default.auth.UserCredential> {
    return this.authLogin(new auth.FacebookAuthProvider());
  }
  
  public githubAuth(): Observable<firebase.default.auth.UserCredential> {
    return from(this.authLogin(new auth.GithubAuthProvider()));
  }
  
  private authLogin(provider: AuthProvider): Observable<firebase.default.auth.UserCredential> {
    return from(this.ngFireAuth.signInWithPopup(provider));
  }

  public signOut(): Observable<void> {
    return from(this.ngFireAuth.signOut());
  }

  public getAuthState(): Observable<User> {
    return this.ngFireAuth.authState;
  }

}



