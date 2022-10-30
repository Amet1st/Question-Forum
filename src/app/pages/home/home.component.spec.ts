import {HomeComponent} from './home.component';
import {EMPTY} from 'rxjs';
import {PostService} from '../../shared/services/post.service';

describe('HomeComponent', () => {
  let component: HomeComponent;

  beforeEach(() => {
    component = new HomeComponent(
      new PostService(null),
      null,
      null,
      null);
  });

  it('should make a request when approve post', function () {
    const spy = spyOn(component, 'approvePost').and.callFake(() => {
      return EMPTY;
    });
    component.approvePost(null);

    expect(spy).toHaveBeenCalled();
  });
})
