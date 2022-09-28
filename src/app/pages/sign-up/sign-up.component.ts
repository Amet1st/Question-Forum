import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/shared/services/users.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/interfaces/user';
import { isAdmin } from '@firebase/util';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
  
export class SignUpComponent implements OnInit, OnDestroy {

  public isSubmitted = false;
  public errorMessage: string;
  public form: FormGroup;
  private destroy = new Subject<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
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

  public onSubmit(): void {
    const controls = this.form.controls;
    this.isSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.authService
      .signUp(controls['email'].value, controls['password'].value)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.setUser();
          this.form.reset();
          this.router.navigate(['/home']);
        },
        error: (error: Error) => {
          this.errorMessage = this.handleError(error.message);
        }
      });
  }

   public handleSocialAuth(provider: Observable<firebase.default.auth.UserCredential>): void {
    
    this.form.markAsUntouched();
    
    provider
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.setUser();
          this.form.reset();
        },
        error: (error: Error): void => {
          this.errorMessage = this.handleError(error.message);
        }
      });
  }


  private setUser() {
    this.authService.getAuthState()
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (user) => {
          this.createUser(user.email);
        }
    })
  }

  private createUser(email: string) {
    this.usersService.createUser({
      email,
      dateOfSignUp: new Date(),
      isAdmin: false,
      posts: 0
    })
      .subscribe(() => {
         this.router.navigate(['/home']);
      });
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

  private handleError(message: string): string {
    switch (message) {
      case 'Firebase: The email address is already in use by another account. (auth/email-already-in-use).':
        return 'The email address is already in use by another account';
      case 'Firebase: The email address is badly formatted. (auth/invalid-email).':
        return 'The email address is badly formatted.';
      case `A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred. (auth/network-request-failed).`:
        return 'A network error';
      case `Firebase: An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address. (auth/account-exists-with-different-credential).`:
        return 'An account already exists with the same email address but different sign-in credentials';
      default:
        return 'An unknown error occurred';
    }
  }

  public isControlInvalid(controlName: string): boolean {
    const control = this.form.controls[controlName];
    
    return control.invalid && control.touched;

  }

  public onFocus(): void {
    this.errorMessage = null;
    this.isSubmitted = false;
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

}
