import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Question } from 'src/app/models/interfaces/question';
import { PostService } from 'src/app/shared/services/post.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
  
export class HomeComponent implements OnInit, OnDestroy {

  public posts: Array<Question> = [];
  private destroy$: Subject<boolean> = new Subject<boolean>();
  @Output() public getQuestion = new EventEmitter<Question>();

  constructor(
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.postService
      .getData(this.postService.API_QESTION_URL)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: Object) => {
          if (response) {
            const questions: Array<string> = Object.keys(response);
            questions.forEach((item) => {
              let question = this.convertToQuestion(response[item as keyof typeof response]);
              if (question.tags) {
                question.tags = Object.keys(question.tags);
              }
              this.posts.push(question);
            })
          }
        }),
        (error: Error) => console.log(error.message);
  }

  private convertToQuestion(obj: Object) {
    return obj as Question;
  }

  private getHTMLElement(event: Event): HTMLElement {
    return event.srcElement as HTMLElement;
  }

  public goToQuestion(event: Event) {
    const questionId = Number(this.getHTMLElement(event).closest('article').id);
    this.getQuestion.emit(this.posts[questionId]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe
  }
}
