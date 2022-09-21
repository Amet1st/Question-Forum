import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {

  public categories: Array<string> = ['Frontend', 'Java', '.NET', 'Android'];
  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      title: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],

      text: ['', [
        Validators.required,
        Validators.maxLength(200)
      ]],
      
      tags: this.formBuilder.group({})
    })
  }

  onChecked(event: Event) {
    const checkbox = this.getHTMLElement(event);

    if (checkbox.checked) {
      (<FormGroup>this.form.controls['tags']).addControl(`${checkbox.id}`, new FormControl(true));
    } else {
      (<FormGroup>this.form.controls['tags']).removeControl(`${checkbox.id}`);
    }
  }

  public addPost() {
    
  }

  private getHTMLElement(event: Event): HTMLInputElement {
    return event.target as HTMLInputElement;
  }

  /*public showForm() {
    console.log(this.form.value);
  }*/

}
