import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-row-span-table',
  templateUrl: './row-span-table.component.html',
  styleUrls: ['./row-span-table.component.scss']
})
export class RowSpanTableComponent {
  dataSource: MatTableDataSource<col> = new MatTableDataSource<col>([
    {
      col1: "a",
      col2: "b",
      col3: "c"
    },
    {
      col1: "d",
      col2: "e",
      col3: {
        value: "f",
        rowspan: 2
      }
    },
    {
      col1: "g",
      col2: "h",
      col3: ""
      // col3: null
    },
  ]);
  displayedColumnOrder = ["col1", "col2", "col3"];

  firstToUpper(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  isNull(str: string | null | undefined): string {
    if (str == null || str == undefined) return "d-none";

    if (typeof str == "string" && str?.trim()?.length == 0) return "d-none"

    return '';
  }
}

interface col {
  [key: string]: string | rowspan_col | null;
}

interface rowspan_col {
  value: string;
  rowspan: number;
}