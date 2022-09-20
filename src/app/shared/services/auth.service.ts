import { Injectable} from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthProvider, User} from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
  
export class AuthService {

  constructor(
    public ngFireAuth: AngularFireAuth,
  ) {}
  
  public signIn(email: string, password: string): Promise<firebase.default.auth.UserCredential> {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

  public signUp(email: string, password: string): Promise<firebase.default.auth.UserCredential> {
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password);
  }

  public googleAuth(): Promise<firebase.default.auth.UserCredential> {
    return this.authLogin(new auth.GoogleAuthProvider());
  }

  public facebookAuth(): Promise<firebase.default.auth.UserCredential> {
    return this.authLogin(new auth.FacebookAuthProvider());
  }
  
  public githubAuth(): Promise<firebase.default.auth.UserCredential> {
    return this.authLogin(new auth.GithubAuthProvider());
  }
  
  private authLogin(provider: AuthProvider) {
    return this.ngFireAuth.signInWithPopup(provider);
  }

  public signOut(): Promise<void>  {
    return this.ngFireAuth.signOut();
  }

  public getAuthState(): Observable<User> {
    return this.ngFireAuth.authState;
  }

}



