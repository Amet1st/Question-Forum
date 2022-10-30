import {AfterViewInit, Directive, ElementRef, EventEmitter, Inject, OnDestroy, Output} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {filter, fromEvent, Subject, takeUntil} from "rxjs";

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective implements AfterViewInit, OnDestroy{

  @Output() clickOutside = new EventEmitter<void>();
  private destroy = new Subject<boolean>()

  constructor(
    private element: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngAfterViewInit() {
    fromEvent(this.document, 'click')
      .pipe(
        filter(event => !this.isInside(event.target as HTMLElement)),
        takeUntil(this.destroy)
      )
      .subscribe(() => {
        this.clickOutside.emit();
      })
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }

  private isInside(elementToCheck: HTMLElement): boolean {
    return elementToCheck === this.element.nativeElement || this.element.nativeElement.contains(elementToCheck);
  }
}
