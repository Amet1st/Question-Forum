import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "../../shared/services/auth.service";
import { filter, map, Observable, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
  
export class AuthGuard implements CanActivate {  
  constructor(
    public authService: AuthService,
    public router: Router
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    
    return this.authService.authStream$.pipe(
      map(user => {
        if (user) {
          return true;
        }

        this.router.navigate(['/sign-in']);
        return false;
      })
    );
  }
}