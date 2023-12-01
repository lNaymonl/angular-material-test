import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'nh-mat-grouped-table',
  templateUrl: './nh-mat-grouped-table.component.html',
  styleUrls: [
    // './nh-mat-grouped-table.component.scss',
    '../nh-mat-table/nh-mat-table.component.scss',
  ]
})
export class NhMatGroupedTable {
  @ViewChild(MatSort) sort!: MatSort; // Init the sorting

  @Input() filter?: { show: boolean, placeholder?: string }; // Wether to show the filter input or not and which placeholder to use

  private _columnOrder$: BehaviorSubject<Column<any>[]> = new BehaviorSubject<Column<any>[]>([]);
  private _columnOrder: Column<any>[] = [];
  @Input() set columnOrder(value: Column<any>[]) {
    this._columnOrder = value;

    this._columnOrder$.next(value);
  }
  get columnOrder(): Column<any>[] {
    return this._columnOrder;
  }

  private _data$: BehaviorSubject<Group[] | null> = new BehaviorSubject<Group[] | null>(null);
  // The input data but groups and items in a flat array. Also in a specific order
  private _data: (DataItem | GroupItem)[] = [];
  // All the groups to show, including their items
  @Input() set data(value: Group[] | null) {
    this._data$.next(value);
  }
  @Input() showIndex: "normal" | "relative" | "both" | "none" = "none";

  @Output() rowClicked: EventEmitter<DataItemAsIndex> = new EventEmitter();
  @Output() rowDblClicked: EventEmitter<DataItemAsIndex> = new EventEmitter();

  dragEnabled: boolean = true;

  // Initializes both the column order and the actual data
  private _setData$ = combineLatest([
    this._columnOrder$,
    this._data$
  ]).pipe(
    map(([co, d]) => {
      { // Init the column order
        this.displayedColumnOrder = [
          ...this.getStaticCols(),
          ...co.map(col => col.columnDef)
        ];
      }

      { // Init the data
        if (!this.dataSource) this.initDataSource();

        // Reset the selected row
        this.markRowAsSelected(null);

        if (!d) {
          this._data = [];
          this.dataSource.data = [];
          return;
        }

        // Converts the data and saves it in the _data[] so it can be used by the data source
        this._data = this.convertGroupArrToFlatItemArr(d);

        // Sets the data source to the converted data and creates it when the data source is null
        this.dataSource.data = this._data;
      }
    })
  ).subscribe();

  // The input column order but in a flat string array and just the column defs
  displayedColumnOrder: string[] = [];

  // A material data source
  dataSource!: MatTableDataSource<any>;

  _filterValue: string = "";
  get filterValue() {
    return this._filterValue;  
  }
  set filterValue(value: string) {
    this._filterValue = value;

    this.applyFilter(value);
  }

  // selectedRowIndex: number = null;
  _selectedIndex: index | null = null;
  @Input() set selectedIndex(value: index | null) {
    this.onSelectionChanged(value);
    
    this._selectedIndex = value;
  }
  get selectedIndex() {
    return this._selectedIndex;
  }

  initDataSource() {
    this.dataSource = new MatTableDataSource<any>([]);

    // Sets the sort and filter function for the datasource
    this.dataSource.sortData = this.sortFunc;
    this.dataSource.filterPredicate = this.filterFunc;
  }

  ngAfterViewInit() {
    // Initialising the sort of the datasource
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this._setData$.unsubscribe();
  }

  onSelectionChanged(value: index | null) {
    this.markRowAsSelected(value);

    // this.selectionChanged.emit(new DataItemAsIndex(groupId, dataItem.relativeGroupItemIndex));
  }

  getStaticCols(): string[] {
    const buff: string[] = [];
    // Adds an empty column so the group is better visible as a group
    // buff.push("_emptyCol")

    if (!this.showIndex) return buff;

    if (this.showIndex == 'normal' || this.showIndex == 'both')
      buff.push("_index")
    
    if (this.showIndex == 'relative' || this.showIndex == 'both')
      buff.push("_relativeIndex")

    return buff;
  }

  /**
   * Sets the currently selected element and emits an event which indicates
   * @param globalItemIndex the global index of the item which was (double) clicked on
   * @param doubleClick wether the event was a double click or just a normal click
   */
  onRowClicked(globalItemIndex: number, doubleClick: boolean = false) {
    this.selectedIndex = globalItemIndex;

    if (!this.selectedIndex)
      throw new Error("Die Zeile konnte nicht ausgeählt werden!")

    const dataItem = (this._data[this.selectedIndex] as DataItem);

    // Converts the index of the group relative to all items in the _date[]
    // to the index relative to the group count
    const groupId = (this._data[dataItem.groupRefIndex] as GroupItem).globalGroupItemIndex;

    // Emits the event
    if (!doubleClick) this.rowClicked.emit(new DataItemAsIndex(groupId, dataItem.relativeGroupItemIndex));
    else this.rowDblClicked.emit(new DataItemAsIndex(groupId, dataItem.relativeGroupItemIndex));
  }

  markRowAsSelected(globalItemIndex: index | null) {
    if (this.selectedIndex == globalItemIndex) return;
    
    if (this.selectedIndex)
      (this._data[this.selectedIndex] as DataItem).selected = false;
    
    if (!globalItemIndex) {
      this._selectedIndex = null;
      return;
    }
    
    const currentDataItem = this._data[globalItemIndex] as DataItem;
    currentDataItem.selected = true;
  }

  /**
   * Converts an array of data grouped in objects to a flat array where groupes are similiar to items
   * @param dataArr An arr of data where the data items are grouped in objects
   * @returns the converted array
   */
  convertGroupArrToFlatItemArr(dataArr: Group[]): (DataItem | GroupItem)[] {
    const buff: (DataItem | GroupItem)[] = [];
    let id = 0;
    let itemId = 0;

    for (let i = 0; i < dataArr.length; ++i) {
      const group = dataArr[i];
      const groupId = id;

      buff.push(
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
        
        const data: ItemData = {};
        for (let y = 0; y < this._columnOrder.length; ++y) {
          data[this._columnOrder[y].columnDef] =
            this.columnOrder[y].cell(group.items[j]);
        }

        const item: DataItem = {
          data: data,
          groupRefIndex: groupId,
          globalIndex: id,
          isExpanded: true,
          globalDataItemIndex: itemId,
          relativeGroupItemIndex: j,
          selected: false
        };

        buff.push(item);
        ++itemId;
      }
      ++id;
    }

    return buff;
  }

  /**
   * Handles the event emitted by the fitler input
   * @param event The HtmlInputElement which emitted the event
   */
  applyFilter(filterValue: string) {
    // Sets the filter value of the data source accordingly
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Sets the page of the data source to the first one if the data source has a paginator initialised
    if (this.dataSource.paginator)
      this.dataSource.paginator.firstPage();
  }

  /**
   * Handles the event emitted by a group row when it is clicked on
   * @param event The group item which has been clicked on
   */
  toggleRow(event: GroupItem) {
    // Reverse the state of the expanded state of the group
    event.isExpanded = !event.isExpanded;

    // Sets the expanded state of the group's items to the according state
    for (let i = event.globalIndex + 1; i < this._data.length; ++i) {
      if (this._data[i].hasOwnProperty("isGroup")) break;

      const item: DataItem = this._data[i] as DataItem;

      if (item.groupRefIndex != event.globalIndex) break;

      item.isExpanded = event.isExpanded;
    }
  }

  /**
   * Checks wether the given item is a group or not
   * @param _ 
   * @param item The item in question
   * @returns true if it is a group
   */
  isGroup(_: number, item: GroupItem | DataItem): boolean {
    if ((item as GroupItem).isGroup == true) return true
    return false;
  }

  /**
   * Checks if the given item has overlapping values with the given filter value
   * @param data The data item to check for overlapping values
   * @param filter The value to filter for
   * @returns true if the given item is a group or fulfilles the condition
   */
  filterFunc(data: any, filter: string): boolean {
    // If no filter was provided, include all items
    if (!filter) return true;

    // If the item is a group, include it
    if (data.hasOwnProperty("isGroup")) return true;

    // Iterates all fields of the item
    for (let [_, value] of Object.entries(data.data)) {
      // If the value is a number
      // convert it to a string and check if it starts with the filter value
      if (
        typeof value == "number" &&
        value.toString().startsWith(filter)
      ) return true

      // If the value is a number
      // check if it starts with the filter value
      else if (
        typeof value == "string" &&
        value.toLowerCase().startsWith(filter.toLocaleLowerCase())
      ) return true;

      else if (
        value instanceof Date &&
        value.toLocaleDateString().includes(filter)
      ) return true;

      else if (value?.toString().startsWith(filter.toLocaleLowerCase()))
        return true
    }

    // If nothing matched, don't include it
    return false;
  }

  /**
   * Sorts the array of data in the data source
   * @param items All items in the data source
   * @param sort The sort item of the data source
   * @returns the sorted array
   */
  sortFunc(items: DataItem[], sort: MatSort): DataItem[] {
    // If the sorting is not active or no direction is given
    // Just give back the items[] with the same order
    if (!sort.active || sort.direction == '') return items;

    //  > 0: sort `a` after `b`                 | [a, b] => [b, a]
    //  < 0: sort `a` before `b`                | [b, a] => [a, b]
    // == 0: keep original order of `a` and `b` | [a, b] => [a, b]
    // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    return items.sort((a, b) => {
      let result: number = 0;

      if (a.hasOwnProperty("isGroup") || b.hasOwnProperty("isGroup")) return 0;

      // When the selected column value is a number just substract the value of `a` from `b`
      if (typeof a.data[sort.active] == "number") result = a.data[sort.active] - b.data[sort.active];
      // If it is a string just order by alphabet
      else result = a.data[sort.active].toString().localeCompare(b.data[sort.active].toString());

      // Multiply by the direction the ordering should be happening and return the value
      return result * (sort.direction == "asc" ? 1 : -1);
    })
  }

  dragging: boolean = false;

  onDragged(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumnOrder, event.previousIndex, event.currentIndex);
  }

  setVisibilityIfEmpty(str: ColumnData | null | undefined): string {
    if (str == null || str == undefined) return "d-none";
    if (str.hasOwnProperty("invisable")) return "d-none";

    // if (typeof str == "string" && str?.trim()?.length == 0) return "d-none"

    return '';
  }

  setVisibilityIfRowspan(rowIndex: number, colIndex: string): string {
    for (let i = rowIndex; i >= 0 && !this.dataSource.data[i].hasOwnProperty("isGroup"); --i) {
      const span = this.dataSource.data[i].data[colIndex].span;

      if (!span) continue;

      if (rowIndex == i) return "rowspan-col"

      if (rowIndex - i > span) continue;

      return 'd-none';
    }

    return '';
  }

  setRowspan(element: DataItem, column: Column<any>): number {
    return element.data[column.columnDef].span ?? 1;
  }

  onResizedColumnSize(index: number, event: number) {
    this.columnOrder[index].width = event;
  }
  
  onResizeClicked(event: boolean) {
    this.dragEnabled = !event;
  }
}

type index = number;

export class Group {
  constructor(name: string, items: ItemData[]) {
    this.name = name;
    this.items = items;
  }

  name: string;
  isExpanded: boolean = true;
  items!: ItemData[];
};

export class GroupItem {
  constructor(groupId: number, name: string, isExpanded: boolean, id: number, numChildren?: number) {
    this.globalGroupItemIndex = groupId;
    this.isExpanded = isExpanded;
    this.name = name;
    this.globalIndex = id;
    this.numChildren = numChildren ?? 0;
  }
  name: string;
  isExpanded: boolean;
  isGroup: boolean = true;
  globalGroupItemIndex: number;
  numChildren: number;
  globalIndex: number;
};

export interface ItemData {
  [key: string]: any,
};

export class DataItemAsIndex {
  constructor(groupId: number, itemId: number) {
    this.groupId = groupId;
    this.itemId = itemId;
  }

  groupId: number;
  itemId: number;

  getItem<T>(data: Group[]): T {
    return data[this.groupId].items[this.itemId] as T;
  }
};

export interface DataItem {
  data: ItemData,
  globalIndex: number,
  groupRefIndex: number,
  isExpanded: boolean,
  globalDataItemIndex: number;
  relativeGroupItemIndex: number;
  selected: boolean;
};

export interface Column<T> {
  columnDef: string,
  header: string,
  width?: number,
  cell: (element: T) => ColumnData
};

export type ColumnData = string | RowSpanColumn | InvisableColumn;

export interface RowSpanColumn {
  value: string,
  span: number,
};

export interface InvisableColumn {
  invisable: boolean
}

export type Columns<T> = Column<T>[];
