import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
  
export class SignInComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    public authService: AuthService
  ) { }

  registrationForm: FormGroup;

  ngOnInit(): void {
      this.initForm();
  }

  onSubmit() {
    const controls = this.registrationForm.controls;

    if (this.registrationForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAllAsTouched());
      
      return;
    }

    this.authService.SignIn(controls['email'].value, controls['password'].value);

    this.registrationForm.reset();
  }

  private initForm() {
      this.registrationForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
        
      password: ['', [
        Validators.required,
        Validators.minLength(10)
      ]]
    })
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.registrationForm.controls[controlName];
    
    let result = control.invalid && control.touched;

    return result;
  }

}
