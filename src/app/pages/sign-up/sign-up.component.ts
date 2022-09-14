import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Routes, Route, Router } from '@angular/router';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
  
export class SignUpComponent implements OnInit {

  public isSubmitted = false;
  public isLoggedIn = false;
  public errorMessage: string | null = null;
  public registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    public appModule: AppModule
  ) { }


  ngOnInit(): void {
      this.initForm();
  }

  public onSubmit() {
    const controls = this.registrationForm.controls;
    this.errorMessage = null;

    if (this.registrationForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAllAsTouched());
    }
    
    this.authService.signUp(controls['email'].value, controls['password'].value)
      .then((result: Promise<any>) => {
        this.registrationForm.reset();
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
            this.errorMessage = 'Error';
            break;
        }
      })
  }

  private initForm() {
      this.registrationForm = this.fb.group({
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

  isControlInvalid(controlName: string): boolean {
    const control = this.registrationForm.controls[controlName];
    
    return control.invalid && control.touched;

  }

}
