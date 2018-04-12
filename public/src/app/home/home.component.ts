import { Component } from '@angular/core';
import { Store } from '../store/store';
import { HostService } from '../host/host.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from '../api/rest-api.service';
import { NgIf } from '@angular/common';
import { ConfirmPopupComponent } from '../rule-engine/confirm-popup/confirm-popup.component';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  linkToMain: string;
  currentUserId: string;
  showTable = true;
  selectedLine;
  monitoringComponents = new Array();
  unavailableMonitoringComponents = new Array();
  hoveredIndex = null;
  dialogRef;

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
      this.linkToMain = `/main/${params.contextType}/${params.uuid}/${
        params.version
      }/`;
      this._restApi.getMonitoringComponents(params).subscribe(
        response => {
          console.log('response:  ', response);
          if (response.hasOwnProperty('monitoringComponents')) {
            this.monitoringComponents = response.monitoringComponents;
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

  checkHoverCondition(item: any): boolean {
    if (
      this.store.sdcParmas.userId === item.lastUpdaterUserId &&
      this.store.sdcParmas.lifecycleState === 'NOT_CERTIFIED_CHECKOUT'
    ) {
      return false;
    } else {
      return true;
    }
  }

  editItem(item: any): void {
    this.store.vfiName = item.vfiName;
    this.route.navigate([this.linkToMain + '/' + item.uuid]);
  }

  onSelect(item: any): void {
    this.selectedLine = item;
    console.log('selected : ', item);
  }

  deleteEnable(item: any): boolean {
    console.log(
      'delete enable: ',
      item.isOwner && item.Lifecycle == 'NOT_CERTIFIED_CHECKOUT'
    );
    const { userId, lifecycleState } = this.store.sdcParmas;
    return (
      item.lastUpdaterUserId == userId &&
      lifecycleState == 'NOT_CERTIFIED_CHECKOUT'
    );
  }

  deleteItem(item: any): void {
    let deleteRow = this.hoveredIndex;
    this.dialogRef = this.dialog.open(ConfirmPopupComponent, {
      panelClass: 'my-confrim-dialog',
      disableClose: true
    });
    this.dialogRef.afterClosed().subscribe(result => {
      // if the user want to delete
      if (result) {
        if (item.status == 'submitted') {
          this._restApi
            .deleteMonitoringComponentWithBlueprint(
              this.store.sdcParmas,
              item.name,
              item.uuid,
              item.vfiName
            )
            .subscribe(
              response => {
                this.itemDeletedRemoveAndNotify(deleteRow);
              },
              error => {
                if (error.messageId === 'SVC6118') {
                  this.monitoringComponents.splice(deleteRow, 1);
                  this.changeDetectorRef.detectChanges();
                }
                const errorMsg = Object.values(error.requestError) as any;
                this.toastr.error('', errorMsg[0]);
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
                this.itemDeletedRemoveAndNotify(deleteRow);
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

  // convertFile(fileInput: any) {
  //   // read file from input
  //   const fileReaded = fileInput.target.files[0];
  //   Papa.parse(fileReaded, {
  //     complete: function(results) {
  //       console.log('Finished:', results.data);
  //     }
  //   });
  // }
}
