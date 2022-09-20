import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
  
export class SignUpComponent implements OnInit {

  public isSubmitted = false;
  public isLoggedIn = false;
  public errorMessage: string = null;
  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router,
  ) { }


  ngOnInit(): void {
      this.initForm();
  }

  public onSubmit() {
    const controls = this.form.controls;
    this.isSubmitted = true;

    if (this.form.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAllAsTouched());
    }
    
    this.authService.signUp(controls['email'].value, controls['password'].value)
      .then(() => {
        this.form.reset();
        this.router.navigate(['home']);
      })
      .catch((error: Error) => {
         switch (error.message) {
          case 'Firebase: The email address is already in use by another account. (auth/email-already-in-use).':
            this.errorMessage = 'The email address is already in use by another account';
            break;
          case 'Firebase: The email address is badly formatted. (auth/invalid-email).':
            this.errorMessage = 'The email address is badly formatted.';
            break;
          default:
            this.errorMessage = 'An unknown error occurred';
            break;
        }
      })
  }

  private initForm() {
      this.form = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
        
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(18)
      ]]
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
      .then((result: firebase.default.auth.UserCredential) => {
        this.router.navigate(['home']);
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
}
