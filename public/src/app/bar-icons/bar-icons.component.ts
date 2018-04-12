import { Component, Input, ViewChild } from '@angular/core';
import { Store } from '../store/store';
import { includes } from 'lodash';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-bar-icons',
  templateUrl: './bar-icons.component.html',
  styleUrls: ['./bar-icons.component.scss']
})
export class BarIconsComponent {
  configuration;
  @Input() tabName: string;
  @ViewChild('cdumpConfForm') cdumpConfForm: NgForm;

  constructor(public store: Store) {}

  onChange(e) {
    this.store.cdumpIsDirty = true;
  }

  isPropertyDdl(property) {
    if (property.hasOwnProperty('constraints')) {
      if (
        includes(
          property.constraints[0].valid_values,
          property.assignment.value
        )
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  genrateBarTestId() {
    return `${this.tabName}-bar-icon-container`;
  }

  enableSetting() {
    this.store.expandAdvancedSetting[this.store.tabIndex] = !this.store
      .expandAdvancedSetting[this.store.tabIndex];
  }
}
