import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subject, take, takeUntil} from 'rxjs';
import { Post } from 'src/app/models/interfaces/post.interface';
import { PostService } from 'src/app/shared/services/post.service';
import { AuthService } from "../../shared/services/auth.service";
import {UsersService} from "../../shared/services/users.service";
import {getAll} from "@angular/fire/remote-config";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

  public posts: Post[];
  public isAdmin = false;
  private destroy = new Subject<boolean>();

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private userService: UsersService
  ) { }

  ngOnInit(): void {

    this.authService.getAuthState()
      .pipe(takeUntil(this.destroy))
      .subscribe(user => {
        this.initializeHomePage(user.email);
      })

  }

  initializeHomePage(email: string): void {
    this.userService.getUserByEmail(email)
      .pipe(takeUntil(this.destroy))
      .subscribe(user => {
        this.isAdmin = user.isAdmin;
        this.getAllPosts();
      });
  }

  private getAllPosts(): void {
    this.postService.getAllPosts()
      .pipe(takeUntil(this.destroy))
      .subscribe(posts => {
        this.posts = this.isAdmin ? posts : posts.filter(post => post.isApproved);
      });
  }

  approvePost(id: string) {
    const post = this.posts.find(post => post.id);
    post.isApproved = true;
    this.postService.approvePost(id)
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
