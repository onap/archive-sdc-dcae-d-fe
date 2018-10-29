import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestApiService } from '../api/rest-api.service';
import { HostService } from '../host/host.service';
import { ConfirmPopupComponent } from '../rule-engine/confirm-popup/confirm-popup.component';
// import { PluginPubSub } from '../sdc/plugin-pubsub';
import { PluginPubSub } from 'sdc-pubsub';
import { Store } from '../store/store';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { environment } from '../../environments/environment';
import { RuleEngineApiService } from '../rule-engine/api/rule-engine-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {
  linkToMain: string;
  showTable = true;
  selectedLine = [];
  unavailableMonitoringComponents = new Array();
  hoveredIndex = 1;
  dialogRef;
  deleteRow: number;
  imgBase = environment.imagePath;

  loadingIndicator = true;

  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private _restApi: RestApiService,
    private _ruleApi: RuleEngineApiService,
    private dialog: MatDialog,
    public store: Store,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.store.loader = true;
    this.store.viewOnly = false;
    this.store.mcName = '';
    this._ruleApi.callUpdateTabIndex(-1);
    this.store.setTabIndex(-1);
    this.activeRoute.queryParams.subscribe(params => {
      console.log('params: %o', params);
      this.store.sdcParmas = params;

      console.log('init comunication with sdc');
      const eventsToWaitFor = [
        'WINDOW_OUT',
        'VERSION_CHANGE',
        'CHECK_IN',
        'CHECK_OUT',
        'SUBMIT_FOR_TESTING',
        'UNDO_CHECK_OUT'
      ];
      this.store.ifrmaeMessenger = new PluginPubSub(
        this.store.sdcParmas.eventsClientId,
        this.store.sdcParmas.parentUrl,
        eventsToWaitFor
      );
      console.log('send ready to sdc');
      this.store.ifrmaeMessenger.notify('READY');

      this.store.ifrmaeMessenger.on((eventData, event) => {
        console.log('eventData', eventData);
        console.log('event', event);
        if (
          eventData.type === 'WINDOW_OUT' ||
          eventData.type === 'CHECK_IN' ||
          eventData.type === 'SUBMIT_FOR_TESTING'
        ) {
          const currentUrl = this.route.url;
          if (currentUrl.includes('main')) {
            if (this.store.cdumpIsDirty) {
              this.store.displaySDCDialog = true;
            } else {
              this.store.ifrmaeMessenger.notify('ACTION_COMPLETED');
            }
          } else {
            this.store.ifrmaeMessenger.notify('ACTION_COMPLETED');
          }
        } else {
          this.store.ifrmaeMessenger.notify('ACTION_COMPLETED');
        }
      });

      this.linkToMain = `/main/${params.contextType}/${params.uuid}/${
        params.version
      }/`;
      this.loadingIndicator = true;

      this._restApi.getMonitoringComponents(params).subscribe(
        response => {
          console.log('response:  ', response);
          if (response.hasOwnProperty('monitoringComponents')) {
            this.store.monitoringComponents = response.monitoringComponents;
            this.loadingIndicator = false;
          }
          if (response.hasOwnProperty('unavailable')) {
            this.unavailableMonitoringComponents = response.unavailable;
          }
          this.showTable = this.store.monitoringComponents.length > 0;
          this.store.loader = false;
        },
        response => {
          this.showTable = false;
          this.store.loader = false;
          console.log('ERROR: ', response);
        }
      );
      HostService.disableLoader();
    });
  }

  createScreen() {
    this.store.isEditMode = false;
    this.route.navigate([this.linkToMain + 'new']);
  }

  importScreen() {
    this.store.isEditMode = false;
    this.route.navigate([this.linkToMain + 'import']);
  }

  checkCanCreate() {
    return (
      JSON.parse(this.store.sdcParmas.isOwner) &&
      this.store.sdcParmas.lifecycleState === 'NOT_CERTIFIED_CHECKOUT'
    );
  }

  // Monitoring Table logic

  checkTableItemHoverCondition(item: any): boolean {
    return (
      this.checkCanCreate() &&
      (this.store.sdcParmas.userId === item.lastUpdaterUserId ||
        item['lifecycleState'] !== 'NOT_CERTIFIED_CHECKOUT')
    );
  }

  onTableActivate(event: any): void {
    this.hoveredIndex = this.store.monitoringComponents.findIndex(
      s => s === event.row
    );
  }

  revertMcDialog(item) {
    this.store.submittedMcUuid = item.submittedUuid;
    this.store.mcUuid = item.uuid;
    this.store.vfiName = item.vfiName;
    this.store.displayRevertDialog = true;
  }

  checkReverted(item: any) {
    return !item.uuid.includes(item.submittedUuid);
  }

  viewSubmitted(item: any): void {
    this.store.vfiName = item.vfiName;
    console.log('item.submittedUuid', item.submittedUuid);
    this.store.viewOnly = true;
    this.route.navigate([this.linkToMain + '/' + item.submittedUuid]);
  }

  editTableItem(item: any): void {
    this.store.vfiName = item.vfiName;
    this.route.navigate([this.linkToMain + '/' + item.uuid]);
  }

  onTableSelectItem(item: any): void {
    this.selectedLine = item;
    console.log('selected : ', item);
  }

  deleteTableItem(item: any, index: any): void {
    this.deleteRow = index;
    this.dialogRef = this.dialog.open(ConfirmPopupComponent, {
      panelClass: 'my-confrim-dialog',
      disableClose: true
    });
    this.dialogRef.afterClosed().subscribe(result => {
      // if the user want to delete
      if (result) {
        if (item.status === 'Submitted') {
          this.store.loader = true;
          const submittedUuid = !item.uuid.includes(item.submittedUuid)
            ? item.submittedUuid
            : '';
          this._restApi
            .deleteMonitoringComponentWithBlueprint(
              this.store.sdcParmas,
              item.name,
              item.uuid,
              item.vfiName,
              submittedUuid
            )
            .subscribe(
              response => {
                this.itemDeletedRemoveAndNotify(item.uuid, this.deleteRow);
                this.store.loader = false;
              },
              error => {
                const errorMsg = Object.values(error.requestError) as any;
                if (errorMsg[0].messageId === 'SVC6118') {
                  this.store.monitoringComponents = this.store.monitoringComponents.filter(
                    comp => {
                      return comp.uuid !== item.uuid;
                    }
                  );
                }
                this.store.loader = false;
                this.toastr.error('', errorMsg[0].formattedErrorMessage);
              }
            );
        } else {
          this.store.loader = true;
          this._restApi
            .deleteMonitoringComponent(
              this.store.sdcParmas,
              item.uuid,
              item.vfiName
            )
            .subscribe(
              response => {
                this.itemDeletedRemoveAndNotify(item.uuid, this.deleteRow);
                this.store.loader = false;
              },
              error => {
                const errorMsg = Object.values(error.requestError) as any;
                this.store.loader = false;
                this.toastr.error('', errorMsg[0]);
              }
            );
        }
      }
    });
  }

  itemDeletedRemoveAndNotify(uuid, deletedRow: number): void {
    this.store.monitoringComponents = this.store.monitoringComponents.filter(
      comp => {
        return comp.uuid !== uuid;
      }
    );
    this.toastr.success(
      '',
      'Monitoring Configuration was successfully deleted'
    );
  }

  test() {
    const path = location.href;
    console.log('path', path);

    const newUrl = this.updateQueryStringParameter(path, 'userId', 'dror');
    console.log('newUrl', newUrl);
    window.location.href = newUrl;
  }

  updateQueryStringParameter(uri, key, value) {
    const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';
    if (uri.match(re)) {
      return uri.replace(re, '$1' + key + '=' + value + '$2');
    } else {
      return uri + separator + key + '=' + value;
    }
  }
}
