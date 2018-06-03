import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestApiService } from '../api/rest-api.service';
import { HostService } from '../host/host.service';
import { ConfirmPopupComponent } from '../rule-engine/confirm-popup/confirm-popup.component';
import { PluginPubSub } from '../sdc/plugin-pubsub';
import { Store } from '../store/store';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

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
  monitoringComponents = new Array();
  unavailableMonitoringComponents = new Array();
  hoveredIndex = 1;
  dialogRef;
  deleteRow: number;

  loadingIndicator = true;

  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private _restApi: RestApiService,
    private dialog: MatDialog,
    public store: Store,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.store.loader = true;
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
            this.monitoringComponents = response.monitoringComponents;
            this.loadingIndicator = false;
          }
          if (response.hasOwnProperty('unavailable')) {
            this.unavailableMonitoringComponents = response.unavailable;
          }
          this.showTable = this.monitoringComponents.length > 0;
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
    if (
      JSON.parse(this.store.sdcParmas.isOwner) &&
      this.store.sdcParmas.lifecycleState === 'NOT_CERTIFIED_CHECKOUT'
    ) {
      return false;
    } else {
      return true;
    }
  }

  // Monitoring Table logic

  checkTableItemHoverCondition(item: any): boolean {
    if (
      this.store.sdcParmas !== undefined &&
      this.store.sdcParmas.userId === item.lastUpdaterUserId &&
      this.store.sdcParmas.lifecycleState === 'NOT_CERTIFIED_CHECKOUT'
    ) {
      return false;
    } else {
      return true;
    }
  }

  onTableActivate(event: any): void {
    this.hoveredIndex = this.monitoringComponents.findIndex(
      s => s == event.row
    );
    console.log('selected : ');
  }

  editTableItem(item: any): void {
    this.store.vfiName = item.vfiName;
    this.route.navigate([this.linkToMain + '/' + item.uuid]);
  }

  onTableSelectItem(item: any): void {
    this.selectedLine = item;
    console.log('selected : ', item);
  }

  deleteEnable(item: any): boolean {
    console.log(
      'delete enable: ',
      item.isOwner && item.Lifecycle === 'NOT_CERTIFIED_CHECKOUT'
    );
    const { userId, lifecycleState } = this.store.sdcParmas;
    return (
      item.lastUpdaterUserId === userId &&
      lifecycleState === 'NOT_CERTIFIED_CHECKOUT'
    );
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
          this._restApi
            .deleteMonitoringComponentWithBlueprint(
              this.store.sdcParmas,
              item.name,
              item.uuid,
              item.vfiName
            )
            .subscribe(
              response => {
                this.itemDeletedRemoveAndNotify(this.deleteRow);
              },
              error => {
                if (error.messageId === 'SVC6118') {
                  this.monitoringComponents.splice(this.deleteRow, 1);
                  this.changeDetectorRef.detectChanges();
                }
                const errorMsg = Object.values(error.requestError) as any;
                this.toastr.error('', errorMsg[0].formattedErrorMessage);
              }
            );
        } else {
          this._restApi
            .deleteMonitoringComponent(
              this.store.sdcParmas,
              item.uuid,
              item.vfiName
            )
            .subscribe(
              response => {
                this.itemDeletedRemoveAndNotify(this.deleteRow);
              },
              error => {
                const errorMsg = Object.values(error.requestError) as any;
                this.toastr.error('', errorMsg[0]);
              }
            );
        }
      }
    });
  }

  itemDeletedRemoveAndNotify(deletedRow: number): void {
    this.monitoringComponents.splice(deletedRow, 1);
    this.changeDetectorRef.detectChanges();
    this.toastr.success(
      '',
      'Monitoring Configuration was successfully deleted'
    );
  }
}
