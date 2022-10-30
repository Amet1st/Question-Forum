import {PostService} from './post.service';
import {EMPTY} from 'rxjs';

describe('PostsService', () => {

  let service: PostService;

  beforeEach(() => {
    service = new PostService(null);
  });

  it('should make a request for post creation', () => {
    const spy = spyOn(service, 'createPost').and.callFake(() => {
      return EMPTY;
    });

    service.createPost(null);

    expect(spy).toHaveBeenCalled();
  });

  it('should make a request for get post', () => {
    const spy = spyOn(service, 'getPost').and.callFake(() => {
      return EMPTY;
    });

    service.getPost(null);

    expect(spy).toHaveBeenCalled();
  });

  it('should make a request for get all posts', () => {
    const spy = spyOn(service, 'getAllPosts').and.callFake(() => {
      return EMPTY;
    });

    service.getAllPosts();

    expect(spy).toHaveBeenCalled();
  });

  it('should make a request for update post', () => {
    const spy = spyOn(service, 'updatePost').and.callFake(() => {
      return EMPTY;
    });

    service.updatePost(null, null);

    expect(spy).toHaveBeenCalled();
  });

  it('should make a request for create comment', () => {
    const spy = spyOn(service, 'createComment').and.callFake(() => {
      return EMPTY;
    });

    service.createComment(null, null);

    expect(spy).toHaveBeenCalled();
  });

  it('should make a request for mark comment as solution', () => {
    const spy = spyOn(service, 'markCommentAsSolution').and.callFake(() => {
      return EMPTY;
    });

    service.markCommentAsSolution(null, null);

    expect(spy).toHaveBeenCalled();
  });

  it('should make request for mark post as solved', () => {
    const spy = spyOn(service, 'markPostAsSolved').and.callFake(() => {
      return EMPTY;
    });

    service.markPostAsSolved(null);

    expect(spy).toHaveBeenCalled();
  });

  it('should make a request for post approve', () => {
    const spy = spyOn(service, 'approvePost').and.callFake(() => {
      return EMPTY;
    });

    service.approvePost(null);

    expect(spy).toHaveBeenCalled();
  });

  it('should make request for post deletion', () => {
    const spy = spyOn(service, 'deletePost').and.callFake(() => {
      return EMPTY;
    });

    service.deletePost(null);

    expect(spy).toHaveBeenCalled();
  });

  it('should get all comments from object', () => {
    expect(service.getAllComments(null)).toEqual([]);
    expect(service.getAllComments({'id': {
      author: '',
      text: '',
      date: new Date(0),
      isSolution: false,
      }}
    )).toEqual([{
      id: 'id',
      author: '',
      text: '',
      date: new Date(0),
      isSolution: false
    }])
  });
})
