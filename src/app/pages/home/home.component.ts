import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import { Post } from 'src/app/models/interfaces/post.interface';
import { PostService } from 'src/app/shared/services/post.service';
import { AuthService } from "../../shared/services/auth.service";
import {UsersService} from "../../shared/services/users.service";
import {TAGS} from "../../models/tags.const";
import {AppearanceAnimation} from "../../models/animations/appearence.animation";
import {SettingsService} from "../../shared/services/settings.service";
import {WidthAnimation} from "../../models/animations/width.animation";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    AppearanceAnimation,
    WidthAnimation
  ]
})

export class HomeComponent implements OnInit, OnDestroy {

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
    selectedSort: 'New first',
    selectedTheme: 'Light',
    selectedDisplay: 'Tiled',
    toggledMenuId: 0,
    isDisplayInline: false
  };
  private destroy = new Subject<boolean>();

  constructor(
    private postService: PostService,
    public authService: AuthService,
    private userService: UsersService,
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    this.userEmail = this.authService.currentUser.email;
    this.initializeHomePage(this.authService.currentUser.email);
    this.initSettings();
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

  private initSettings(): void {
    this.options.selectedTheme = this.settingsService.theme;
    const display = this.settingsService.display;
    this.options.selectedDisplay = display;
    this.options.isDisplayInline = display === 'Inline';
  }

  private getAllPosts(email: string): void {
    this.postService.getAllPosts()
      .pipe(takeUntil(this.destroy))
      .subscribe(posts => {
        posts.forEach(post => console.log(post.author));
        this.posts = this.isAdmin ? posts : posts.filter(post => (post.isApproved || post.author === email));
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
    this.postService.deletePost(id)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
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
    this.options.selectedSort = target.innerText;
  }

  public postDisplayChange(): void {
    this.options.toggledMenuId = null;
    this.settingsService.display = this.filters.selectedPostDisplay;
    this.options.selectedDisplay = this.settingsService.display;
    this.options.isDisplayInline = this.filters.selectedPostDisplay === 'Inline';
  }

  public toggleTagFilter(tag: string): void {
    this.filters.filterByCategory = this.categories.find(item => item.toLowerCase() === tag);
  }

  public changeTheme(): void {
    this.settingsService.themeStream.next(this.options.selectedTheme);
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
