import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import { Post } from 'src/app/models/interfaces/post.interface';
import { PostService } from 'src/app/shared/services/post.service';
import { AuthService } from "../../shared/services/auth.service";
import {UsersService} from "../../shared/services/users.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

  public posts: Post[];
  public userEmail: string;
  public isAdmin = false;
  public toggledMenuId: number;
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
        if (user) {
          this.userEmail = user.email;
          this.initializeHomePage(user.email);
        }
      })

  }

  initializeHomePage(email: string): void {
    this.userService.getUserByEmail(email)
      .pipe(takeUntil(this.destroy))
      .subscribe(user => {
        if (user) {
          this.isAdmin = user.isAdmin;
          this.getAllPosts(email);
        }
      });
  }

  private getAllPosts(email: string): void {
    this.postService.getAllPosts()
      .pipe(takeUntil(this.destroy))
      .subscribe(posts => {
        this.posts = this.isAdmin ? posts : posts.filter(post => (post.isApproved || post.author === email));
      });
  }

  approvePost(id: string) {
    const post = this.posts.find(post => post.id);
    post.isApproved = true;
    this.postService.approvePost(id).subscribe();
  }

  deletePost(id: string) {
    this.postService.deletePost(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
    });
  }

  toggleMenu(id: number) {
    this.toggledMenuId = id;
  }

  clickedOutside() {
    this.toggledMenuId = null;
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
