import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild
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

@Component({
  selector: 'app-from',
  templateUrl: './from.component.html',
  styleUrls: ['./from.component.scss'],
  animations: [
    trigger('state', [
      state(
        'open',
        style({
          opacity: 1,
          height: 'auto'
        })
      ),
      transition('* => open', [
        animate(
          200,
          keyframes([
            style({
              opacity: 1,
              height: 'auto'
            })
          ])
        )
      ]),
      state(
        'closed',
        style({
          opacity: 0,
          height: 0
        })
      )
    ])
  ]
})
export class FromComponent {
  from: any = {
    value: '',
    regex: '',
    state: 'closed',
    values: [{ value: '' }, { value: '' }]
  };
  @Input() actionType;
  @Output() onFromChange = new EventEmitter();
  @ViewChild('fromFrm') fromFrm: NgForm;
  hoveredIndex;
  // public keyUp = new BehaviorSubject<string>(null);

  showRegex(item) {
    item.state = item.state === 'closed' ? 'open' : 'closed';
    if (item.state === 'closed') {
      item.regex = '';
    }
  }
  updateMode(fromData) {
    console.log(fromData);
    if (fromData) {
      this.from = fromData;
    }
  }

  constructor() {}

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
