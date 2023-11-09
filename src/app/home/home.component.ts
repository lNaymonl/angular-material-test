import { Component, Input, ViewChild } from '@angular/core';
import { Column } from '../grouped-mat-table/grouped-mat-table.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  data = ELEMENT_DATA;
  columnOrder: Column<PeriodicElement>[] = [
    {
      columnDef: 'position',
      header: 'Position',
      cell: (element) => `${element.position}`,
    },
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element) => `${element.name}`,
    },
    {
      columnDef: 'weight',
      header: 'Weight',
      cell: (element) => `${element.weight}`,
    },
    {
      columnDef: 'symbol',
      header: 'Symbol',
      cell: (element) => `${element.symbol}`,
    },
  ];

  ngOnInit() {
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export class Group<T> {
  constructor(name: string, items: T[]) {
    this.name = name;
    this.items = items;
  }

  name: string;
  isExpanded: boolean = true;
  items!: T[]
};

const ELEMENT_DATA: Group<PeriodicElement>[] = [
  new Group(
    "Group 1", [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  ]),
  new Group(
    "Group 2", [
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  ]),
  new Group(
    "Group 3", [
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ]),
];