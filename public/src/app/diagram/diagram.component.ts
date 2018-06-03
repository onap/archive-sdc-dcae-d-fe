import {
  Component,
  Input,
  OnChanges,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements OnChanges, AfterViewInit {
  @Input() list;
  maxWidth = 550;
  maxLengthLeft;
  maxLengthRight;
  @ViewChild('svgContainer') svgContainer: ElementRef;

  ngAfterViewInit() {
    console.log(
      'svg width:',
      this.svgContainer.nativeElement.getBoundingClientRect().width
    );
    this.maxWidth = this.svgContainer.nativeElement.getBoundingClientRect().width;
  }

  constructor() {}

  ngOnChanges() {
    if (this.list) {
      const name1MaxLength = this.list.reduce(
        (r, s) => (r > s.name1.length ? r : s.name1.length),
        0
      );
      const p1MaxLength = this.list.reduce(
        (r, s) => (r > s.p1.length ? r : s.p1.length),
        0
      );
      this.maxLengthLeft = Math.max(name1MaxLength, p1MaxLength);

      const name2MaxLength = this.list.reduce(
        (r, s) => (r > s.name2.length ? r : s.name2.length),
        0
      );
      const p2MaxLength = this.list.reduce(
        (r, s) => (r > s.p2.length ? r : s.p2.length),
        0
      );
      this.maxLengthRight = Math.max(name2MaxLength, p2MaxLength);
    }
  }
}
