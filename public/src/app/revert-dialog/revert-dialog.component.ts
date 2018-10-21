import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from '../api/rest-api.service';
import { MainComponent } from '../main/main.component';
import { Store } from '../store/store';

@Component({
  selector: 'app-revert-dialog',
  templateUrl: './revert-dialog.component.html',
  styleUrls: ['./revert-dialog.component.scss']
})
export class RevertDialogComponent {
  @ViewChild(MainComponent) mainComponent: ElementRef;

  constructor(
    public store: Store,
    private router: Router,
    private _restApi: RestApiService
  ) {}

  closeDialog() {
    this.store.displayRevertDialog = false;
  }

  revert() {
    this.store.loader = true;

    this._restApi
      .revertMC({
        contextType: this.store.sdcParmas.contextType,
        serviceUuid: this.store.sdcParmas.uuid,
        vfiName: this.store.vfiName,
        vfcmtUuid: this.store.mcUuid,
        submittedUuid: this.store.submittedMcUuid
      })
      .subscribe(
        success => {
          this.store.monitoringComponents = this.store.monitoringComponents.map(
            item => {
              if (item.invariantUuid === success.invariantUuid) {
                item = success;
              }
              return item;
            }
          );
          this.store.loader = false;
          this.store.displayRevertDialog = false;
        },
        error => {
          this.store.loader = false;
          this.store.displayRevertDialog = false;
          console.log(error.notes);
          this.store.ErrorContent = Object.values(error.requestError);
          this.store.displayErrorDialog = true;
        },
        () => {}
      );
  }
}
