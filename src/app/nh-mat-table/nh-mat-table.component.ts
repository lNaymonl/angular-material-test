import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Group } from '../home/home.component';

@Component({
  selector: 'nh-mat-table',
  templateUrl: './nh-mat-table.component.html',
  styleUrls: ['./nh-mat-table.component.scss']
})
export class NhMatTableComponent {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() filter?: { show: boolean, placeholder?: string };
  @Input() pager?: { pageSizeOptions?: number[], defaultPageSize?: number, position?: "top" | "bottom" | "disabled" }
  @Input({ required: true }) columnOrder!: { displayName?: string, name: string }[];
  @Input({ required: true }) data!: unknown[];

  displayedColumnOrder: string[] = [];

  dataSource!: MatTableDataSource<unknown>;

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.data);

    for (let i = 0; i < this.columnOrder.length; ++i)
      this.displayedColumnOrder.push(this.columnOrder[i].name)
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator)
      this.dataSource.paginator.firstPage();
  }
}
