import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
  
export class SignUpComponent implements OnInit {

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

    this.authService.SignUp(controls['email'].value, controls['password'].value);

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
        Validators.minLength(10),
        Validators.maxLength(20)
      ]]
    })
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.registrationForm.controls[controlName];
    
    let result = control.invalid && control.touched;

    return result;
  }

}
