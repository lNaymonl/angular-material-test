import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedMatTableComponent } from './grouped-mat-table.component';

describe('GroupedMatTableComponent', () => {
  let component: GroupedMatTableComponent;
  let fixture: ComponentFixture<GroupedMatTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupedMatTableComponent]
    });
    fixture = TestBed.createComponent(GroupedMatTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
