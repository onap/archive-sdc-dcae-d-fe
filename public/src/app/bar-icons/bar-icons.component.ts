import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { includes } from 'lodash';
import { Store } from '../store/store';
import { RuleEngineApiService } from '../rule-engine/api/rule-engine-api.service';

@Component({
  selector: 'app-bar-icons',
  templateUrl: './bar-icons.component.html',
  styleUrls: ['./bar-icons.component.scss']
})
export class BarIconsComponent {
  configuration;
  @Input() tabName: string;
  @ViewChild('cdumpConfForm') cdumpConfForm: NgForm;
  dropDownTypes = {
    none: 1,
    regularDDL: 2,
    booleanDDL: 3
  };

  constructor(public store: Store, private restApi: RuleEngineApiService) {}

  onChange(e) {
    this.store.cdumpIsDirty = true;
  }

  isPropertyDdl(property) {
    if (property.hasOwnProperty('constraints')) {
      if (includes(property.constraints[0].valid_values, property.value)) {
        return this.dropDownTypes.regularDDL;
      } else if (
        property.hasOwnProperty('type') &&
        property.type === 'boolean'
      ) {
        if (!(property.value === 'false')) {
          property.value = true;
        }
        return this.dropDownTypes.booleanDDL;
      }
    }
    return this.dropDownTypes.none;
  }

  genrateBarTestId() {
    return `${this.tabName}-bar-icon-container`;
  }

  enableSetting() {
    this.store.expandAdvancedSetting[this.store.tabIndex] = !this.store
      .expandAdvancedSetting[this.store.tabIndex];
  }

  enableImports() {
    this.store.expandImports[this.store.tabIndex] = !this.store.expandImports[
      this.store.tabIndex
    ];
  }

  downloadRules() {
    this.restApi.exportRules();
  }
}
