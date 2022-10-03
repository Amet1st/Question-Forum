import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Post } from 'src/app/models/interfaces/post.interface';
import { Comment } from 'src/app/models/interfaces/comment.inteface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PostService } from 'src/app/shared/services/post.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss']
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
  public form: FormGroup;
  private destroy = new Subject<boolean>();
  public isAdmin = true;


  constructor(
    private postService: PostService,
    private usersService: UsersService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.postMeta.postId = this.activatedRoute.snapshot.url[1].path;

    this.initForm();

    this.postService.getPost(this.postMeta.postId)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        post => {
          this.post = post;
          this.comments = post.comments;
          this.postMeta.isPostSolved = !this.comments.every(item => !item.isSolution);
          this.getUser(post.author);
          this.checkAuthor(post.author);
        }
      );
  }

  private initForm() {
    this.form = this.formBuilder.group({
      text: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
        ]]
    });
  }

  public onSubmit() {

    if(this.form.invalid) {
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
      .subscribe(() => {
        const comment = commentBody as Comment;
        this.comments.push(comment);
      });

    this.form.reset();
  }

  private checkAuthor(author: string) {
    this.authService.getAuthState()
      .pipe(takeUntil(this.destroy))
      .subscribe(user => {
        if(user) {
          this.postMeta.userEmail = user.email;
          this.postMeta.isAuthor = user.email === author;
        }
      })
  }

  private getUser(email: string) {
    this.usersService.getUserByEmail(email)
      .pipe(takeUntil(this.destroy))
      .subscribe(user => {
        this.postMeta.authorId = user?.id;
      })
  }

  markAsSolution(id: string) {
    const comment = this.comments.find(item => item.id === id);
    comment.isSolution = true;

    this.postService.markCommentAsSolution(this.postMeta.postId, id)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.postMeta.isPostSolved = true;
      })
  }

  approvePost(id: string) {
    this.postService.approvePost(id).subscribe(() => {
      this.router.navigate(['/home']);
    })
  }


  deletePost(id: string) {
    console.log(this.post);
    this.postService.deletePost(id).subscribe(() => {
      this.router.navigate(['/home']);
    })
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }

}
