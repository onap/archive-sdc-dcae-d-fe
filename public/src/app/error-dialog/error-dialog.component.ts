import { Component, OnInit } from '@angular/core';
import { Store } from '../store/store';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent implements OnInit {
  constructor(public store: Store) {}

  ngOnInit() {}

  closeDialog() {
    this.store.displayErrorDialog = false;
  }
}
