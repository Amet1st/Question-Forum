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
  isLoggedIn: boolean = false;
  constructor(
    public ngFireStore: AngularFirestore, 
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone 
  ) {}
  
  SignIn(email: string, password: string) {
    this.ngFireAuth.signInWithEmailAndPassword(email, password)
      .then(result => {
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(result.user));
      })
      .catch((error) => {
        console.log(error.message);
      })
  }

  SignUp(email: string, password: string) {
    this.ngFireAuth.createUserWithEmailAndPassword(email, password)
      .then(result => {
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(result.user));
      })
      .catch((error) => {
        console.log(error.message);
      })
  }

  SignOut() {
    return this.ngFireAuth.signOut()
      .then(() => {
        localStorage.removeItem('user');
        this.router.navigate(['sign-in']);
      })
      .catch((error) => {
        console.log(error.message);
      })
  }
  
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      this.router.navigate(['home']);
    })
    .catch((error) => {
      console.log(error.message);
    })
  }

  FacebookAuth() {
    return this.AuthLogin(new auth.FacebookAuthProvider()).then((res: any) => {
      this.router.navigate(['home']);
    })
    .catch((error) => {
      console.log(error.message);
    })
  }
  
  GithubAuth() {
    return this.AuthLogin(new auth.GithubAuthProvider()).then((res: any) => {
      this.router.navigate(['home']);
    })
    .catch((error) => {
      console.log(error.message);
    })
  }
  
  AuthLogin(provider: any) {
    return this.ngFireAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.router.navigate(['home']);
        this.SetUserData(result.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  SetUserData(user: any) {
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