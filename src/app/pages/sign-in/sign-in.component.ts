import { Component, OnInit, Provider } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Route, Routes, Router } from '@angular/router';
import { AuthProvider, UserCredential } from 'firebase/auth';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
  
export class SignInComponent implements OnInit {
  public isSubmitted = false;
  public errorMessage: string | null;
  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    public afAuth: AngularFireAuth,
    public router: Router
  ) { }

  ngOnInit(): void {
      this.initForm();
  }

  private initForm() {
      this.form = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
        
      password: ['', [
        Validators.required,
      ]]
    })
  }

  public onSubmit() {
    const controls = this.form.controls;
    this.isSubmitted = true;

    if (this.form.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAllAsTouched());
    }

    this.authService.signIn(controls['email'].value, controls['password'].value)
      .then((result: Promise<any>) => { 
        this.form.reset();
        this.router.navigate(['home']);
      })
      .catch((error: Error) => {
        switch (error.message) {
          case 'Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).':
            this.errorMessage = 'Incorrect password and/or email!';
            break;
          case 'Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).':
            this.errorMessage = 'There is no such user!';
            break;
          default:
            this.errorMessage = 'An unknown error occurred';
            break;
        }
      })

    this.form.reset();
  }

  public facebookAuth() {
    this.authService.facebookAuth()
      .then((result: firebase.default.auth.UserCredential) => {
        this.authService.isLoggedIn = true;
        this.router.navigate(['home']);
    })
  }

  public githubAuth() {
    this.authService.githubAuth()
      .then((result: firebase.default.auth.UserCredential) => {
        this.authService.isLoggedIn = true;
        this.router.navigate(['home']);
    })
  }

  public googleAuth() {
    this.authService.googleAuth()
      .then((result: firebase.default.auth.UserCredential) => {
        this.authService.isLoggedIn = true;
        this.router.navigate(['home']);
    })
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.form.controls[controlName];
    
    return control.invalid && control.touched;
  }

  onFocus() {
    this.errorMessage = null;
    this.isSubmitted = false;
  }

}
