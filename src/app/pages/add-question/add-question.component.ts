import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Question } from 'src/app/models/interfaces/question';
import { PostService } from 'src/app/shared/services/post.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {

  public categories: Array<string> = ['Frontend', 'Java', '.NET', 'Android'];
  public form: FormGroup;
  private apiURL: string = 'https://question-forum-ee329-default-rtdb.europe-west1.firebasedatabase.app/questions.json';

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
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

  private getHTMLElement(event: Event): HTMLInputElement {
    return event.target as HTMLInputElement;
  }

  onSubmit() {
    this.postService.postData(this.apiURL, JSON.stringify(this.form.value)).subscribe(respone => console.log(respone));
  }

}
