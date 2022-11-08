import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClickOutsideDirective} from './directives/click-outside.directive';
import {FilterByTagPipe} from './pipes/filter-by-tag.pipe';
import {FilterByTimePipe} from './pipes/filter-by-time.pipe';
import {FilterBySolutionPipe} from './pipes/filter-by-solution.pipe';
import {FilterByOtherPipe} from './pipes/filter-by-other.pipe';
import {SortPostsPipe} from './pipes/sort-posts.pipe';


@NgModule({
  declarations: [
    ClickOutsideDirective,
    FilterByTagPipe,
    FilterByTimePipe,
    FilterBySolutionPipe,
    FilterByOtherPipe,
    SortPostsPipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ClickOutsideDirective,
    FilterByTagPipe,
    FilterByTimePipe,
    FilterBySolutionPipe,
    FilterByOtherPipe,
    SortPostsPipe,
  ]
})
export class SharedModule {
}
