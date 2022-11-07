import {Pipe, PipeTransform} from '@angular/core';
import {Post} from '../../models/interfaces/post.interface';
import {FilterBySolutionOption} from '../../models/types/filter-by-solution-option.type';


@Pipe({
  name: 'filterBySolution',
})
export class FilterBySolutionPipe implements PipeTransform {

  transform(posts: Post[] = [], solution: FilterBySolutionOption): Post[] {

    switch (solution) {
      case 'Solved':
        return posts.filter(post => post.isSolved);
      case 'Not solved':
        return posts.filter(post => !post.isSolved);
      default:
        return posts;
    }

  }

}
