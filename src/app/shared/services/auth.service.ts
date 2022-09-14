import { Injectable, NgZone } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AuthProvider, GoogleAuthProvider, UserCredential } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
  
export class AuthService {
  public isLoggedIn = false;

  constructor(
    public ngFireStore: AngularFirestore, 
    public ngFireAuth: AngularFireAuth 
  ) {}
  
  public handleResponse(promise: Promise<any>): Promise<any> {
    return promise.then((result: any) => {
      this.isLoggedIn = true;
    });
  }

  public signIn(email: string, password: string): Promise<any> {
    return this.handleResponse(this.ngFireAuth.signInWithEmailAndPassword(email, password));
  }

  public signUp(email: string, password: string): Promise<any> {
    return this.handleResponse(this.ngFireAuth.createUserWithEmailAndPassword(email, password));
  }

  public signOut(): void {
    this.ngFireAuth.signOut().then((result: any) => {
      this.isLoggedIn = false;
    });
  }
  
  public googleAuth(): Promise<firebase.default.auth.UserCredential> {
    return this.handleResponse(this.authLogin(new auth.GoogleAuthProvider())); 
  }

  public facebookAuth(): Promise<firebase.default.auth.UserCredential> {
    return this.handleResponse(this.authLogin(new auth.FacebookAuthProvider()));
  }
  
  public githubAuth(): Promise<firebase.default.auth.UserCredential> {
    return this.handleResponse(this.authLogin(new auth.GithubAuthProvider())); 
  }
  
  private authLogin(provider: AuthProvider ) {
    return this.ngFireAuth.signInWithPopup(provider);
  }

}