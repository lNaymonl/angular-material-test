import {
  Directive,
  OnInit,
  Renderer2,
  Input,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';

// Reference: https://stackblitz.com/edit/angular-table-resize-bc8pff?file=src%2Fapp%2Fresize-column.directive.ts

@Directive({
  selector: '[columnResizing]',
})
export class ResizeColumnDirective implements OnInit {
  @Input({ required: true }) columnResizeIndex!: number;

  // This has to be percent because the grid has no overflow-x
  @Input() initialColumnWidth: number | null = null;

  @Output() resizedColumnSize: EventEmitter<number> = new EventEmitter();
  @Output() resizeClicked: EventEmitter<boolean> = new EventEmitter();

  private startX: number = 0;
  private startWidth: number = 0;
  private width: number = 0;

  private column: HTMLElement;
  private table!: HTMLElement;
  private row!: HTMLElement;

  private pressed: boolean = false;

  constructor(private renderer: Renderer2, private el: ElementRef) {
    const ne = this.el.nativeElement as HTMLElement;
    if (ne.tagName.toLowerCase() != "th") throw new Error(`the resize-column directive is only available for the \"th\" element but was applied on: ${ne.tagName.toLowerCase()}`)
    this.column = this.el.nativeElement;
  }

  // TODO when resizing a column too much the mouse gets disaligned with the column border
  // TODO when 2..n column gets to small, it resizes the column before
  // TODO column element overlaps the resizer element

  // BUG all column are resizing when too many are in a table and one of them is clicked

  ngOnInit() {
    this.row = this.renderer.parentNode(this.column);
    const thead = this.renderer.parentNode(this.row);
    this.table = this.renderer.parentNode(thead);

    const resizer = this.renderer.createElement('div');
    this.renderer.addClass(resizer, 'resize-holder');

    if (!this.column.matches(":last-child")) {
      const resizerWidth = 15;
      const backgroundColor: number | string = 0xd3d3d3;

      this.renderer.setStyle(this.column, "transition", "width 15ms ease-in-out")

      this.setResizerStyle(resizer, resizerWidth, backgroundColor);
    }

    this.renderer.appendChild(this.column, resizer);
    
    this.renderer.listen(resizer, 'mousedown', this.onMouseDown);
    this.renderer.listen(this.table, 'mousemove', this.onMouseMove);
    this.renderer.listen('document', 'mouseup', this.onMouseUp);

    if (this.initialColumnWidth) {
      this.renderer.setStyle(this.column, 'width', `${this.initialColumnWidth}%`);
      this.width = this.initialColumnWidth;
    }
  }

  setResizerStyle(resizer: HTMLElement, width: number, backgroundColor: number | string) {
    this.renderer.setStyle(resizer, "cursor", "col-resize");
      
    this.renderer.setStyle(resizer, "width", `${width}px`);
    this.renderer.setStyle(resizer, "height", "100%");

    this.renderer.setStyle(resizer, "position", "absolute")
    this.renderer.setStyle(resizer, "right", `${-1 * width / 2}px`);
    this.renderer.setStyle(resizer, "top", "0");
    
    this.renderer.setStyle(resizer, "background-color", `${typeof backgroundColor == "number" ? "#" + backgroundColor.toString(16) : backgroundColor}`);
  }

  onMouseDown = (event: MouseEvent) => {
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = this.column.offsetWidth;
    this.resizeClicked.emit(this.pressed);
  };

  // TODO fix resizing
  onMouseMove = (event: MouseEvent) => {
    if (this.pressed && event.buttons) {
      this.renderer.addClass(this.table, 'resizing');

      // Both are doing the same
      const widthInPx = this.startWidth + (event.pageX - this.startX);
      // const widthInPx = event.pageX - this.column.offsetLeft;

      this.width = widthInPx / this.row.offsetWidth * 100;

      this.renderer.setStyle(this.column, 'width', `${this.width}%`);
    }
  };

  onMouseUp = (_event: MouseEvent) => {
    if (this.pressed) {
      this.pressed = false;
      this.renderer.removeClass(this.table, 'resizing');
      this.resizedColumnSize.emit(parseFloat(this.width.toFixed(2)));
      setTimeout(() => this.resizeClicked.emit(this.pressed), 1);
    }
  };
}
