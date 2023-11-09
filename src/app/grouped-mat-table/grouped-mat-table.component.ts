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
  @Input() pager?: { pageSizeOptions?: number[], defaultPageSize?: number, position?: "top" | "bottom" | "disabled" }
  @Input({ required: true }) columnOrder!: Column<any>[];
  @Input({ required: true }) data!: Group<ItemData>[];
  @Input() showIndex: "normal" | "relative" | "both" | "none" = "none";
  
  _data: (Item | GroupItem)[] = [];

  displayedColumnOrder: string[] = [];

  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    let id = 0;
    let itemId = 0;
    for (let i = 0; i < this.data.length; ++i) {
      const group = this.data[i];
      const groupId = id;
      // console.log({ itemId, groupId });

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
        
        const item: Item = {
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

    // console.log(this._data)
    
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator)
      this.dataSource.paginator.firstPage();
  }

  // TODO add "expanded" filter or something to hide the unexpended entries

  expandRow(event: GroupItem) {
    event.isExpanded = !event.isExpanded;

    // console.log(event)

    for (let i = event.id + 1; (this._data[i] as Item)["groupId"] == event.id; ++i) {
      // this._data[i].isExpanded = event.isExpanded;
      this.dataSource.data[i].isExpanded = event.isExpanded
    }

    // this.refreshFilter();
  }

  isGroup(index: number, item: GroupItem | Item): boolean {
    if ((item as GroupItem).isGroup == true) return true
    return false;
  }

  isExpanded(index: number, item: GroupItem | Item) {
    if (!Object.hasOwn(item, "isGroup")) return item.isExpanded;
    else return false;
  }

  refreshFilter() {
    this.dataSource.data.filter((val) => {
      // console.log({ val, idk: Object.hasOwn(val, "isGroup") || val.isExpanded })
      if (Object.hasOwn(val, "isGroup") || val.isExpanded) return val;
    })
  }

  filterFunc(data: any, filter: string): boolean {
    if (!filter) return true;
    if (Object.hasOwn(data, "isGroup")) return true;

    // const group = this.dataSource.data[data.groupId] as GroupItem;
    // const findIndex = (val: number): number =>
    //   (group.children as number[]).findIndex((value) => value == val);
    
    // const dataIndex = findIndex(data.groupId);

    for (let [_, value] of Object.entries(data.data)) {
      // if (typeof value != "string" && typeof value != "number") continue;

      if (
        typeof value == "number" &&
        value.toString().startsWith(filter)
      ) {
        console.log(data)
        return true
      }
      else if (
        typeof value == "string" &&
        value.toLowerCase().startsWith(filter.toLocaleLowerCase())
      ) {
        console.log(data)
        return true;
      }

    }

    // if (dataIndex) group.children.splice(dataIndex, 1);
    return false;
  }

  sortFunc(items: Item[], sort: MatSort): Item[] {
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
    // this.children = [];
  }
  name: string;
  isExpanded: boolean;
  isGroup: boolean = true;
  groupId: number;
  numChildren: number;
  id: number;
  // children: number[];
}

interface ItemData {
  [key: string]: any,
}

interface Item {
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