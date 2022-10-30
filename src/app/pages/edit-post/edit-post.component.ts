import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {Post} from 'src/app/models/interfaces/post.interface';
import {TAGS} from 'src/app/models/tags.const';
import {PostService} from 'src/app/shared/services/post.service';
import {AuthService} from "../../shared/services/auth.service";
import {AppearanceAnimation} from "../../models/animations/appearence.animation";

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
  animations: [AppearanceAnimation]
})
export class EditPostComponent implements OnInit, OnDestroy {

  public post: Post;
  public categories = TAGS;
  public form: FormGroup;
  public isTagChecked = true;
  private tags: string[];
  private author: string;
  private postId: string;
  private destroy = new Subject<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.postId = this.activatedRoute.snapshot.params.id;

    this.initForm();

    this.postService.getPost(this.postId)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        post => {
          this.author = post.author;
          this.post = post;
          this.tags = post.tags;
          this.form.patchValue({
            title: post.title,
            text: post.text,
          });
          this.tags.forEach(tag => {
            (<FormGroup>this.form.get('tags')).addControl(tag, new FormControl(true))
          })
        }
      );
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const formData = { ...this.form.value }
    formData.tags = Object.keys(formData.tags);

    const body = {
      author: this.authService.currentUser.email,
      date: new Date(),
      ...formData
    }

    this.postService.updatePost(this.postId, body)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.form.reset();
        this.router.navigate(['/posts/', this.postId]);
      });

  }

  public onChecked(event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      (<FormGroup>this.form.controls['tags']).addControl(`${checkbox.id}`, new FormControl(true));
    } else {
      (<FormGroup>this.form.controls['tags']).removeControl(`${checkbox.id}`);
    }

    this.isTagChecked = Boolean((Object.keys(this.form.get('tags').value)).length);

  }

  public isChecked(tag: string): boolean {
    if (this.tags) {
      return this.tags.includes(tag);
    }

    return false;
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
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
        Validators.maxLength(500)
      ]],

      tags: this.formBuilder.group({})
    })
  }

}
