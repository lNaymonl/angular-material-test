import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowSpanTableComponent } from './row-span-table.component';

describe('RowSpanTableComponent', () => {
  let component: RowSpanTableComponent;
  let fixture: ComponentFixture<RowSpanTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RowSpanTableComponent]
    });
    fixture = TestBed.createComponent(RowSpanTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
