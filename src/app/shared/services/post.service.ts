import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
  
export class PostService {

  constructor(
    private dataBase: AngularFireDatabase,
    private http: HttpClient
  ) {}

  public postData(url:string, data: string): Observable<Object> {
    return this.http.post(url, data);
  }

}
