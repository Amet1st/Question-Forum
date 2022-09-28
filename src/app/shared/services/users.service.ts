import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { User } from 'src/app/models/interfaces/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient
  ) { }

  public createUser(user: User) {
    return this.http.post((environment.apiUrl + '/users.json'), user);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get((environment.apiUrl + '/users.json'))
      .pipe(
        map(data => {
          const res = data as { [key: string]: object };
          return Object.keys(data)
            .map(id => {
              return {
                id,
                ...res[id]
              } as User
            })
            .find(item => item.email === email)
        })
      );
  }

  public getUserById(id: string): Observable<User> {
    return this.http.get((environment.apiUrl) + '/users/' + id + '.json') as Observable<User>;
  } 

  public editUser() {

  }
}
