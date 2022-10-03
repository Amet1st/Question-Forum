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
  public isAdmin = true;
  private destroy = new Subject<boolean>();

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.postService.getAllPosts()
      .pipe(takeUntil(this.destroy))
      .subscribe(posts => {
        this.posts = this.isAdmin ? posts : posts.filter(post => post.isApproved);
      });
  }

  approvePost(id: string) {
    const post = this.posts.find(post => post.id);
    this.postService.approvePost(id, post)
      .subscribe(value => {
        console.log(value);
      })
  }

  deletePost(id: string) {
    this.postService.deletePost(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
    });
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
