import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Routes, Route, Router } from '@angular/router';

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
    private formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router,
  ) { }


  ngOnInit(): void {
      this.initForm();
  }

  public onSubmit() {
    const controls = this.registrationForm.controls;
    this.isSubmitted = true;

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
      this.registrationForm = this.formBuilder.group({
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

  onFocus() {
    this.errorMessage = null;
    this.isSubmitted = false;
  }

}
