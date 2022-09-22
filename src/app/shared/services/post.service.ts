import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
  
export class PostService {

  public apiURL: string = 'https://question-forum-ee329-default-rtdb.europe-west1.firebasedatabase.app/questions.json';

  constructor(
    private http: HttpClient
  ) {}

  public postData(url:string, data: string): Observable<Object> {
    return this.http.post(url, data);
  }

  public getData(url:string): Observable<Object> {
    return this.http.get(url);
  }
}
