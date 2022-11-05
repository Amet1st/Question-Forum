import {Pipe, PipeTransform} from '@angular/core';
import {Post} from '../../models/interfaces/post.interface';
import {FilterByTimeOption} from '../../models/types/filter-by-time-option.type';

@Pipe({
  name: 'filterByTime',
  pure: false
})
export class FilterByTimePipe implements PipeTransform {

  transform(posts: Post[] = [], time: FilterByTimeOption): Post[] {

    switch (time) {
      case 'Last day':
        return posts.filter(post => this.getTimeDifference(post.date) <= 8.64e+7);
      case 'Last week':
        return posts.filter(post => this.getTimeDifference(post.date) <= 6.048e+8);
      case 'Last month':
        return posts.filter(post => this.getTimeDifference(post.date) <= 2.628e+9);
      default:
        return posts;
    }

  }

  private getTimeDifference(date: Date): number {
    return Date.now() - new Date(date).getTime();
  }

}
