import {UsersService} from './users.service';
import {EMPTY} from 'rxjs';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService(null);
  });

  it('should make a request for the user creation', () => {
    const spy = spyOn(service, 'createUser').and.callFake(() => {
      return EMPTY;
    });
    service.createUser(null);

    expect(spy).toHaveBeenCalled();
  });

  it('should make a request for getting the user', () => {
    const spy = spyOn(service, 'getUserByEmail').and.callFake(() => {
      return EMPTY;
    });
    service.getUserByEmail(null);

    expect(spy).toHaveBeenCalled();
  });
})
