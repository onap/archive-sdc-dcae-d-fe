import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from '../api/rest-api.service';
import { MainComponent } from '../main/main.component';
import { Store } from '../store/store';

@Component({
  selector: 'app-sdc-notify-dialog',
  templateUrl: './sdc-notify-dialog.component.html',
  styleUrls: ['./sdc-notify-dialog.component.scss']
})
export class SdcNotifyDialogComponent {
  @ViewChild(MainComponent) mainComponent: ElementRef;

  constructor(
    public store: Store,
    private router: Router,
    private _restApi: RestApiService
  ) {}

  closeDialog() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('main')) {
      if (this.store.cdumpIsDirty) {
        this.saveCDUMP();
      } else {
        this.completeAndClose();
      }
    } else {
      this.completeAndClose();
    }
  }

  saveCDUMP() {
    this.store.loader = true;
    this._restApi
      .saveMonitoringComponent({
        contextType: this.store.sdcParmas.contextType,
        serviceUuid: this.store.sdcParmas.uuid,
        vfiName: this.store.vfiName,
        vfcmtUuid: this.store.mcUuid,
        flowType: this.store.flowType,
        cdump: this.store.cdump
      })
      .subscribe(
        success => {
          this.store.loader = false;
          this.store.mcUuid = success.uuid;
          this.store.ifrmaeMessenger.notify('ACTION_COMPLETED');
        },
        error => {
          this.store.loader = false;
          console.log(error.notes);
          this.store.ifrmaeMessenger.notify('ACTION_COMPLETED');
          this.store.ErrorContent = Object.values(error.requestError);
          this.store.displayErrorDialog = true;
        },
        () => {
          this.store.ifrmaeMessenger.notify('ACTION_COMPLETED');
        }
      );
  }

  private completeAndClose() {
    this.store.ifrmaeMessenger.notify('ACTION_COMPLETED');
    this.store.displaySDCDialog = false;
  }

  closeforChange() {
    this.completeAndClose();
  }
}
