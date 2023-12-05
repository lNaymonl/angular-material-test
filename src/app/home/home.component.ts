import { Component } from '@angular/core';
import {
  Column,
  Group,
} from '../nh-mat-grouped-table/nh-mat-grouped-table.component';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { oBenutzer } from '../benutzer.environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  data = ELEMENT_DATA;
  nd = EL_DATA;

  private _einstellungName: string = "EINRICHTUNGSGRUPPEN - FACHKRAFTSCHUESSEL";

  private _columnOrder: Column<PeriodicElement>[] = [
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
      cell: (element) => element.symbol ?? '',
    },
    {
      columnDef: 'a1',
      header: 'Position',
      cell: (element) => `${element.position}`,
    },
    {
      columnDef: 'a2',
      header: 'Name',
      cell: (element) => `${element.name}`,
    },
    {
      columnDef: 'a3',
      header: 'Weight',
      cell: (element) => `${element.weight}`,
    },
    {
      columnDef: 'a4',
      header: 'Symbol',
      cell: (element) => element.symbol ?? '',
    },
  ];
  get columnOrder() {
    return this._columnOrder;
  }
  set columnOrder(value: Column<PeriodicElement>[]) {
    this._columnOrder = value;
    this.writeUserSettings();
  }

  private _colOrder: Column<PeriodicElement>[] = [
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
      cell: (element) => element.symbol ?? '',
    },
  ];
  get colOrder() {
    return this._colOrder;
  }
  set colOrder(value: Column<PeriodicElement>[]) {
    this._colOrder = value;
    this.writeUserSettings();
  }

  // TODO implement real saving of the user settings

  ngOnInit() {
    this.readUserSettings().then((settings) => {
      if (!settings) this.writeUserSettings();
    });
  }

  constructor(private benutzer: oBenutzer) {}
  
  async readUserSettings(): Promise<boolean> {
    const settingsAsJson = await this.benutzer.Einstellunglesen(this._einstellungName);
    if (!settingsAsJson) return false;

    let settings: Settings | null = null;

    try {
      settings = JSON.parse(settingsAsJson);
    } catch {
      return false;
    }

    if (!settings) return false;

    for (let i = 0; i < settings.uebersichtFachkraftschuessel.length; ++i) {
      const colSetting: ColumnSetting = settings.uebersichtFachkraftschuessel[i];

      const columnOrderIndex =
        this.columnOrder
        .findIndex(col => col.columnDef == colSetting.col);

      if (columnOrderIndex == -1) throw new Error("Columns don't match!");

      this.columnOrder[columnOrderIndex].width = colSetting.width;

      moveItemInArray(this.columnOrder, columnOrderIndex, colSetting.pos);
    }

    for (let i = 0; i < settings.zugeordneteMitarbeiter.length; ++i) {
      const colSetting: ColumnSetting = settings.zugeordneteMitarbeiter[i];

      const columnOrderIndex =
        this.colOrder
        .findIndex(col => col.columnDef == colSetting.col);

      if (columnOrderIndex == -1) throw new Error("Columns don't match!");

      this.colOrder[columnOrderIndex].width = colSetting.width;

      moveItemInArray(this.columnOrder, columnOrderIndex, colSetting.pos);
    }

    return true;
  }

  writeUserSettings() {
    const settings: Settings = {
      uebersichtFachkraftschuessel: [],
      zugeordneteMitarbeiter: [],
    };

    for (let i = 0; i < this.columnOrder.length; ++i) {
      const col = this.columnOrder[i];
      settings.uebersichtFachkraftschuessel[i] = {
        col: col.columnDef,
        width: col.width,
        pos: i
      };
    }

    for (let i = 0; i < this.colOrder.length; ++i) {
      const col = this.colOrder[i];
      settings.zugeordneteMitarbeiter[i] = {
        col: col.columnDef,
        width: col.width,
        pos: i
      };
    }

    // this.db = JSON.stringify(settings)
    const settingsAsJson = JSON.stringify(settings)
    // return this.write(settingsAsJson);
    return this.benutzer.Einstellungspeichern(this._einstellungName, settingsAsJson);
  }
}

type ColumnSetting = { col: string; width?: number; pos: number };

export interface Settings {
  // stichtag: Date,
  // stichtagActive: boolean,
  uebersichtFachkraftschuessel: ColumnSetting[];
  zugeordneteMitarbeiter: ColumnSetting[];
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const EL_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 12, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 13, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 14, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 15, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 16, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 17, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 18, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 19, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 20, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 21, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 22, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 23, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 24, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 25, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 26, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 27, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 28, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 29, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 30, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
]

// , symbol: 'Be'
const ELEMENT_DATA: Group[] = [
  new Group('Group 1', [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    {
      position: 3,
      name: 'Lithium',
      weight: 6.941,
      symbol: { value: 'Li', span: 2 },
    },
    { position: 4, name: '', weight: 9.0122 },
  ]),
  new Group('Group 2', [
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  ]),
  new Group('Group 3', [
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  ]),
];
