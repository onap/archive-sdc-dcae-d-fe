import {
  Component,
  Inject,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ViewChild,
  Input
} from '@angular/core';
import { RuleEngineApiService } from '../api/rule-engine-api.service';
import { Subject } from 'rxjs/Subject';
import { v1 as uuid } from 'uuid';
import { environment } from '../../../environments/environment';
import { ActionComponent } from '../action/action.component';
import { cloneDeep } from 'lodash';
import { Store } from '../../store/store';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.scss']
})
export class ActionListComponent implements AfterViewInit {
  error: Array<string>;
  condition: any;
  eventType: string;
  version: string;
  params;
  selectedAction;
  targetSource;
  description = '';
  actions = new Array();
  ifStatement = false;
  uid = '';
  backupActionForCancel = new Array();
  @ViewChild('actionListFrm') actionListFrm: NgForm;
  @ViewChild('condition') conditionRef;
  @ViewChildren('actions') actionsRef: QueryList<ActionComponent>;

  constructor(private _ruleApi: RuleEngineApiService, public store: Store) {
    this._ruleApi.editorData.subscribe(data => {
      this.params = data.params;
      console.log('update.. params', data.params);
      this.targetSource = data.targetSource;
      this.version = data.version;
      this.eventType = data.eventType;
      if (data.item) {
        // edit mode set values to attributes
        console.log('actions %o', data.item.actions);
        this.actions = this.convertActionDataFromServer(data.item.actions);
        this.backupActionForCancel = cloneDeep(this.actions);
        this.condition = data.item.condition;
        this.uid = data.item.uid;
        this.description = data.item.description;
        this.ifStatement = this.condition == null ? false : true;
      } else {
        this.actions = new Array();
        this.backupActionForCancel = new Array();
        this.condition = null;
        this.uid = '';
        this.description = '';
        this.ifStatement = false;
      }
      this.selectedAction = null;
    });
  }

  convertActionDataFromServer(actions) {
    return actions.map(item => {
      if (!item.hasOwnProperty('nodes')) {
        return Object.assign({}, item, { nodes: this.targetSource });
      }
    });
  }

  ngAfterViewInit() {
    // console.log(this.actionsRef.toArray());
    if (this.condition) {
      if (this.condition.name === 'condition') {
        this.conditionRef.updateMode(true, this.condition);
      } else {
        const convertedCondition = this.convertConditionFromServer(
          this.condition
        );
        this.conditionRef.updateMode(false, convertedCondition);
      }
    }
  }

  addAction2list(selectedAction) {
    if (selectedAction !== null) {
      this.actions.push({
        id: uuid(),
        nodes: this.targetSource,
        from: {
          value: '',
          regex: '',
          state: 'closed',
          values: [{ value: '' }, { value: '' }]
        },
        actionType: this.selectedAction,
        target: '',
        map: {
          values: [{ key: '', value: '' }],
          haveDefault: false,
          default: ''
        },
        dateFormatter: {
          fromFormat: '',
          toFormat: '',
          fromTimezone: '',
          toTimezone: ''
        }
      });
    }
  }

  removeConditionCheck(flag) {
    this.ifStatement = flag;
  }

  removeAction(action) {
    this.actions = this.actions.filter(item => {
      return item.id !== action.id;
    });
  }

  updateCondition(data) {
    this.condition = data;
  }

  changeRightToArrayOrString(data, toArray) {
    data.forEach(element => {
      if (element.name === 'operator') {
        this.changeRightToArrayOrString(element.children, toArray);
      }
      if (element.name === 'condition') {
        if (toArray) {
          element.right = element.right.split(',');
        } else {
          element.right = element.right.join(',');
        }
      }
    });
    console.log(data);
    return data;
  }

  prepareDataToSaveRule() {
    // action array
    console.log(this.actions);
    const actionSetData = this.actions.map(item => {
      return {
        id: item.id,
        actionType: item.actionType,
        from: item.from,
        target:
          typeof item.selectedNode === 'string'
            ? item.selectedNode
            : typeof item.selectedNode === 'undefined'
              ? item.target
              : item.selectedNode.id,
        map: item.map,
        dateFormatter: item.dateFormatter
      };
    });
    let conditionData2server = null;
    if (this.ifStatement) {
      if (this.conditionRef.conditionTree) {
        // change condition right to array
        conditionData2server = this.convertConditionToServer(
          this.conditionRef.conditionTree
        );
      }
    }
    // data structure
    return {
      version: this.version,
      eventType: this.eventType,
      uid: this.uid,
      description: this.description,
      actions: actionSetData,
      condition: this.ifStatement ? conditionData2server : null
    };
  }

  errorHandler(error) {
    this.store.loader = false;
    console.log(error);
    this.error = [];
    if (typeof error === 'string') {
      this.error.push(error);
    } else {
      console.log(error.notes);
      const errorFromServer = Object.values(error)[0] as any;
      if (Object.keys(error)[0] === 'serviceExceptions') {
        this.error = errorFromServer.map(x => x.formattedErrorMessage);
      } else {
        this.error.push(errorFromServer.formattedErrorMessage);
      }
    }
  }

  saveAndDone() {
    const data = this.prepareDataToSaveRule();
    this.store.loader = true;
    this._ruleApi.modifyRule(data).subscribe(
      response => {
        this.store.loader = false;
        this.store.updateRuleInList(response);
        this._ruleApi.callUpdateVersionLock();
        this.store.isLeftVisible = true;
      },
      error => {
        this.errorHandler(error);
      },
      () => {
        this.store.loader = false;
      }
    );
  }

  saveRole() {
    const actionComp = this.actionsRef.toArray();
    const filterInvalidActions = actionComp.filter(comp => {
      return (
        comp.fromInstance.fromFrm.invalid ||
        comp.targetInstance.targetFrm.invalid ||
        comp.actionFrm.invalid
      );
    });
    if (this.actionListFrm.valid && filterInvalidActions.length === 0) {
      const data = this.prepareDataToSaveRule();
      this.store.loader = true;
      this._ruleApi.modifyRule(data).subscribe(
        response => {
          this.store.loader = false;
          this.store.updateRuleInList(response);
          this._ruleApi.callUpdateVersionLock();
          this.uid = response.uid;
          // add toast notification
        },
        error => {
          this.errorHandler(error);
        },
        () => {
          this.store.loader = false;
        }
      );
    } else {
      // scroll to first invalid element
      const elId = filterInvalidActions[0].action.id;
      const el = document.getElementById(elId as string);
      const label = el.children.item(0) as HTMLElement;
      el.scrollIntoView();
    }
  }

  public convertConditionFromServer(condition) {
    const temp = new Array();
    temp.push(condition);
    const cloneCondition = cloneDeep(temp);
    const conditionSetData = this.changeRightToArrayOrString(
      cloneCondition,
      false
    );
    console.log('condition to server:', conditionSetData);
    return conditionSetData;
  }

  public convertConditionToServer(tree) {
    const cloneCondition = cloneDeep(tree);
    const conditionSetData = this.changeRightToArrayOrString(
      cloneCondition,
      true
    );
    let simpleCondition = null;
    if (conditionSetData[0].children.length === 1) {
      simpleCondition = conditionSetData[0].children;
    }
    console.log('condition to server:', conditionSetData);
    return simpleCondition !== null ? simpleCondition[0] : conditionSetData[0];
  }

  closeDialog(): void {
    this.actions = this.backupActionForCancel;
    this.store.isLeftVisible = true;
  }
}
