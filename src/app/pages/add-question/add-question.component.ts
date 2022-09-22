import { Component, OnInit, OnDestroy, InjectionToken } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PostService } from 'src/app/shared/services/post.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit, OnDestroy {

  public categories: Array<string> = ['Frontend', 'Java', 'NET', 'Android'];
  public form: FormGroup;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50)
      ]],

      text: ['', [
        Validators.required,
        Validators.minLength(10),
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

  public onSubmit() {
    this.form.addControl('date', new FormControl(new Date()));
    this.postService
      .postData(this.postService.API_QESTION_URL, JSON.stringify(this.form.value))
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: Object) => { 
          this.router.navigate(['/home']);
        },
        (error: Error) => console.log(error.message)
      )
  }
 
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
