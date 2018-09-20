import {
  AfterViewInit,
  Component,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { cloneDeep, isEmpty } from 'lodash';
import { v1 as uuid } from 'uuid';
import { Store } from '../../store/store';
import { ActionComponent } from '../action/action.component';
import { RuleEngineApiService } from '../api/rule-engine-api.service';
import { toJS } from 'mobx';

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.scss']
})
export class ActionListComponent implements AfterViewInit {
  title = '';
  error: Array<string>;
  condition: any;
  eventType: string;
  version: string;
  entryPhase: string;
  publishPhase: string;
  groupId: string;
  phase: string;
  params;
  selectedAction;
  targetSource;
  description = '';
  actions = new Array();
  ifStatement = false;
  uid = '';
  isEnrich = false;
  hoveredIndex = -1;
  backupActionForCancel = new Array();
  @ViewChild('actionListFrm') actionListFrm: NgForm;
  @ViewChild('conditions') conditionRef;
  @ViewChildren('actions') actionsRef: QueryList<ActionComponent>;

  constructor(private _ruleApi: RuleEngineApiService, public store: Store) {
    this.error = null;
    this._ruleApi.editorData.subscribe(data => {
      this.params = data.params;
      console.log('update.. params', data.params);
      this.targetSource = data.targetSource;
      this.version = data.version;
      this.groupId = data.groupId;
      this.isEnrich =
        !isEmpty(data.groupId) &&
        data.groupId.substring(0, 1).toLowerCase() === 'e'
          ? true
          : false;
      this.entryPhase = data.entryPhase;
      this.publishPhase = data.publishPhase;
      this.phase = data.phase;
      this.eventType = data.eventType;
      if (data.item) {
        // edit mode set values to attributes
        console.log('actions %o', data.item.actions);
        this.actions = this.convertActionDataFromServer(data.item.actions);
        this.backupActionForCancel = cloneDeep(this.actions);
        this.condition = data.item.condition;
        this.uid = data.item.uid;
        this.description = data.item.description;
        this.title = this.description + ' - Rule Editor';
        this.ifStatement = this.condition == null ? false : true;
      } else {
        this.title = 'New Rule Editor';
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
    return actions
      .map(item => {
        if (!item.hasOwnProperty('nodes')) {
          return Object.assign({}, item, { nodes: this.targetSource });
        }
      })
      .map(item => {
        if (item.hasOwnProperty('search')) {
          console.log(toJS(item.search.enrich.fields));
          console.log(toJS(item.search.updates));

          return Object.assign({}, item, {
            search: {
              enrich: {
                fields: toJS(item.search.enrich.fields),
                prefix: item.search.enrich.prefix
              },
              radio: item.search.radio,
              searchField: item.search.searchField,
              searchFilter: {
                left: item.search.searchFilter.left,
                operator: item.search.searchFilter.operator,
                right: toJS(item.search.searchFilter.right)
              },
              searchValue: item.search.searchValue,
              updates: toJS(item.search.updates)
            }
          });
        } else {
          return item;
        }
      });
  }

  ngAfterViewInit() {
    // console.log(this.actionsRef.toArray()); if (this.condition) {   if
    // (this.condition.name === 'condition') {     this       .conditionRef
    // .updateMode(true, this.condition);   } else {     const convertedCondition =
    // this.convertConditionFromServer(this.condition);     this .conditionRef
    // .updateMode(false, convertedCondition);   } }
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
          values: [
            {
              value: ''
            },
            {
              value: ''
            }
          ]
        },
        actionType: this.selectedAction,
        target: '',
        map: {
          values: [
            {
              key: '',
              value: ''
            }
          ],
          haveDefault: false,
          default: ''
        },
        dateFormatter: {
          fromFormat: '',
          toFormat: '',
          fromTimezone: '',
          toTimezone: ''
        },
        replaceText: {
          find: '',
          replace: ''
        },
        logText: {
          name: '',
          level: '',
          text: ''
        },
        logEvent: {
          title: ''
        },
        selectedHpMetric: '',
        stringTransform: {
          startValue: '',
          targetCase: '',
          isTrimString: false
        },
        search: {
          searchField: '',
          searchValue: '',
          searchFilter: {
            left: '',
            right: '',
            operator: null
          },
          radio: 'updates',
          enrich: {
            fields: [
              {
                value: ''
              }
            ],
            prefix: ''
          },
          updates: [
            {
              key: '',
              value: ''
            }
          ]
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

  copyAction(action, index) {
    const tmpAction = cloneDeep(action);
    tmpAction.id = uuid();
    tmpAction.target =
      typeof tmpAction.selectedNode === 'string'
        ? tmpAction.selectedNode
        : typeof tmpAction.selectedNode === 'undefined'
          ? tmpAction.target
          : tmpAction.selectedNode.id;
    // this   .actions   .splice(index, 0, tmpAction);
    this.actions.push(tmpAction);
    console.log(this.actions);
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
        entryPhase: item.entryPhase,
        publishPhase: item.publishPhase,
        groupId: item.groupId,
        phase: item.phase,
        actionType: item.actionType,
        from: item.from,
        target:
          typeof item.selectedNode === 'string'
            ? item.selectedNode
            : typeof item.selectedNode === 'undefined'
              ? item.target
              : item.selectedNode.id,
        map: item.map,
        dateFormatter: item.dateFormatter,
        replaceText: item.replaceText,
        logText: item.logText,
        logEvent: item.logEvent,
        selectedHpMetric: item.selectedHpMetric,
        stringTransform: {
          startValue:
            item.stringTransform !== undefined
              ? item.stringTransform.startValue
              : '',
          targetCase:
            item.stringTransform !== undefined
              ? item.stringTransform.targetCase
              : '',
          isTrimString:
            item.stringTransform !== undefined
              ? item.stringTransform.isTrimString
              : false
        },
        search: {
          searchField: item.search !== undefined ? item.search.searchField : '',
          searchValue: item.search !== undefined ? item.search.searchValue : '',
          searchFilter: {
            left:
              item.search !== undefined ? item.search.searchFilter.left : '',
            right:
              item.search !== undefined
                ? typeof item.search.searchFilter.right === 'string'
                  ? item.search.searchFilter.right.split(',')
                  : item.search.searchFilter.right
                : [],
            operator:
              item.search !== undefined
                ? item.search.searchFilter.operator
                : null
          },
          radio: item.search !== undefined ? item.search.radio : 'updates',
          enrich: {
            fields:
              item.search !== undefined
                ? item.search.radio === 'enrich'
                  ? item.search.enrich.fields
                  : [
                      {
                        value: ''
                      }
                    ]
                : '',
            prefix:
              item.search !== undefined
                ? item.search.radio === 'enrich'
                  ? item.search.enrich.prefix
                  : ''
                : ''
          },
          updates:
            item.search !== undefined
              ? item.search.radio === 'updates'
                ? item.search.updates
                : [
                    {
                      key: '',
                      value: ''
                    }
                  ]
              : []
        }
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
      notifyId: this.store.notifyIdValue,
      uid: this.uid,
      description: this.description,
      actions: actionSetData,
      condition: this.ifStatement ? conditionData2server : null,
      entryPhase: this.entryPhase,
      publishPhase: this.publishPhase,
      groupId: this.groupId,
      phase: this.phase
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
    this.error = null;
    const actionComp = this.actionsRef.toArray();
    const filterInvalidActions = actionComp.filter(comp => {
      return comp.actionFrm && comp.actionFrm.invalid;
    });
    if (this.actionListFrm.valid && filterInvalidActions.length === 0) {
      const data = this.prepareDataToSaveRule();
      this.store.loader = true;

      this._ruleApi
        .getLatestMcUuid({
          contextType: this.store.sdcParmas.contextType,
          serviceUuid: this.store.sdcParmas.uuid,
          vfiName: this.store.vfiName,
          vfcmtUuid: this.store.mcUuid
        })
        .subscribe(
          res => {
            this.store.mcUuid = res.uuid;
            this._ruleApi.modifyRule(data, res.uuid).subscribe(
              response => {
                // clear temp copy rule.
                this.clearCopyRuleFromList();
                // then update the rule list and sync with server
                this.store.updateRuleInList(response);
                this._ruleApi.callUpdateVersionLock();
                this.store.loader = false;
                this.store.isLeftVisible = true;
              },
              error => {
                this.errorHandler(error);
              },
              () => {}
            );
          },
          error => this.errorHandler(error),
          () => {}
        );
    }
  }

  private clearCopyRuleFromList() {
    this.store.ruleList = this.store.ruleList.filter(item => item.uid !== '');
  }

  saveRole() {
    this.error = null;
    const actionComp = this.actionsRef.toArray();
    const filterInvalidActions = actionComp.filter(comp => {
      return comp.actionFrm && comp.actionFrm.invalid;
    });
    if (this.actionListFrm.valid && filterInvalidActions.length === 0) {
      const data = this.prepareDataToSaveRule();
      this.store.loader = true;
      this._ruleApi
        .getLatestMcUuid({
          contextType: this.store.sdcParmas.contextType,
          serviceUuid: this.store.sdcParmas.uuid,
          vfiName: this.store.vfiName,
          vfcmtUuid: this.store.mcUuid
        })
        .subscribe(
          res => {
            this.store.mcUuid = res.uuid;
            this._ruleApi.modifyRule(data, res.uuid).subscribe(
              response => {
                // clear temp copy rule.
                this.clearCopyRuleFromList();
                // then update the rule list and sync with server
                this.store.updateRuleInList(response);
                this._ruleApi.callUpdateVersionLock();
                this.uid = response.uid;
                // add toast notification
                this.store.loader = false;
              },
              error => {
                this.errorHandler(error);
              },
              () => {}
            );
          },
          error => this.errorHandler(error),
          () => {}
        );
    } else {
      // scroll to first invalid element const elId =
      // filterInvalidActions[0].action.id; const el = document.getElementById(elId as
      // string); const label = el.children.item(0) as HTMLElement;
      // el.scrollIntoView();
    }
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
    this.clearCopyRuleFromList();
    this.store.isLeftVisible = true;
  }
}
