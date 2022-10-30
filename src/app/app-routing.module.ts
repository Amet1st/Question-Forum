import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignInComponent} from './pages/sign-in/sign-in.component';
import {SignUpComponent} from './pages/sign-up/sign-up.component';
import {HomeComponent} from './pages/home/home.component';
import {AuthGuard} from './shared/guard/auth.guard';
import {HomeGuard} from './shared/guard/home.guard';
import {CreatePostComponent} from './pages/create-post/create-post.component';
import {PostViewComponent} from './pages/post-view/post-view.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {EditPostComponent} from './pages/edit-post/edit-post.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'sign-in', component: SignInComponent, canActivate: [AuthGuard]},
  {path: 'sign-up', component: SignUpComponent, canActivate: [AuthGuard]},
  {path: 'home', component: HomeComponent, canActivate: [HomeGuard]},
  {path: 'create-post', component: CreatePostComponent, canActivate: [HomeGuard]},
  {path: 'posts/:id', component: PostViewComponent, canActivate: [HomeGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [HomeGuard]},
  {path: 'edit-post/:id', component: EditPostComponent, canActivate: [HomeGuard]},
  {path: '**', component: HomeComponent, canActivate: [HomeGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
