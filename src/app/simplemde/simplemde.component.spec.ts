import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplemdeComponent } from './simplemde.component';

describe('SimplemdeComponent', () => {
  let component: SimplemdeComponent;
  let fixture: ComponentFixture<SimplemdeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimplemdeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimplemdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
