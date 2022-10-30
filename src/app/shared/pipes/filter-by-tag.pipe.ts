import {Pipe, PipeTransform} from '@angular/core';
import {Post} from "../../models/interfaces/post.interface";

@Pipe({
  name: 'filterByTag',
  pure: false
})
export class FilterByTagPipe implements PipeTransform {

  transform(posts: Post[], tag: string): Post[] {

    if (tag === 'All' || tag === 'By category') {
      return posts;
    }

    return posts.filter(post => post.tags.includes(tag.toLowerCase()));
  }

}
