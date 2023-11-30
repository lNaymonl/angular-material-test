import { Component } from '@angular/core';
import { Columns } from '../nh-mat-grouped-table/nh-mat-grouped-table.component';

@Component({
  selector: 'app-resizeable-table',
  templateUrl: './resizeable-table.component.html',
  styleUrls: ['./resizeable-table.component.scss']
})
export class ResizeableTableComponent {
  // @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  // columnOrder: { header: string, width?: number }[] = [
  //   { header: 'Position', width: 10 },
  //   { header: 'Name',     width: 40 },
  //   { header: 'Weight',   width: 25 },
  //   { header: 'Symbol',   width: 25 },
  // ];

  columnOrder: Columns<PeriodicElement> = [
    {
      columnDef: "position",
      header: "Position",
      cell: (element) => `${element.position}`
    },
    {
      columnDef: "name",
      header: "Name",
      cell: (element) => `${element.name}`
    },
    {
      columnDef: "weight",
      header: "Weight",
      cell: (element) => `${element.weight}`
    },
    {
      columnDef: "symbol",
      header: "Symbol",
      cell: (element) => `${element.symbol}`
    },
  ];

  displayedColumns: string[] = this.columnOrder.map((val) => val.columnDef);
  dataSource = ELEMENT_DATA;

  printWidths(): void {
    // console.log(this.columnOrder.map((val, i) => {return { width: val.width, index: i }}))
    for (let i = 0; i < this.columnOrder.length; ++i)
      console.log(`#${i}`, this.columnOrder[i].width);

    console.log("-----------------------------------------------------");
  }

  print(event: any) {
    console.log(event);
  }

  ngOnInit() {
    console.log({ displayedColumns: this.displayedColumns, columnOrder: this.columnOrder })
  }
};

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
};

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
