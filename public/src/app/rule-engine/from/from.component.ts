import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
// import { From } from "../model";
import { Subject } from 'rxjs/Subject';
import {
  trigger,
  state,
  animate,
  transition,
  style,
  keyframes
} from '@angular/animations';
import { NgForm } from '@angular/forms';
import { Store } from '../../store/store';

@Component({
  selector: 'app-from',
  templateUrl: './from.component.html',
  styleUrls: ['./from.component.scss'],
  animations: [
    trigger('state', [
      state('open', style({ opacity: 1, height: 'auto' })),
      transition('* => open', [
        animate(200, keyframes([style({ opacity: 1, height: 'auto' })]))
      ]),
      state('closed', style({ opacity: 0, height: 0 }))
    ])
  ]
})
export class FromComponent implements AfterViewInit {
  from: any = {
    value: '',
    regex: '',
    state: 'closed',
    values: [
      {
        value: ''
      },
      {
        value: ''
      }
    ]
  };
  @Input() actionType;
  @Output() onFromChange = new EventEmitter();
  @ViewChild('fromFrm') fromFrm: NgForm;
  hoveredIndex;
  // public keyUp = new BehaviorSubject<string>(null);

  constructor(private changeDetector: ChangeDetectorRef, public store: Store) {}

  ngAfterViewInit(): void {
    if (
      (this.actionType === 'clear' || this.actionType === 'clear nsf') &&
      this.from.values[0].value === ''
    ) {
      this.from.values = [
        {
          value: ''
        }
      ];
    }
    this.changeDetector.detectChanges();
  }

  showRegex(item) {
    item.state = item.state === 'closed' ? 'open' : 'closed';
    if (item.state === 'closed') {
      item.regex = '';
    }
  }
  updateMode(fromData) {
    console.log(fromData);
    if (fromData) {
      if (
        (this.actionType === 'clear' || this.actionType === 'clear nsf') &&
        fromData.values[0].value === ''
      ) {
        this.from.values = [
          {
            value: ''
          }
        ];
      } else {
        this.from = fromData;
      }
    }
    this.changeDetector.detectChanges();
  }

  modelChange(event) {
    this.onFromChange.emit(event);
  }
  addFromInput() {
    this.from.values.push({ value: '' });
  }
  removeFromInput(index) {
    this.from.values.splice(index, 1);
  }
}
