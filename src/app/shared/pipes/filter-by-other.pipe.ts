import {Pipe, PipeTransform} from '@angular/core';
import {Post} from "../../models/interfaces/post.interface";

@Pipe({
  name: 'filterByOther'
})
export class FilterByOtherPipe implements PipeTransform {

  transform(posts: Post[], option: string, userEmail: string): Post[] {

    switch (option) {
      case 'My questions':
        return posts.filter(post => post.author === userEmail);
      case 'On moderation':
        return posts.filter(post => !post.isApproved);
    }

    return posts;
  }

}
