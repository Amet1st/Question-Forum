import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "../../shared/services/auth.service";
import { Observable } from 'rxjs';
import { AppComponent } from 'src/app/app.component';

@Injectable({
  providedIn: 'root'
})
  
export class AuthGuard implements CanActivate {  
  constructor(
    public authService: AuthService,
    public router: Router,
    public appComponent: AppComponent
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(!this.appComponent.isLoggedIn) {
      this.router.navigate(['sign-in']);
    } else {
      this.router.navigate(['home']);
    }
    return true;
  }
}