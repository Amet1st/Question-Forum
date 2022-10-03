import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Post } from 'src/app/models/interfaces/post.interface';
import { PostService } from 'src/app/shared/services/post.service';
import {AuthService} from "../../shared/services/auth.service";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

  public posts: Post[];
  private destroy = new Subject<boolean>();

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.postService.getAllPosts()
      .pipe(takeUntil(this.destroy))
      .subscribe(posts => {
        this.posts = posts;
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
