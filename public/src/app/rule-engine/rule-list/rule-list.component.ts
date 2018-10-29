import {
  Component,
  ViewChild,
  ViewEncapsulation,
  ElementRef
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { isEmpty } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs/observable/timer';
import { Store } from '../../store/store';
import { RuleEngineApiService } from '../api/rule-engine-api.service';
import { ConfirmPopupComponent } from '../confirm-popup/confirm-popup.component';
import { cloneDeep, has, countBy } from 'lodash';
import { toJS } from 'mobx';
import { v4 as uuidGenarator } from 'uuid';
import { environment } from '../../../environments/environment';

const primaryColor = '#009fdb';

@Component({
  selector: 'app-rule-list',
  templateUrl: './rule-list.component.html',
  styleUrls: ['./rule-list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class RuleListComponent {
  @ViewChild('versionEventType') versionType;
  @ViewChild('groupUpload') fileInput: ElementRef;
  error: Array<string>;
  // list = new Array();
  schema;
  targetSource;
  dialogRef;
  crud;
  hoveredIndex;
  params;
  versions;
  metaData;
  tabName;
  // group data
  showBtnList = false;
  entryPhase;
  publishPhase;
  latestBtnGroup;
  imgBase = environment.imagePath;
  fileToUpload;
  fileName;
  // filter
  ifStatement = false;
  condition: any;
  filterSave = false;

  private errorHandler(error: any) {
    this.store.loader = false;
    console.log(error);
    this.error = null;
    this.error = [];
    if (typeof error === 'string') {
      this.error.push(error);
    } else {
      console.log(error.notes);
      const errorFromServer = Object.values(error)[0] as any;
      if (Object.keys(error)[0] === 'serviceExceptions') {
        this.error = errorFromServer.map(x => x.formattedErrorMessage);
      } else {
        this.error = errorFromServer.formattedErrorMessage;
      }
    }
  }

  private notifyError(error: any) {
    this.store.loader = false;
    console.log(error.notes);
    const errorFromServer = Object.values(error)[0] as any;
    if (Object.keys(error)[0] === 'serviceExceptions') {
      this.store.ErrorContent.push(
        errorFromServer.map(x => x.formattedErrorMessage)
      );
    } else {
      this.store.ErrorContent.push(errorFromServer);
    }
    this.store.displayErrorDialog = true;
  }

  updateCondition(data) {
    this.condition = data;
  }

  filterCheckbox() {
    this.ifStatement = !this.ifStatement;
    if (!this.ifStatement) {
      if (this.filterSave) {
        this.deleteFilter();
      } else {
        this.condition = null;
      }
    }
  }

  removeConditionCheck(flag) {
    this.ifStatement = flag;
    if (this.filterSave) {
      this.deleteFilter();
    }
  }

  private deleteFilter() {
    this.error = null;
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
          this._ruleApi.deleteFilter(res.uuid).subscribe(
            response => {
              if (this.store.ruleList.length === 0) {
                this.versionType.updateVersionTypeFlag(false);
              }
              this.condition = null;
              this.filterSave = false;
              this.ifStatement = false;
              this.store.loader = false;
            },
            error => {
              const errorMsg = Object.values(error) as any;
              if (errorMsg[0].messageId !== 'SVC6119') {
                this.errorHandler(error);
              } else {
                this.store.loader = false;
                this.errorHandler(error);
              }
              this.condition = null;
            }
          );
        },
        error => {
          this.errorHandler(error);
        }
      );
  }

  disabledMapBtn(btnType) {
    if (this.store.groupList.length > 0) {
      if (btnType === 'map') {
        if (
          this.store.groupList[this.store.groupList.length - 1].groupId
            .substring(0, 1)
            .toLowerCase() === 'm' ||
          this.store.groupList.length === 3
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        if (
          this.store.groupList[this.store.groupList.length - 1].groupId
            .substring(0, 1)
            .toLowerCase() === 'e' ||
          this.store.groupList.length === 3
        ) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  disableDeleteGroup(groupId) {
    const countGroupType = countBy(this.store.groupList, item => {
      const innerGroupType =
        item.groupId.substring(0, 1).toLowerCase() === 'm' ? 'map' : 'enrich';
      return innerGroupType === 'map' ? 'map' : 'enrich';
    });
    const groupType =
      groupId.substring(0, 1).toLowerCase() === 'm' ? 'map' : 'enrich';
    if (groupType === 'map') {
      return countGroupType.enrich === 2 ? true : false;
    } else {
      return countGroupType.map === 2 ? true : false;
    }
  }

  clearFile() {
    this.fileInput.nativeElement.value = '';
    this.fileName = '';
  }

  handleImportCDAP(files: FileList, groupId, phaseName) {
    this.error = null;
    const reader = new FileReader();
    if (files && files.length > 0) {
      this.store.loader = true;
      this.fileToUpload = files.item(0);
      console.log('file to load:', this.fileToUpload);
      this.fileName = this.fileToUpload !== null ? this.fileToUpload.name : '';
      reader.readAsText(this.fileToUpload, 'UTF-8');
      reader.onload = () => {
        console.log(reader.result);
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
              let data = '';
              try {
                data = JSON.parse(reader.result as any);
                const input = {
                  version: this.versionType.selectedVersion,
                  eventType: this.versionType.selectedEvent,
                  groupId: groupId,
                  phase: phaseName,
                  payload: data
                };
                this._ruleApi.importPhase(input).subscribe(
                  response => {
                    console.log('success import', response);
                    this.clearFile();
                    this.store.loader = false;
                    this.store.updateRuleList(Object.values(response.rules));
                  },
                  error => {
                    this.clearFile();
                    this.notifyError(error);
                  }
                );
              } catch (e) {
                console.log(e);
                this.clearFile();
                this.errorHandler({
                  policyException: {
                    messageId: 'Invalid JSON',
                    text: 'Invalid JSON',
                    variables: [],
                    formattedErrorMessage: 'Invalid JSON'
                  }
                });
              }
            },
            error => {
              this.clearFile();
              this.errorHandler(error);
            }
          );
      };
    } else {
      this.clearFile();
    }
  }

  addGroup(type) {
    this.latestBtnGroup = type;
    const defaultPhase =
      type === 'enrich'
        ? `standard_${this.tabName}_enrich`
        : `standard_${this.tabName}`;
    const groupId = type + uuidGenarator();
    const newGroup = {
      groupId: groupId,
      phase: defaultPhase
    };
    this.store.groupList.push(newGroup);
    this.showBtnList = false;
  }

  deleteGroup(groupId) {
    this.store.loader = true;
    this.error = null;
    // check if group list have list
    const selectedGroup = this.store.groupList.filter(
      item => item.groupId === groupId
    );
    const isExistInRuleList = this.store.ruleList.filter(
      item => item.groupId === groupId
    );
    if (isExistInRuleList.length < 1) {
      this.store.groupList = this.store.groupList.filter(
        item => item.groupId !== groupId
      );
      this.store.loader = false;
    } else {
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
            this._ruleApi.deleteGroup(groupId, res.uuid).subscribe(
              response => {
                this.store.deleteFromGroup(groupId);
                this.store.loader = false;
              },
              error => {
                this.errorHandler(error);
              }
            );
          },
          error => this.errorHandler(error),
          () => {}
        );
    }
  }

  private getListOfRules() {
    this.error = null;
    this._ruleApi.getListOfRules().subscribe(
      response => {
        console.log('res: %o', response);
        if (response && Object.keys(response).length !== 0) {
          this.versionType.updateData(
            response.version,
            response.eventType,
            true
          );
          this.store.updateRuleList(Object.values(response.rules));
          this.targetSource = response.schema;
          this.entryPhase = response.entryPhase;
          this.publishPhase = response.publishPhase;
          this.condition = response.filter;
          this.filterSave = response.filter !== undefined ? true : false;
          this.ifStatement = this.condition == null ? false : true;
        } else {
          this.store.resetRuleList();
          this.condition = null;
          this.filterSave = false;
          this.ifStatement = false;
          this.versionType.updateVersionTypeFlag(false);
          this.targetSource = null;

          this._ruleApi.getInitialPhases(this.store.flowType).subscribe(
            data => {
              (this.entryPhase = data.entryPhase),
                (this.publishPhase = data.publishPhase);
            },
            error => {
              this.errorHandler(error);
            }
          );
          // if the the list is empty then get version and domain events
          this._ruleApi.getMetaData().subscribe(
            data => {
              console.log(data);
              this.versions = data.map(x => x.version);
              this.metaData = data;
            },
            error => {
              this.errorHandler(error);
            }
          );
        }
        this.store.loader = false;
      },
      error => {
        this.errorHandler(error);
      }
    );
  }

  constructor(
    private _ruleApi: RuleEngineApiService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    public store: Store
  ) {
    this.store.loader = false;
    this._ruleApi.tabIndex
      // .filter(index => {   if (index >= 0) {     const tabName =
      // this.store.cdump.nodes[index].name;     console.log('tab name:', tabName); if
      // (tabName.toLowerCase().includes('map')) {       return index;     }   } })
      .subscribe(index => {
        this.error = null;
        if (index >= 0) {
          this.tabName = this.store.cdump.nodes[index].name;
          console.log('tab name:', this.tabName);
          if (
            this.tabName.toLowerCase().includes('map') ||
            this.tabName.toLowerCase().includes('highlandpark') ||
            this.tabName.toLowerCase().includes('hp')
          ) {
            const advancedSetting = this.store.tabsProperties[index].filter(
              item => {
                if (
                  !(
                    item.hasOwnProperty('constraints') &&
                    item.value !== undefined &&
                    !item.value.includes('get_input')
                  )
                ) {
                  return item;
                }
              }
            );
            const mappingTarget = advancedSetting[0].name;
            console.log('mappingTarget', mappingTarget);

            this.params = {
              vfcmtUuid: this.store.mcUuid,
              nodeName: this.store.tabParmasForRule[0].name,
              nodeId: this.store.tabParmasForRule[0].nid,
              fieldName: mappingTarget,
              userId: this.store.sdcParmas.userId,
              flowType: this.store.cdump.flowType
            };
            console.log('params: %o', this.params);
            this.store.loader = true;
            // set api params by iframe url query
            this._ruleApi.setParams(this.params);
            store.ruleListExistParams = this.params;
            this.getListOfRules();
          }
        }
      });
  }

  applyFilter() {
    this.store.loader = true;
    this.error = null;
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
          this.filterSave = true;
          let conditionData2server = null;
          conditionData2server = this.convertConditionToServer(this.condition);
          const newFilter = {
            version: this.versionType.selectedVersion,
            eventType: this.versionType.selectedEvent,
            entryPhase: this.entryPhase,
            publishPhase: this.publishPhase,
            filter: conditionData2server
          };
          this._ruleApi.applyFilter(newFilter).subscribe(
            success => {
              if (this.store.ruleList.length === 0) {
                this.versionType.updateVersionTypeFlag(true);
              }
              this.store.loader = false;
            },
            error => {
              this.errorHandler(error);
            }
          );
        },
        error => this.errorHandler(error),
        () => {}
      );
  }

  convertConditionToServer(tree) {
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

  handlePropertyChange() {
    this.store.loader = true;
    this.error = null;
    this.getListOfRules();
  }

  translateRules() {
    this.store.loader = true;
    this.error = null;
    // send translate JSON const nofityId = this.store.notifyIdValue;
    const mcUuid = this.store.mcUuid;
    this._ruleApi
      .translate(this.entryPhase, this.publishPhase, mcUuid)
      .subscribe(
        data => {
          this.store.loader = false;
          console.log(JSON.stringify(data));
          let domElementName: string;
          this.store.configurationForm.forEach(property => {
            console.log('mappingTarget ', this.versionType.mappingTarget);
            if (property.name === this.versionType.mappingTarget) {
              property.value = JSON.stringify(data);
              domElementName = property.name;
              console.log(property.name);
            }
          });
          this.toastr.success('', 'Successfull translation');
          this.store.expandAdvancedSetting[this.store.tabIndex] = true;
          const source = timer(500);
          source.subscribe(val => {
            const el = document.getElementById(domElementName);
            const label = el.children.item(0) as HTMLElement;
            label.style.color = primaryColor;
            const input = el.children.item(1) as HTMLElement;
            input.style.color = primaryColor;
            input.style.borderColor = primaryColor;
            el.scrollIntoView();
            this.store.cdumpIsDirty = true;
          });
        },
        error => {
          this.errorHandler(error);
        }
      );
  }

  handleUpdateNode(data) {
    this.targetSource = data.nodes;
    this.store.resetRuleList();
    this.condition = null;
    this.ifStatement = false;
  }

  removeItem(uid, groupId) {
    this.dialogRef = this.dialog.open(ConfirmPopupComponent, {
      panelClass: 'my-confrim-dialog',
      disableClose: true
    });
    this.dialogRef.afterClosed().subscribe(result => {
      // if the user want to delete
      if (result) {
        // call be api
        this.store.loader = true;
        this.error = null;
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
              this._ruleApi.deleteRule(uid, res.uuid).subscribe(
                success => {
                  this.store.removeRuleFromList(uid, groupId);
                  // if its the last rule
                  if (this.store.ruleList.length === 0) {
                    this._ruleApi.getMetaData().subscribe(data => {
                      console.log(data);
                      this.versions = data.map(x => x.version);
                      this.metaData = data;
                      if (this.filterSave === false) {
                        this.versionType.updateVersionTypeFlag(false);
                      }
                      this.targetSource = null;
                    });
                  }
                  this.store.loader = false;
                },
                error => {
                  this.store.loader = false;
                  this.errorHandler(error);
                }
              );
            },
            error => this.errorHandler(error),
            () => {}
          );
      }
    });
  }

  copyRule(rule, index, groupItem) {
    const copyRule = cloneDeep(toJS(rule));
    copyRule.uid = '';
    copyRule.description = copyRule.description.concat('_Copy');
    this.store.ruleList.push(copyRule);
    this.openAction(copyRule, groupItem);
    this.toastr.warning(
      'The rule you are editing has unsaved changes, please make sure to save your work' +
        '.',
      'The mapping rule is copied'
    );
  }

  openAction(item, groupItem): void {
    this.crud = isEmpty(item) ? 'new' : 'edit';
    this._ruleApi.passDataToEditor({
      version: this.versionType.selectedVersion,
      eventType: this.versionType.selectedEvent,
      targetSource: this.targetSource,
      item: isEmpty(item) ? null : item,
      params: this.params,
      groupId: isEmpty(groupItem) ? null : groupItem.groupId,
      phase: isEmpty(groupItem) ? null : groupItem.phase,
      entryPhase: this.entryPhase,
      publishPhase: this.publishPhase
    });
    this.store.isLeftVisible = false;

    this._ruleApi.updateVersionLock.subscribe(() => {
      if (this.filterSave === true) {
        this.versionType.updateVersionTypeFlag(true);
      }
    });
  }
}
