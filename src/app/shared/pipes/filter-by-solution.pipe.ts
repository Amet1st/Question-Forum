import {Pipe, PipeTransform} from '@angular/core';
import {Post} from "../../models/interfaces/post.interface";

@Pipe({
  name: 'filterBySolution',
  pure: false
})
export class FilterBySolutionPipe implements PipeTransform {

  transform(posts: Post[], solution: string): Post[] {

      switch (solution) {
        case 'Solved':
          return posts.filter(post => post.isSolved);
        case 'Not solved':
          return posts.filter(post => !post.isSolved);
      }

      return posts;
  }

}
