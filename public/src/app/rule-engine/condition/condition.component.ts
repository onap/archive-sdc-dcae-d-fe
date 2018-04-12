import {
  Component,
  ViewEncapsulation,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { TreeModel, TreeComponent, ITreeOptions } from 'angular-tree-component';
import { some } from 'lodash';

@Component({
  selector: 'app-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConditionComponent {
  conditionTree = [];
  showType = false;
  @ViewChild(TreeComponent) private tree: TreeComponent;
  @Output() onConditionChange = new EventEmitter();
  @Output() removeConditionCheck = new EventEmitter();
  customTemplateStringOptions: ITreeOptions = {
    isExpandedField: 'expanded',
    animateExpand: true,
    animateSpeed: 30,
    animateAcceleration: 1.2
  };

  constructor() {
    this.conditionTree.push({
      name: 'operator',
      level: 0,
      type: 'ALL',
      children: []
    });
    this.conditionTree[0].children.push({
      name: 'condition',
      left: '',
      right: '',
      operator: null,
      level: 1
    });
  }

  onInitialized(tree) {
    tree.treeModel.expandAll();
  }

  updateMode(isSingle, data) {
    if (isSingle) {
      this.conditionTree[0].children.pop();
      if (typeof data.right !== 'string') {
        data.right = data.right.join(',');
      }
      this.conditionTree[0].children.push({
        name: 'condition',
        left: data.left,
        right: data.right,
        operator: data.operator,
        level: 1
      });
      this.showType = false;
    } else {
      this.conditionTree = data;
      setTimeout(() => (this.showType = true), 500);
    }
    this.tree.treeModel.update();
  }

  addConditional(tree, selectedNode) {
    if (this.conditionTree[0].children.length > 0) {
      this.showType = true;
    }
    const tempLevel =
      selectedNode.data.name === 'condition'
        ? selectedNode.data.level
        : selectedNode.data.children[0].level;

    const conditionTemplate = {
      name: 'condition',
      left: '',
      right: '',
      operator: null,
      level: tempLevel
    };
    selectedNode.data.children.push(conditionTemplate);
    tree.treeModel.update();
  }

  addConditionalGroup(tree, selectedNode) {
    if (selectedNode.level < 3) {
      if (this.conditionTree[0].children.length > 0) {
        this.showType = true;
      }
      selectedNode.data.children.push({
        name: 'operator',
        level: selectedNode.data.level + 1,
        type: 'ALL',
        children: []
      });

      for (let i = 0; i < 2; i++) {
        selectedNode.data.children[
          selectedNode.data.children.length - 1
        ].children.push({
          name: 'condition',
          left: '',
          right: '',
          operator: null,
          level: selectedNode.data.level + 2
        });
      }
      tree.treeModel.update();
      tree.treeModel.expandAll();
    }
  }

  removeConditional(tree, selectedNode) {
    if (
      (selectedNode.level === 1 && selectedNode.index === 0) ||
      (selectedNode.parent.data.name === 'operator' &&
        selectedNode.parent.level === 1 &&
        selectedNode.parent.data.children.length === 1)
    ) {
      this.removeConditionCheck.emit(false);
    } else if (
      selectedNode.parent.level === 1 &&
      selectedNode.parent.data.children.length === 2 &&
      selectedNode.data.name === 'condition' &&
      some(selectedNode.parent.data.children, { name: 'operator' })
    ) {
      return;
    } else {
      if (
        selectedNode.parent.data.name === 'operator' &&
        selectedNode.parent.level > 1
      ) {
        // Nested Group can delete when more then 2
        if (selectedNode.parent.data.children.length > 2) {
          this.deleteNodeAndUpdateTreeView(selectedNode, tree);
        }
      } else {
        this.deleteNodeAndUpdateTreeView(selectedNode, tree);
        if (this.conditionTree[0].children.length === 1) {
          this.showType = false;
        }
      }
    }
  }

  private deleteNodeAndUpdateTreeView(selectedNode: any, tree: any) {
    selectedNode.parent.data.children.splice(selectedNode.index, 1);
    tree.treeModel.update();
    this.onConditionChange.emit(this.conditionTree);
  }

  modelChange(event) {
    this.onConditionChange.emit(this.conditionTree);
  }
}
