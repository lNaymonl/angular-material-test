import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeComponent } from './home/home.component';
import { NhMatTableComponent } from './nh-mat-table/nh-mat-table.component';
import { NhMatGroupedTable } from './nh-mat-grouped-table/nh-mat-grouped-table.component';

import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from "@angular/material/divider"
import { DragDropModule } from "@angular/cdk/drag-drop"
import { FormsModule } from '@angular/forms';
import { RxjsTestComponent } from './rxjs-test/rxjs-test.component';
import { RowSpanTableComponent } from './row-span-table/row-span-table.component';
import { ResizeableTableComponent } from './resizeable-table/resizeable-table.component';
import { ResizeColumnDirective } from './resize-column.directive';
import { ResizeColumnCopyPipe } from './resize-column-copy.pipe';

const components = [
  HomeComponent,
  NhMatTableComponent,
  NhMatGroupedTable,
  RxjsTestComponent,
  RowSpanTableComponent,
  ResizeableTableComponent,
]

const materialModules = [
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatIconModule,
  MatRippleModule,
  MatDividerModule,

  DragDropModule
];

@NgModule({
  declarations: [
    AppComponent,
    ...components,
    ResizeColumnDirective,
    ResizeColumnCopyPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ...materialModules
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
