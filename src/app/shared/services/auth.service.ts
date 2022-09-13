import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
  
export class AuthService {

  constructor(
    public ngFireStore: AngularFirestore, 
    public ngFireAuth: AngularFireAuth, 
  ) {}
  
  public handleResponse(promise: Promise<any>): Promise<any> {
    return promise;
  }

  public signIn(email: string, password: string): Promise<any> {
    return this.handleResponse(this.ngFireAuth.signInWithEmailAndPassword(email, password));
  }

  public signUp(email: string, password: string): Promise<any> {
    return this.handleResponse(this.ngFireAuth.createUserWithEmailAndPassword(email, password));
  }

  public signOut(): void {
    this.ngFireAuth.signOut();
  }
  
  public googleAuth(): Promise<void> {
    const gAuth = this.authLogin(new auth.GoogleAuthProvider());
    return gAuth;
  }

  public facebookAuth(): Promise<void> {
    const fAuth = this.authLogin(new auth.FacebookAuthProvider());
    return fAuth;
  }
  
  public githubAuth(): Promise<void> {
    const gtAuth = this.authLogin(new auth.GithubAuthProvider());
    return gtAuth;
  }
  
  private authLogin(provider: any) {
    return this.ngFireAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.setUserData(result.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  private setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.ngFireStore.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
}