import {Pipe, PipeTransform} from '@angular/core';
import {Post} from '../../models/interfaces/post.interface';
import {SortPostsOption} from '../../models/types/sort-posts-option.type';

@Pipe({
  name: 'sortPosts'
})
export class SortPostsPipe implements PipeTransform {

  transform(posts: Post[] = [], option: SortPostsOption = 'New first'): Post[] {

    switch (option) {
      case 'New first':
        return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'Old first':
        return posts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
  }

}
