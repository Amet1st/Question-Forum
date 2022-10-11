import { Pipe, PipeTransform } from '@angular/core';
import {Post} from "../../models/interfaces/post.interface";

@Pipe({
  name: 'filterByTime',
  pure: false
})
export class FilterByTimePipe implements PipeTransform {

  transform(posts: Post[], time: string): Post[] {

    switch (time) {
        case 'Last day':
          return  posts.filter(post => this.getTimeDifference(post.date) <= 8.64e+7);
        case 'Last week':
          return  posts.filter(post => this.getTimeDifference(post.date) <= 6.048e+8);
        case 'Last month':
          return posts.filter(post => this.getTimeDifference(post.date) <= 2.628e+9);
        case 'All time':
          return posts;
      }

      return posts;
  }

  private getTimeDifference(date: Date): number {
    return new Date().getTime() - new Date(date).getTime();
  }

}
