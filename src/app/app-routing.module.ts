import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { SignInGuard } from './shared/guard/sign-in.guard';
import { AlreadyInComponent } from './pages/already-in/already-in.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent, canActivate: [SignInGuard]},
  { path: 'sign-up', component: SignUpComponent, canActivate: [SignInGuard]},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'already-in', component: AlreadyInComponent, canActivate: [AuthGuard]},
  { path: '**', component: HomeComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
  
export class AppRoutingModule { }
