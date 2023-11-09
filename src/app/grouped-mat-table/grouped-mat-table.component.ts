import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Group } from '../home/home.component';

@Component({
  selector: 'nh-grouped-mat-table',
  templateUrl: './grouped-mat-table.component.html',
  styleUrls: ['./grouped-mat-table.component.scss']
})
export class NhGroupedMatTable {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() filter?: { show: boolean, placeholder?: string };
  // @Input() pager?: { pageSizeOptions?: number[], defaultPageSize?: number, position?: "top" | "bottom" | "disabled" }
  @Input({ required: true }) columnOrder!: Column<any>[];
  @Input({ required: true }) data!: Group<ItemData>[];
  @Input() showIndex: "normal" | "relative" | "both" | "none" = "none";
  
  _data: (DataItem | GroupItem)[] = [];

  displayedColumnOrder: string[] = [];

  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    this.initData(this.data);

    this.dataSource = new MatTableDataSource(this._data);

    this.displayedColumnOrder.push("_emptyCol")

    if (this.showIndex == 'normal' || this.showIndex == 'both')
      this.displayedColumnOrder.push("_index")
    
    if (this.showIndex == 'relative' || this.showIndex == 'both')
      this.displayedColumnOrder.push("_relativeIndex")

    for (let i = 0; i < this.columnOrder.length; ++i)
      this.displayedColumnOrder.push(this.columnOrder[i].columnDef);

    this.dataSource.sortData = this.sortFunc;
    this.dataSource.filterPredicate = this.filterFunc;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  initData(dataArr: Group<ItemData>[]) {
    let id = 0;
    let itemId = 0;

    for (let i = 0; i < dataArr.length; ++i) {
      const group = dataArr[i];
      const groupId = id;

      this._data.push(
        new GroupItem(
          i,
          group.name,
          group.isExpanded,
          id,
          group.items.length
        )
      );

      for (let j = 0; j < group.items.length; ++j) {
        ++id;
        
        const item: DataItem = {
          data: group.items[j],
          groupId,
          id: id,
          isExpanded: true,
          itemId,
          relativeIndex: j
        };

        this._data.push(item);
        ++itemId;
      }
      ++id;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator)
      this.dataSource.paginator.firstPage();
  }

  toggleRow(event: GroupItem) {
    event.isExpanded = !event.isExpanded;

    for (let i = event.id + 1; (this._data[i] as DataItem)["groupId"] == event.id; ++i)
      this.dataSource.data[i].isExpanded = event.isExpanded
  }

  isGroup(_: number, item: GroupItem | DataItem): boolean {
    if ((item as GroupItem).isGroup == true) return true
    return false;
  }

  filterFunc(data: any, filter: string): boolean {
    if (!filter) return true;
    if (Object.hasOwn(data, "isGroup")) return true;

    for (let [_, value] of Object.entries(data.data)) {
      if (
        typeof value == "number" &&
        value.toString().startsWith(filter)
      ) return true
      else if (
        typeof value == "string" &&
        value.toLowerCase().startsWith(filter.toLocaleLowerCase())
      ) return true;
    }

    return false;
  }

  sortFunc(items: DataItem[], sort: MatSort): DataItem[] {
    if (!sort.active || sort.direction == '') return items;

    return items.sort((a, b) => {
      let result: number = 0;

      if (Object.hasOwn(a, 'isGroup') || Object.hasOwn(b, 'isGroup')) return 0;

      if (typeof a.data[sort.active] == "number") result = a.data[sort.active] - b.data[sort.active];
      else result = a.data[sort.active].localeCompare(b.data[sort.active]);

      return result * (sort.direction == "asc" ? 1 : -1);
    })
  }
}

class GroupItem {
  constructor(groupId: number, name: string, isExpanded: boolean, id: number, numChildren?: number) {
    this.groupId = groupId;
    this.isExpanded = isExpanded;
    this.name = name;
    this.id = id;
    this.numChildren = numChildren ?? 0;
  }
  name: string;
  isExpanded: boolean;
  isGroup: boolean = true;
  groupId: number;
  numChildren: number;
  id: number;
}

interface ItemData {
  [key: string]: any,
}

interface DataItem {
  data: ItemData,
  id: number,
  groupId: number,
  isExpanded: boolean,
  itemId: number;
  relativeIndex: number;
}

export interface Column<T> {
  columnDef: string,
  header: string,
  cell: (element: T) => string
};