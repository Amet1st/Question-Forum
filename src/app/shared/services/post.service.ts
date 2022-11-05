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
    return this.http.post((environment.apiUrl + '/posts.json'), post);
  }

  public getPost(id: string): Observable<Post> {
    return this.http.get<Post>((environment.apiUrl + '/posts/' + id + '.json'))
      .pipe(
        map(item => {
          const comments: Comment[] = this.getAllComments(item.comments);
          if(comments.length) {
            return {
              ...item,
              id,
              comments: Object.keys(comments).map((commentId: any) => {
                return {
                  commentId,
                  ...comments[commentId]
                }
              })
            }
          }

          return {
            ...item,
            id,
            comments: []
          }
        }))
  }

  public getAllComments(comments: object): Comment[] {
    if(!comments) {
      return [];
    }

    const res = comments as {[key: string]: object}
    return Object.keys(res).map((id: string) => {
      return {
        id,
        ...res[id]
      } as Comment;
    })
  }

  public getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>((environment.apiUrl + '/posts.json'))
      .pipe(
        map(data => {
          if (data) {
            return Object.keys(data).map((id: any) => {
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
    return this.http.patch<Post>((environment.apiUrl + '/posts/' + id + '.json'), post);
  }

  public createComment(id: string, comment: object): Observable<Object> {
    return this.http.post((environment.apiUrl + '/posts/' + id + '/comments.json'), comment)
  }

  public markCommentAsSolution(postId: string, commentId: string): Observable<Object>  {
    return this.http
      .patch((environment.apiUrl + '/posts/' + postId + '/comments/' + commentId + '.json'), {
        isSolution: true
      })
  }

  public markPostAsSolved(id: string) {
    return this.http.patch((environment.apiUrl + '/posts/' + id + '.json'), {
      isSolved: true
    })
  }

  public approvePost(id: string): Observable<Object> {
    return this.http.patch((environment.apiUrl + '/posts/' + id + '.json'), {
      isApproved: true
    });
  }

  public deletePost(id: string): Observable<Object> {
    return this.http.delete((environment.apiUrl + '/posts/' + id + '.json'));
  }
}
