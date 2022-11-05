import {Pipe, PipeTransform} from '@angular/core';
import {Post} from '../../models/interfaces/post.interface';
import {FilterByTagOption} from '../../models/types/filter-by-tag-option.type';

@Pipe({
  name: 'filterByTag',
  pure: false
})
export class FilterByTagPipe implements PipeTransform {

  transform(posts: Post[] = [], tag: FilterByTagOption): Post[] {

    return posts.filter(post => post.tags.includes(tag.toLowerCase()));
  }

}
