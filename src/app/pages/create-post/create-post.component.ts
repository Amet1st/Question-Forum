import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {PostService} from 'src/app/shared/services/post.service';
import {TAGS} from 'src/app/models/tags.const';
import {AuthService} from 'src/app/shared/services/auth.service';
import {Post} from '../../models/interfaces/post.interface';
import {AppearanceAnimation} from '../../models/animations/appearence.animation';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
  animations: [AppearanceAnimation]
})
export class CreatePostComponent implements OnInit, OnDestroy {

  public categories = TAGS;
  public form: FormGroup;
  public isTagChecked = false;
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
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

  public onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const formData = { ...this.form.value };
    formData.tags = Object.keys(formData.tags);

    const body: Post = {
      ...formData,
      author: this.authService.currentUser.email,
      date: new Date(),
      isApproved: false,
      isSolved: false
    }

    this.postService.createPost(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        const id = Object.values(response)[0];
        this.router.navigate(['/posts/', id]);
        this.form.reset();
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
        Validators.maxLength(500)
      ]],

      tags: this.formBuilder.group({})
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
