import { Directive, OnInit, Renderer2, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[resizeColumn]',
})
export class ResizeColumnCopyPipe implements OnInit {
  @Input({ required: true }) resizeColumn!: boolean;

  @Input() index: number = 0;

  private startX: number = 0;

  private startWidth: number = 0;

  private column: HTMLElement;

  private table!: HTMLElement;

  private pressed: boolean = false;

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.column = this.el.nativeElement;

    console.log(this.column)
  }

  ngOnInit() {
    if (this.resizeColumn) {
      const row = this.renderer.parentNode(this.column);
      const thead = this.renderer.parentNode(row);
      this.table = this.renderer.parentNode(thead);

      const resizer = this.renderer.createElement('span');

      const backgroundColor: number | string = 0xd3d3d3;

      this.renderer.setStyle(resizer, "cursor", "col-resize");
      this.renderer.setStyle(resizer, "width", "20px");
      this.renderer.setStyle(resizer, "height", "100%");
      this.renderer.setStyle(resizer, "position", "absolute");
      this.renderer.setStyle(resizer, "right", "-10px");
      this.renderer.setStyle(resizer, "top", "0");
      this.renderer.setStyle(resizer, "z-index", "10001");

      this.renderer.setStyle(resizer, "background-color", `${typeof backgroundColor == "number" ? "#" + backgroundColor.toString(16) : backgroundColor}`);

      this.renderer.addClass(resizer, 'resize-holder');
      this.renderer.appendChild(this.column, resizer);
      this.renderer.listen(resizer, 'mousedown', this.onMouseDown);
      this.renderer.listen(this.table, 'mousemove', this.onMouseMove);
      this.renderer.listen('document', 'mouseup', this.onMouseUp);
    }
  }

  onMouseDown = (event: MouseEvent) => {
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = this.column.offsetWidth;
  };

  onMouseMove = (event: MouseEvent) => {
    const offset = 35;
    if (this.pressed && event.buttons) {
      this.renderer.addClass(this.table, 'resizing');

      // Calculate width of column
      let width = this.startWidth + (event.pageX - this.startX);

      // const tableCells = Array.from(
      //   this.table.querySelectorAll('.mat-row')
      // ).map((row: any) => row.querySelectorAll('.mat-cell').item(this.index));

      // Set table header width
      this.renderer.setStyle(this.column, 'width', `${width}px`);

      // Set table cells width
      // for (const cell of tableCells) {
      //   this.renderer.setStyle(cell, 'width', `${width}px`);
      // }
    }
  };

  onMouseUp = (event: MouseEvent) => {
    if (this.pressed) {
      this.pressed = false;
      this.renderer.removeClass(this.table, 'resizing');
    }
  };
}
