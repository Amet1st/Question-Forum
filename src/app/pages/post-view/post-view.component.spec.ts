import {PostViewComponent} from './post-view.component';
import {FormBuilder} from '@angular/forms';

describe('PostViewComponent', () => {
  let component: PostViewComponent;

  beforeEach(() => {
    component = new PostViewComponent(
      null,
      null,
      null,
      null,
      new FormBuilder(),
      null,
      null,
      );
  });

  it('should create text field', () => {
    component.initForm();

    expect(component.form.contains('text')).toBeTruthy();
  });

  it('should mark field as invalid if incorrect value', () => {
    component.initForm();

    const text = component.form.get('text');
    text.setValue('');

    expect(text.invalid).toBeTruthy();
  });
})
