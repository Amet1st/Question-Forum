import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {Post} from 'src/app/models/interfaces/post.interface';
import {Comment} from 'src/app/models/interfaces/comment.inteface';
import {AuthService} from 'src/app/shared/services/auth.service';
import {PostService} from 'src/app/shared/services/post.service';
import {UsersService} from 'src/app/shared/services/users.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppearanceAnimation} from "../../models/animations/appearence.animation";
import {SettingsService} from "../../shared/services/settings.service";

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss'],
  animations: [AppearanceAnimation]
})
export class PostViewComponent implements OnInit, OnDestroy {

  public post: Post;
  public comments: Comment[];
  public postMeta = {
    postId: '',
    authorId: '',
    userEmail: '',
    isAuthor: false,
    isPostSolved: false,
  }
  public theme = 'Light'
  public form: FormGroup;
  public isAdmin = false;
  private destroy = new Subject<boolean>();

  constructor(
    private postService: PostService,
    private usersService: UsersService,
    private authService: AuthService,
    private settingsService: SettingsService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.postMeta.postId = this.activatedRoute.snapshot.params.id;
    this.theme = this.settingsService.theme;

    this.initForm();
    this.getPost();
  }

  public initForm(): void {
    this.form = this.formBuilder.group({
      text: ['', [
        Validators.maxLength(500)
        ]]
    });
  }

  public onSubmit(): void {

    if(this.form.invalid || !this.form.get('text').value.toString().trim()) {
      this.form.reset();
      return;
    }

    const commentBody = {
        author: this.postMeta.userEmail,
        text: this.form.get('text').value,
        date: new Date(),
        isSolution: false
    }

    this.postService.createComment(this.postMeta.postId, commentBody)
      .pipe(takeUntil(this.destroy))
      .subscribe((id) => {
        const comment = commentBody as Comment;
        comment.id = Object.values(id)[0];
        this.comments.push(comment);
        this.form.reset();
      });
  }

  public markAsSolution(id: string): void {

    this.postService.markPostAsSolved(this.postMeta.postId)
      .pipe(takeUntil(this.destroy))
      .subscribe();

    this.postService.markCommentAsSolution(this.postMeta.postId, id)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        const comment = this.comments.find(item => item.id === id);
        comment.isSolution = true;
        this.postMeta.isPostSolved = true;
      })
  }

  public approvePost(id: string): void {
    this.postService.approvePost(id)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.router.navigate(['/home']);
      })
  }

  public deletePost(id: string): void {
    this.postService.deletePost(id)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.router.navigate(['/home']);
      })
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }

  private getPost(): void {
    this.postService.getPost(this.postMeta.postId)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        post => {
          this.post = post;
          this.comments = post.comments;
          this.postMeta.isPostSolved = !this.comments.every(item => !item.isSolution);
          this.checkRole(post.author);
        }
      );
  }

  private checkRole(author: string): void {
    this.postMeta.userEmail = this.authService.currentUser.email;
    this.postMeta.isAuthor = this.authService.currentUser.email === author;
    this.usersService.getUserByEmail(this.authService.currentUser.email)
      .pipe(takeUntil(this.destroy))
      .subscribe(user => {
        this.isAdmin = user.isAdmin;
      });
  }

}
