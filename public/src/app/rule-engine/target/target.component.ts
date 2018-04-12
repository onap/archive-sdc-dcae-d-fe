import {
  Component,
  ViewEncapsulation,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { TreeModel, TreeComponent, ITreeOptions } from 'angular-tree-component';
import {
  trigger,
  state,
  animate,
  transition,
  style
} from '@angular/animations';
import { fuzzysearch, getBranchRequierds, validation } from './target.util';
import { environment } from '../../../environments/environment';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('toggleDropdown', [
      transition('void => *', [
        style({ opacity: 0, offset: 0, height: 0 }),
        animate('300ms cubic-bezier(0.17, 0.04, 0.03, 0.94)')
      ]),
      transition('* => void', [
        style({ opacity: 1, offset: 1, height: 'auto' }),
        animate('100ms cubic-bezier(0.17, 0.04, 0.03, 0.94)')
      ])
    ])
  ]
})
export class TargetComponent {
  imgBase = environment.imagePath;
  showOption = false;
  selectedNode = { name: '', id: '' };
  @Input() nodes;
  @Output() onTargetChange = new EventEmitter();
  @ViewChild(TreeComponent) private tree: TreeComponent;
  @ViewChild('targetFrm') targetFrm: NgForm;
  options: ITreeOptions = {
    animateExpand: true,
    animateSpeed: 30,
    animateAcceleration: 1.2
  };

  filterFn(value, treeModel: TreeModel) {
    treeModel.filterNodes(node => fuzzysearch(value, node.data.name));
  }

  inputChange() {
    this.onTargetChange.emit(this.selectedNode.id);
  }

  updateMode(action) {
    this.selectedNode = {
      id: action.target,
      name: ''
    };
  }

  onEvent(event) {
    if (event.eventName === 'activate') {
      if (event.node.data.children === null) {
        this.selectedNode = event.node.data;
        this.onTargetChange.emit(this.selectedNode);
        this.showOption = false;
      }
    }
  }
}
