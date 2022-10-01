import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Question } from 'src/app/models/interfaces/question';
import { Comment } from 'src/app/models/interfaces/comment';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PostService } from 'src/app/shared/services/post.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-question-view',
  templateUrl: './question-view.component.html',
  styleUrls: ['./question-view.component.scss']
})
export class QuestionViewComponent implements OnInit, OnDestroy {

  public post: Question;
  public comments: Comment[];
  public postId: string;
  public authorId: string;
  public userEmail: string;
  public isAuthor = false;
  public isPostSolved = false;
  public form: FormGroup;
  private destroy = new Subject<boolean>();


  constructor(
    private postService: PostService,
    private usersService: UsersService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.postId = this.activatedRoute.snapshot.url[1].path;

    this.initForm();

    this.postService.getPost(this.postId)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        post => {
          this.post = post;
          this.getUser(post.author);
          this.checkAuthor(post.author);
        }
      );

    this.postService.getAllComments(this.postId)
      .pipe(takeUntil(this.destroy))
      .subscribe(comments => {
        this.comments = comments;
        this.isPostSolved = comments.some(comment => comment.isSolution);
      });
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

    const body = {
        author: this.userEmail,
        text: this.form.get('text').value,
        date: new Date(),
        isSolution: false
    }

    this.postService.createComment(this.postId, body)
      .pipe(takeUntil(this.destroy))
      .subscribe(response => {
        const id =  Object.values(response)[0];
        const comment = body as Comment;
        comment.id = id;
        this.comments.push(comment);
      });

    this.form.reset();
  }

  private checkAuthor(author: string) {
    this.authService.getAuthState()
      .pipe(takeUntil(this.destroy))
      .subscribe(user => {
        this.userEmail = user?.email;
        this.isAuthor = user?.email === author;
      })
  }

  private getUser(email: string) {
    this.usersService.getUserByEmail(email)
      .pipe(takeUntil(this.destroy))
      .subscribe(user => {
        this.authorId = user?.id;
      })
  }

  markAsSolution(id: string) {
    const comment = this.comments.find(item => item.id === id);
    comment.isSolution = true;

    this.postService.markCommentAsSolution(this.postId, id, comment)
      .pipe(takeUntil(this.destroy))
      .subscribe(result => {
        this.isPostSolved = true;
        console.log(result);
      })
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
