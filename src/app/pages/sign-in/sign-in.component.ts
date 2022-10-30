import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from 'src/app/shared/services/auth.service';
import {Router} from '@angular/router';
import {Observable, Subject, takeUntil} from 'rxjs';
import {UserCredential} from "@firebase/auth-types";
import {AppearanceAnimation} from "../../models/animations/appearence.animation";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  animations: [AppearanceAnimation]
})

export class SignInComponent implements OnInit, OnDestroy {

  public isSubmitted = false;
  public errorMessage: string;
  public form: FormGroup;
  private destroy = new Subject<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  public onSubmit(): void {
    const controls = this.form.controls;
    this.isSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }

    this.authService.signIn(controls['email'].value, controls['password'].value)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.form.reset();
          this.router.navigate(['/home']);
        },
        error: (error: Error): void => {
          this.errorMessage = this.handleError(error.message);
        }
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

  public handleSocialAuth(provider: Observable<UserCredential>): void {
    this.form.markAsUntouched();

    provider
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.form.reset();
          this.router.navigate(['/home']);
        },
        error: (error: Error): void => {
          this.errorMessage = this.handleError(error.message);
        }
      });
  }

  public isControlInvalid(controlName: string): boolean {
    const control = this.form.controls[controlName];

    return control.invalid && control.touched;
  }

  public onFocus(): void {
    this.errorMessage = null;
    this.isSubmitted = false;
  }

  ngOnDestroy() {
   this.destroy.next(true);
   this.destroy.complete();
  }

  private initForm(): void {
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

  private handleError(message: string): string {
    switch (message) {
      case `Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).`:
        return 'Incorrect password for this email!';
      case `Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).`:
        return 'There is no such user!';
      case `A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred. (auth/network-request-failed).`:
        return 'A network error';
      case `Firebase: An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address. (auth/account-exists-with-different-credential).`:
        return 'An account already exists with the same email address but different sign-in credentials';
      default:
        return 'An unknown error occurred';
    }
  }

}
