import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NhMatTableComponent } from './nh-mat-table.component';

describe('NhMatTableComponent', () => {
  let component: NhMatTableComponent;
  let fixture: ComponentFixture<NhMatTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NhMatTableComponent]
    });
    fixture = TestBed.createComponent(NhMatTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
