import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil} from 'rxjs';
import { Post } from 'src/app/models/interfaces/post.interface';
import { PostService } from 'src/app/shared/services/post.service';
import { AuthService } from "../../shared/services/auth.service";
import {UsersService} from "../../shared/services/users.service";
import {TAGS} from "../../models/tags.const";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

  public posts: Post[];
  public allPosts: Post[];
  public categories = TAGS;
  public timeFilters = ['Time period', 'Last day', 'Last week', 'Last month', 'All time'];
  public userEmail: string;
  public isAdmin = false;
  public options = {
    selectedByAnswer: 'By answer',
    selectedByCategory: 'By category',
    selectedByTime: 'Time period',
    selectedPostDisplay: 'Posts display',
    selectedTheme: 'Theme'
  };
  public toggledMenuId: number;
  public isDisplayInline = false;
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
        this.allPosts = this.posts;
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

  toggleMenu(id: number): void {
    this.toggledMenuId = this.toggledMenuId === id ? null : id;
  }

  clickedOutside(): void {
    this.toggledMenuId = null;
  }

  onChange(option: string) {
    this.toggledMenuId = null;

    if (this.categories.includes(option)) {
      this.filterByTag(option);
      return;
    }

    if (this.timeFilters.includes(option)) {
      this.filterByTime(option);
      return;
    }

    switch (option) {
      case 'Solved':
        this.posts = this.allPosts.filter(post => post.isSolved);
        break;
      case 'Not solved':
        this.posts = this.allPosts.filter(post => !post.isSolved);
        break;
      case 'Inline':
        this.isDisplayInline = true;
        break;
      case 'Tiled':
        this.isDisplayInline = false;
        break;
    }
  }

  public filterByTag(option: string) {
    this.posts = this.allPosts.filter(post => post.tags.includes(option.toLowerCase()));
  }

  private filterByTime(option: string) {

    switch (option) {
      case 'Last day':
        this.posts = this.allPosts.filter(post => {
          const timeDifference = new Date().getTime() - new Date(post.date).getTime();
          return timeDifference <= 8.64e+7;
        })
        break;
      case 'Last week':
        this.posts = this.allPosts.filter(post => {
          const timeDifference = new Date().getTime() - new Date(post.date).getTime();
          return timeDifference <= 6.048e+8;
        })
        break;
      case 'Last month':
        this.posts = this.allPosts.filter(post => {
          const timeDifference = new Date().getTime() - new Date(post.date).getTime();
          return timeDifference <= 2.628e+9;
        })
        break;
      case 'All time':
        this.posts = this.allPosts;
        break;
    }
  }

  public sortPosts(event: Event) {
    this.toggledMenuId = null;

    const target = event.target as HTMLElement;
    const value = target.innerText;

    switch (value) {
      case 'New':
        this.posts = this.allPosts.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        break;
      case 'Old':
        this.posts = this.allPosts.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }

}
