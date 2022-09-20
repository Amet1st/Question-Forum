import { Component, OnInit} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
  
export class SignInComponent implements OnInit {
  public isSubmitted = false;
  public errorMessage: string;
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
      .then(() => {
        this.form.reset();
        this.router.navigate(['/home']);
      })
      .catch((error: Error) => {
        switch (error.message) {
          case `Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).`:
            this.errorMessage = 'Incorrect password for this email!';
            break;
          case `Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).`:
            this.errorMessage = 'There is no such user!';
            break;
          case `A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred. (auth/network-request-failed).`:
            this.errorMessage = 'A network error';
            break;
          default:
            this.errorMessage = 'An unknown error occurred';
            break;
        }
      })

    this.form.reset();
  }

  public facebookAuth(): void {
    this.handleSocialAuth(this.authService.facebookAuth());
  }

  public githubAuth(): void {
    this.handleSocialAuth(this.authService.githubAuth());
  }

  public googleAuth(): void {
    this.handleSocialAuth(this.authService.googleAuth());
  }

  public handleSocialAuth(provider: Promise<firebase.default.auth.UserCredential>): void {
    const controls = this.form.controls;

    Object.keys(controls).forEach(controlName => controls[controlName].markAsUntouched());
    
    provider
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((error: Error) => {
        switch (error.message) {
          case `Firebase: An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address. (auth/account-exists-with-different-credential).`:
            this.errorMessage = 'An account already exists with the same email address but different sign-in credentials';
            break;
          default:
            this.errorMessage = 'An unknown error occurred';
            break;
        }
    })
  }

  public isControlInvalid(controlName: string): boolean {
    const control = this.form.controls[controlName];
    
    return control.invalid && control.touched;
  }

  public onFocus() {
    this.errorMessage = null;
    this.isSubmitted = false;
  }

}
