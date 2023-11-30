import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Column, ColumnData } from '../nh-mat-grouped-table/nh-mat-grouped-table.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'nh-mat-table',
  templateUrl: './nh-mat-table.component.html',
  styleUrls: ['./nh-mat-table.component.scss']
})
export class NhMatTableComponent {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() filter?: { show: boolean, placeholder?: string };

  _filterValue: string = "";
  get filterValue() {
    return this._filterValue;  
  }
  set filterValue(value: string) {
    this._filterValue = value;

    this.applyFilter(value);
  }

  @Input() pager?: { pageSizeOptions?: number[], defaultPageSize?: number, position?: "top" | "bottom" | "disabled", hidePageSize?: boolean }

  // BUG if `data` is given to the child component before columnOrder, it wont work
  // This is because, to initialize the data, you need to have the columnOrder initialized first
  // It's already fixed in the "nh-mat-grouped-table" component
  _dataItems: Item[] = [];
  _data: { [key: string]: any }[] = [];
  @Input() set data(value: { [key: string]: any }[] | null) {
    console.log(value)
    if (!value) {
      this._data = [];
      this.dataSource.data = [];
      return;
    }

    this._data = value;
    
    const buff: Item[] = [];
    for (let i = 0; i < value.length; ++i) {
      const data: { [key: string]: ColumnData } = {};
      for (let j = 0; j < this._columnOrder.length; ++j) {
        data[this._columnOrder[j].columnDef] =
          this._columnOrder[j].cell(value[i]);
      }
      buff.push({ index: i, data });
    }
  
    this._dataItems = buff;
  
    if (this.dataSource) this.dataSource.data = buff;
  }
  get data() {
    return this._data;
  }
  
  _columnOrder: Column<any>[] = [];
  @Input() set columnOrder(value: Column<any>[]) {
    this._columnOrder = value;

    const buff: string[] = [];

    for (let i = 0; i < this.columnOrder.length; ++i)
      buff.push(this.columnOrder[i].columnDef)

    this.displayedColumnOrder = buff;
  }
  get columnOrder(): Column<any>[] {
    return this._columnOrder;
  }

  displayedColumnOrder: string[] = [];

  dataSource: MatTableDataSource<Item> = new MatTableDataSource();

  dragEnabled: boolean = true;

  @Output() rowClicked: EventEmitter<number> = new EventEmitter();
  @Output() rowDblClicked: EventEmitter<number> = new EventEmitter();

  ngOnInit() { }

  ngAfterViewInit() {
    this.dataSource.sortData = this.sortFunc;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // TODO create costum filterFunc
  // also make filter behaviour for certain fields by the parent

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator)
      this.dataSource.paginator.firstPage();
  }

  onRowDblClick() {
    console.log("dblclick")
  }

  onRowClicked(index: number) {
    this.rowClicked.emit(index);
  }
  
  onRowDblClicked(index: number) {
    this.rowDblClicked.emit(index);
  }

  sortFunc(items: Item[], sort: MatSort): Item[] {
    // If the sorting is not active or no direction is given
    // Just give back the items[] with the same order
    if (!sort.active || sort.direction == '') return items;

    //  > 0: sort `a` after `b`
    //  < 0: sort `a` before `b`
    // == 0: keep original order of `a` and `b`
    // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    return items.sort((a, b) => {
      let result: number = 0;

      // When the selected column value is a number just substract the value of `a` from `b`
      if (typeof a.data[sort.active] == "number") result = a.data[sort.active] - b.data[sort.active];
      // If it is a string just order by alphabet
      else result = a.data[sort.active].toString().localeCompare(b.data[sort.active].toString());

      // Multiply by the direction the ordering should be happening and return the value
      return result * (sort.direction == "asc" ? 1 : -1);
    });
  }

  dragging: boolean = false;

  onDragged(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumnOrder, event.previousIndex, event.currentIndex);
  }

  onResizedColumnSize(index: number, event: number) {
    console.log(this.dragEnabled);
    this.columnOrder[index].width = event;
  }
  
  onResizeClicked(event: boolean) {
    this.dragEnabled = !event;
    // if (event)
    //   this.dragEnabled = !event;
    // else
      
    console.log(this.dragEnabled);
  }
}

interface Item {
  index: number;
  data: { [key: string]: any };
}