import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Route, Routes, Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
  
export class SignInComponent implements OnInit {
  public isSubmitted = false;
  public errorMessage: string;
  public  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public afAuth: AngularFireAuth,
    public router: Router
  ) { }

  ngOnInit(): void {
      this.initForm();
  }

  private initForm() {
      this.registrationForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
        
      password: ['', [
        Validators.required,
      ]]
    })
  }

  onSubmit() {
    const controls = this.registrationForm.controls;

    if (this.registrationForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAllAsTouched());
    }

    this.authService.signIn(controls['email'].value, controls['password'].value)
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

    this.registrationForm.reset();
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.registrationForm.controls[controlName];
    
    return control.invalid && control.touched;
  }

}
