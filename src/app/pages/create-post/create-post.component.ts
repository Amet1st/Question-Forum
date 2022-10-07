import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PostService } from 'src/app/shared/services/post.service';
import { TAGS } from 'src/app/models/tags.const';
import { AuthService } from 'src/app/shared/services/auth.service';
import {Post} from "../../models/interfaces/post.interface";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit, OnDestroy {

  public categories = TAGS;
  public form: FormGroup;
  private destroy = new Subject<boolean>();
  public isTagChecked = false;
  private author: string;

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.authService.getAuthState()
      .pipe(takeUntil(this.destroy))
      .subscribe(user => {
        this.author = user.email;
      });
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
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      (<FormGroup>this.form.controls['tags']).addControl(`${checkbox.id}`, new FormControl(true));
    } else {
      (<FormGroup>this.form.controls['tags']).removeControl(`${checkbox.id}`);
    }

    this.isTagChecked = Boolean((Object.keys(this.form.get('tags').value)).length);
  }

  public onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const formData = { ...this.form.value };
    formData.tags = Object.keys(formData.tags);

    const body: Post = {
      ...formData,
      author: this.author,
      date: new Date(),
      isApproved: false,
      isSolved: false
    }

    this.postService.createPost(body)
      .pipe(takeUntil(this.destroy))
      .subscribe((response) => {
        const id = Object.values(response)[0];
        this.form.reset();
        this.router.navigate(['/posts/', id]);
      });

  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
