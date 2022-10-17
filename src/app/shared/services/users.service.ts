import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { map } from 'rxjs';
import { User } from 'src/app/models/interfaces/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient
  ) { }

  public createUserWithEmail(email: string): void {
    this.getUserByEmail(email)
      .subscribe(result => {
        if (!result) {
          this.createUser(email).subscribe();
        }
      });
  }

  public createUser(email: string): Observable<object> {
    return this.http.post((environment.apiUrl + '/users.json'), {
      email,
      dateOfSignUp: new Date(),
      isAdmin: false,
    });
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get((environment.apiUrl + '/users.json'))
      .pipe(
        map(data => {
          if (data) {
            const res = data as { [key: string]: object };
            return Object.keys(data)
              .map(id => {
                return {
                  id,
                  ...res[id]
                } as User;
              })
              .find(item => item.email === email)
          } else return null;
        })
      );
  }
}
