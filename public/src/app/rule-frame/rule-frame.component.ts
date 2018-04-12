import { Component, OnDestroy, Input, ViewChild } from '@angular/core';
import { Store } from '../store/store';
import { BarIconsComponent } from '../bar-icons/bar-icons.component';

@Component({
  selector: 'app-rule-frame',
  templateUrl: './rule-frame.component.html',
  styleUrls: ['./rule-frame.component.scss']
})
export class RuleFrameComponent implements OnDestroy {
  expandSetting = false;
  configuration;
  mappingTarget: string;
  showHeaderBtn = true;
  @Input() tabName: string;
  // @ViewChild(BarIconsComponent) barFormsRef: BarIconsComponent;

  constructor(public store: Store) {
    this.store.isLeftVisible = true;
  }

  ngOnDestroy() {}

  onChangeMapping(configurationKey) {
    console.log('changing ifrmae entry', configurationKey);
  }

  isPropertyDdl(property) {
    return property.hasOwnProperty('constraints');
  }

  enableSetting() {
    this.expandSetting = !this.expandSetting;
  }
}
