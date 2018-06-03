import { Component } from '@angular/core';
import { Store } from '../store/store';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent {
  constructor(public store: Store) {}

  closeDialog() {
    this.store.displayErrorDialog = false;
  }
}
