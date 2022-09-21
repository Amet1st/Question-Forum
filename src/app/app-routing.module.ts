import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { HomeGuard } from './shared/guard/home.guard';
import { AddQuestionComponent } from './pages/add-question/add-question.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent, canActivate: [AuthGuard]},
  { path: 'sign-up', component: SignUpComponent, canActivate: [AuthGuard]},
  { path: 'home', component: HomeComponent, canActivate: [HomeGuard] },
  { path: 'add-question', component: AddQuestionComponent, canActivate: [HomeGuard] },
  { path: '**', component: HomeComponent, canActivate: [HomeGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
  
export class AppRoutingModule { }
