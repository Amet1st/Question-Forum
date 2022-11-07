import {Pipe, PipeTransform} from '@angular/core';
import {Post} from '../../models/interfaces/post.interface';
import {FilterByTagOption} from '../../models/types/filter-by-tag-option.type';

@Pipe({
  name: 'filterByTag',
})
export class FilterByTagPipe implements PipeTransform {

  transform(posts: Post[] = [], option: FilterByTagOption): Post[] {

    if (option === 'All' || option === 'By category') {
      return posts;
    }

    return posts.filter(post => post.tags.includes(option.toLowerCase()));
  }

}
