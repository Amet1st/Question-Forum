import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
  
export class AuthService {
  public isLoggedIn: boolean = false;
  constructor(
    public ngFireStore: AngularFirestore, 
    public ngFireAuth: AngularFireAuth, 
  ) {}
  
  public handleResponse(promise: Promise<any>): Promise<any> {
    return promise;
  }

  public signIn(email: string, password: string) {
    this.handleResponse(this.ngFireAuth.signInWithEmailAndPassword(email, password))
      .then(result => {
        this.isLoggedIn = true;
      })
      .catch((error) => {
        console.log(error.message);
      })
  }

  public signUp(email: string, password: string): void {
    this.handleResponse(this.ngFireAuth.createUserWithEmailAndPassword(email, password))
    .then(result => {
      this.isLoggedIn = true;
    })
    .catch((error) => {
      console.log(error.message);
    })
  }

  public signOut(): void {
    this.ngFireAuth.signOut()
    .catch((error) => {
        console.log(error.message);
      })
  }
  
  public googleAuth() {
    return this.authLogin(new auth.GoogleAuthProvider()).then((res: any) => {})
    .catch((error) => {
      console.log(error.message);
    })
  }

  public facebookAuth() {
    return this.authLogin(new auth.FacebookAuthProvider())
    .then((res: any) => {})
    .catch((error) => {
      console.log(error.message);
    })
  }
  
  public githubAuth() {
    return this.authLogin(new auth.GithubAuthProvider()).then((res: any) => {})
    .catch((error) => {
      console.log(error.message);
    })
  }
  
  public authLogin(provider: any) {
    return this.ngFireAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.setUserData(result.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  public setUserData(user: any) {
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