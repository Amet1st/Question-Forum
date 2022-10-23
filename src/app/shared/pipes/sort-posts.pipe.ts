import { Pipe, PipeTransform } from '@angular/core';
import {Post} from "../../models/interfaces/post.interface";

@Pipe({
  name: 'sortPosts'
})
export class SortPostsPipe implements PipeTransform {

  transform(posts: Post[] = [], option: string): Post[] {
    if (option === 'Old first') {
      return posts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

}
