import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { isEmpty } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs/observable/timer';
import { Store } from '../../store/store';
import { RuleEngineApiService } from '../api/rule-engine-api.service';
import { ConfirmPopupComponent } from '../confirm-popup/confirm-popup.component';

const primaryColor = '#009fdb';

@Component({
  selector: 'app-rule-list',
  templateUrl: './rule-list.component.html',
  styleUrls: ['./rule-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RuleListComponent {
  @ViewChild('versionEventType') versionType;
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

  private errorHandler(error: any) {
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
        this.error = errorFromServer.formattedErrorMessage;
      }
    }
  }

  private getListOfRules() {
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
          this.store.notifyIdValue = response.notifyId;
          this.versionType.notifyIdCheckbox =
            response.notifyId !== '' ? true : false;
        } else {
          this.versionType.notifyIdCheckbox = false;
          this.store.resetRuleList();
          this.versionType.updateVersionTypeFlag(false);
          this.targetSource = null;
          // if the the list is empty then get version and domain events
          this._ruleApi.getMetaData().subscribe(data => {
            console.log(data);
            this.versions = data.map(x => x.version);
            this.metaData = data;
          });
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
    this._ruleApi.tabIndex.subscribe(index => {
      console.log('rule index in rule-list component:', index);
      const tabName = this.store.cdump.nodes[index].name;
      console.log('tab name:', tabName);

      if (tabName.toLowerCase().includes('map')) {
        this.params = {
          vfcmtUuid: this.store.mcUuid,
          nodeName: this.store.tabParmasForRule[0].name,
          nodeId: this.store.tabParmasForRule[0].nid,
          fieldName: this.store.tabsProperties[index][0].name,
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
    });
  }

  handlePropertyChange() {
    this.store.loader = true;
    this.error = null;
    this.getListOfRules();
  }

  translateRules() {
    this.store.loader = true;
    // send translate JSON
    const nofityId = this.store.notifyIdValue;
    this._ruleApi.translate(nofityId).subscribe(
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
        this.toastr.success('', 'Translate succeeded');
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
  }

  removeItem(uid) {
    this.dialogRef = this.dialog.open(ConfirmPopupComponent, {
      panelClass: 'my-confrim-dialog',
      disableClose: true
    });
    this.dialogRef.afterClosed().subscribe(result => {
      // if the user want to delete
      if (result) {
        // call be api
        this.store.loader = true;
        this._ruleApi.deleteRule(uid).subscribe(
          success => {
            this.store.removeRuleFromList(uid);
            // if its the last rule
            if (this.store.ruleList.length === 0) {
              this._ruleApi.getMetaData().subscribe(data => {
                console.log(data);
                this.versions = data.map(x => x.version);
                this.metaData = data;
                this.versionType.updateVersionTypeFlag(false);
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
      }
    });
  }

  openAction(item): void {
    this.crud = isEmpty(item) ? 'new' : 'edit';
    this._ruleApi.passDataToEditor({
      version: this.versionType.selectedVersion,
      eventType: this.versionType.selectedEvent,
      targetSource: this.targetSource,
      item: isEmpty(item) ? null : item,
      params: this.params
    });
    this.store.isLeftVisible = false;

    this._ruleApi.updateVersionLock.subscribe(() => {
      this.versionType.updateVersionTypeFlag(true);
    });
  }
}
