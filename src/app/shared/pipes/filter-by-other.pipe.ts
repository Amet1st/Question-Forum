import {Pipe, PipeTransform} from '@angular/core';
import {Post} from '../../models/interfaces/post.interface';
import {AuthService} from '../services/auth.service';
import {FilterByOtherOption} from '../../models/types/filter-by-other-option.type';


@Pipe({
  name: 'filterByOther',
})
export class FilterByOtherPipe implements PipeTransform {

  constructor(
    private authService: AuthService
  ) {
  }

  transform(posts: Post[] = [], option: FilterByOtherOption): Post[] {

    switch (option) {
      case 'My questions':
        return posts.filter(post => post.author === this.authService.currentUser.email);
      case 'On moderation':
        return posts.filter(post => !post.isApproved);
      default:
        return posts;
    }
  }

}
