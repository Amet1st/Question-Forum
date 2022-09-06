import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

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

    console.log(this.registrationForm.value);
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
