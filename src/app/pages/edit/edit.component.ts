import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Question } from 'src/app/models/interfaces/question';
import { TAGS } from 'src/app/models/tags.const';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PostService } from 'src/app/shared/services/post.service';



@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  public categories = TAGS;
  public form: FormGroup;
  private destroy = new Subject<boolean>();
  public isTagChecked = false;
  private author: string;
  public post: Question;
  private postId: string;
  

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.postId = this.activatedRoute.snapshot.url[1].path;

    this.initForm();
    this.isTagChecked = Boolean((Object.keys(this.form.get('tags').value)).length);

    this.postService.getPost(this.postId)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        post => {
          this.author = post.author;
          this.post = post;
          this.form.patchValue({
            title: post.title,
            text: post.text,
            tags: post.tags
          })
        }
      );
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
      
      tags: this.formBuilder.group({
        frontend: true
      })
    })
  }

  public onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const formData = { ...this.form.value }
    formData.tags = Object.keys(formData.tags);

    const body = {
      author: this.author, 
      date: new Date(),
      ...formData
    }

    this.postService.updatePost(this.postId, body)
      .pipe(takeUntil(this.destroy))
      .subscribe((response) => {
        console.log(response);
        this.form.reset();
        this.router.navigate(['/home']);
      });

  }

  onChecked(event: Event) {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      (<FormGroup>this.form.controls['tags']).addControl(`${checkbox.id}`, new FormControl(true));
    } else {
      (<FormGroup>this.form.controls['tags']).removeControl(`${checkbox.id}`);
    }

    this.isTagChecked = Boolean((Object.keys(this.form.get('tags').value)).length);
  }

  public isChecked(tag: string): boolean {
    return Object.keys(this.form.get('tags').value).includes(tag);
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

}
