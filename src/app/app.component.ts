import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private fb: FormBuilder) {

  }

  userprofileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: [''],

    adress: this.fb.group({
      adress1: [''],
      adress2: [''],
      state: [''],
      zip: ['']
    })
  });

  onSubmit() {
    let firstName = this.userprofileForm.controls['firstName'].value;
    let lastName = this.userprofileForm.get('lastName')?.value;
  }
}
