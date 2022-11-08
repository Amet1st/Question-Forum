import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Post} from 'src/app/models/interfaces/post.interface';
import {Comment} from 'src/app/models/interfaces/comment.inteface';

@Injectable({
  providedIn: 'root'
})

export class PostService {

  constructor(
    private http: HttpClient
  ) { }

  public createPost(post: Post): Observable<Object> {
    return this.http.post<Post>(`${environment.apiUrl}/posts.json`, post);
  }

  public getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${environment.apiUrl}/posts/${id}.json`)
      .pipe(
        map(item => {
          const comments: Comment[] = this.getAllComments(item.comments);
          if (comments.length) {
            return {
              ...item,
              id,
              comments: Object.keys(comments).map((commentId: string) => {
                return {
                  commentId,
                  ...comments[commentId]
                };
              })
            };
          }

          return {
            ...item,
            id,
            comments: []
          };
        }))
  }

  public getAllComments(comments: Comment[]): Comment[] {
    if (!comments) {
      return [];
    }

    return Object.keys(comments).map((id: string) => {
      return {
        id,
        ...comments[id]
      };
    });
  }

  public getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.apiUrl}/posts.json`)
      .pipe(
        map(data => {
          if (data) {
            return Object.keys(data).map((id: string) => {
              return {
                id,
                ...data[id]
              };
            });
          }

          return [];
        })
      )
  }

  public updatePost(id: string, post: Post): Observable<Object> {
    return this.http.put<Post>(`${environment.apiUrl}/posts/${id}.json`, post);
  }

  public createComment(id: string, comment: Partial<Comment>): Observable<Object> {
    return this.http.post<Comment>(`${environment.apiUrl}/posts/${id}/comments.json`, comment);
  }

  public markCommentAsSolution(postId: string, commentId: string): Observable<Object> {
    return this.http
      .patch<Partial<Comment>>(`${environment.apiUrl}/posts/${postId}/comments/${commentId}.json`, {
        isSolution: true
      });
  }

  public markPostAsSolved(id: string) {
    return this.http.patch<Partial<Post>>(`${environment.apiUrl}/posts/${id}.json`, {
      isSolved: true
    });
  }

  public approvePost(id: string): Observable<Object> {
    return this.http.patch<Partial<Post>>(`${environment.apiUrl}/posts/${id}.json`, {
      isApproved: true
    });
  }

  public deletePost(id: string): Observable<Object> {
    return this.http.delete(`${environment.apiUrl}/posts/${id}.json`);
  }
}
