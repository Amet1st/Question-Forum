import {Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
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

export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('plus') plus: ElementRef;
  public posts: Post[];
  public categories = TAGS;
  public userEmail: string;
  public isAdmin = false;
  public filters = {
    filterByAnswer: 'By answer',
    filterByCategory: 'By category',
    filterByTime: 'Time period',
    filterOther: 'Other',
    selectedPostDisplay: 'Posts display'
  };
  public options = {
    selectedTheme: 'Light',
    toggledMenuId: 0,
    isDisplayInline: false
  };
  public themeStream = new Subject<string>();
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

    if (localStorage.getItem('theme')) {
      this.options.selectedTheme = localStorage.getItem('theme');
    }

    const display = localStorage.getItem('display');
    this.options.isDisplayInline = display === 'Inline';
  }

  ngAfterViewInit(): void {

    if (this.options.selectedTheme === 'Dark') {
      this.plus.nativeElement.src = '../../../assets/png/plusWhite.png';
    }

    this.themeStream
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        if (this.options.selectedTheme === 'Dark') {
          this.plus.nativeElement.src = '../../../assets/png/plusWhite.png';
        } else {
          this.plus.nativeElement.src = '../../../assets/png/plus.png';
        }
      })
  }

  private initializeHomePage(email: string): void {
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
        this.posts.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      });
  }

  public approvePost(id: string): void {
    this.postService.approvePost(id)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        const post = this.posts.find(post => post.id);
        post.isApproved = true;
      });
  }

  public deletePost(id: string): void {
    this.postService.deletePost(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
    });
  }

  public toggleMenu(id: number): void {
    this.options.toggledMenuId = this.options.toggledMenuId === id ? null : id;
  }

  public clickedOutside(): void {
    this.options.toggledMenuId = null;
  }

  public sortPosts(event: Event): void {
    this.options.toggledMenuId = null;

    const target = event.target as HTMLElement;
    const value = target.innerText;

    switch (value) {
      case 'New first':
        this.posts.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        break;
      case 'Old first':
        this.posts.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        break;
    }
  }

  public postDisplayChange(): void {
    this.options.toggledMenuId = null;
    localStorage.setItem('display', this.filters.selectedPostDisplay);
    this.options.isDisplayInline = this.filters.selectedPostDisplay === 'Inline';
  }

  public toggleTagFilter(tag: string): void {
    this.filters.filterByCategory = this.categories.find(item => item.toLowerCase() === tag);
  }

  public changeTheme(): void {
    this.themeStream.next(this.options.selectedTheme);
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
