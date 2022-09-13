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
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    public appModule: AppModule
  ) { }


  ngOnInit(): void {
      this.initForm();
  }

  onSubmit() {
    const controls = this.registrationForm.controls;
    this.errorMessage = null;

    if (this.registrationForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAllAsTouched());
    }
    
    this.authService.signUp(controls['email'].value, controls['password'].value)
      .then((result: any) => {
        alert('Successful registration!')
        this.registrationForm.reset();
        this.router.navigate(['home']);
      })
      .catch((error: any) => {
         
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
