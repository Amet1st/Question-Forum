import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {environment} from '../environments/environment';

import {AppComponent} from './app.component';
import {HeaderComponent} from './shared/components/header/header.component';
import {SignUpComponent} from './pages/sign-up/sign-up.component';
import {SignInComponent} from './pages/sign-in/sign-in.component';
import {AuthService} from './shared/services/auth.service';
import {HomeComponent} from './pages/home/home.component';
import {AuthGuard} from './shared/guard/auth.guard';
import {CreatePostComponent} from './pages/create-post/create-post.component';
import {HttpClientModule} from '@angular/common/http';
import {PostViewComponent} from './pages/post-view/post-view.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {EditPostComponent} from './pages/edit-post/edit-post.component';
import {ClickOutsideDirective} from './shared/directives/click-outside.directive';
import {FilterByTagPipe} from './shared/pipes/filter-by-tag.pipe';
import {FilterByTimePipe} from './shared/pipes/filter-by-time.pipe';
import {FilterBySolutionPipe} from './shared/pipes/filter-by-solution.pipe';
import {FilterByOtherPipe} from './shared/pipes/filter-by-other.pipe';
import {SortPostsPipe} from './shared/pipes/sort-posts.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignUpComponent,
    SignInComponent,
    HomeComponent,
    CreatePostComponent,
    PostViewComponent,
    ProfileComponent,
    EditPostComponent,
    ClickOutsideDirective,
    FilterByTagPipe,
    FilterByTimePipe,
    FilterBySolutionPipe,
    FilterByOtherPipe,
    SortPostsPipe,
  ],
  imports: [
      BrowserModule,
      AppRoutingModule,
      ReactiveFormsModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireAuthModule,
      HttpClientModule,
      FormsModule,
      BrowserAnimationsModule
  ],
  providers: [
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
