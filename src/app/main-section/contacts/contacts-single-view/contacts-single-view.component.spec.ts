import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsSingleViewComponent } from './contacts-single-view.component';

describe('ContactsSingleViewComponent', () => {
  let component: ContactsSingleViewComponent;
  let fixture: ComponentFixture<ContactsSingleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsSingleViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsSingleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
