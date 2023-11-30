import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeableTableComponent } from './resizeable-table.component';

describe('ResizeableTableComponent', () => {
  let component: ResizeableTableComponent;
  let fixture: ComponentFixture<ResizeableTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResizeableTableComponent]
    });
    fixture = TestBed.createComponent(ResizeableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
