import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Question } from 'src/app/models/interfaces/question';
import { Comment } from 'src/app/models/interfaces/comment';

@Injectable({
  providedIn: 'root'
})

export class PostService {

  constructor(
    private http: HttpClient
  ) { }

  public createPost(data: Question): Observable<Object> {
    return this.http.post((environment.apiUrl + '/questions.json'), data);
  }

  public getPost(id: string) {
    return this.http.get((environment.apiUrl + '/questions/' + id + '.json'))
      .pipe(
        map(item => {return item as Question})
      );
  }

  public getAllPosts(): Observable<Question[]> {
    return this.http.get((environment.apiUrl + '/questions.json'))
      .pipe(
        map(data => {
          if (data) {
            const res = data as { [key: string]: object };
            return Object.keys(res).map(id => {
              return {
                id,
                ...res[id]
              } as Question
            })
          }

          return [];
        })
    )
  }

  public updatePost(id: string, post: Question): Observable<Object> {
    return this.http.put((environment.apiUrl + '/questions/' + id + '.json'), post);
  }

  getAllComments(id: string): Observable<Comment[]> {
    return this.http.get((environment.apiUrl + '/questions/' + id + '/comments.json'))
      .pipe(
        map(data => {
          if (data) {
            const res = data as { [key: string]: object };
            return Object.keys(res).map(id => {
              return {
                id,
                ...res[id]
              } as unknown as Comment;
            })
          }

          return [];
        })
      )
  }

  public createComment(id: string, comment: object) {
    return this.http.patch((environment.apiUrl + '/questions/' + id + '/comments' + '.json'), comment)
  }
}
