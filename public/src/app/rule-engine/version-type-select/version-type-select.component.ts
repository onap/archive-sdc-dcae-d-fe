import { Component, Output, EventEmitter, Input } from '@angular/core';
import { RuleEngineApiService } from '../api/rule-engine-api.service';
import { Store } from '../../store/store';

@Component({
  selector: 'app-version-type-select',
  templateUrl: './version-type-select.component.html',
  styleUrls: ['./version-type-select.component.scss']
})
export class VersionTypeSelectComponent {
  mappingTarget: string;
  selectedEvent: String;
  selectedVersion: String;
  events: Array<String>;
  loader: boolean;
  editMode = false;
  readOnly = false;
  @Input() versions;
  @Input() metaData;
  @Output() nodesUpdated = new EventEmitter();
  @Output() refrashRuleList = new EventEmitter();
  advancedSetting;

  constructor(private _ruleApi: RuleEngineApiService, public store: Store) {
    this.selectedVersion = null;
    this.selectedEvent = null;
    // set ddl with the first option value.
    this.mappingTarget = this.store.configurationForm[0].name;
    this.advancedSetting = this.store.configurationForm.filter(item => {
      if (
        !(
          item.hasOwnProperty('constraints') &&
          !item.assignment.value.includes('get_input')
        )
      ) {
        return item;
      }
    });
  }

  onChangeMapping(configurationKey) {
    console.log('changing propertiy key:', configurationKey);
    this._ruleApi.setFieldName(configurationKey);
    this.refrashRuleList.next();
  }

  updateData(version, eventType, isList) {
    this.selectedVersion = version;
    this.selectedEvent = eventType;
    this.readOnly = true;
  }

  updateVersionTypeFlag(flag) {
    this.readOnly = flag;
    if (flag === false) {
      this.selectedVersion = null;
      this.selectedEvent = null;
    }
  }

  onSelectVersion(version, eventType) {
    if (typeof eventType === 'undefined') {
      this.selectedEvent = '';
      this.events = this.metaData
        .filter(x => x.version === version)
        .map(x => x.eventTypes)[0];
      if (eventType) {
        this.editMode = true;
        this.selectedEvent = eventType + 'Fields';
      }
    }
  }

  onSelectEventType(eventType) {
    this.loader = true;
    this._ruleApi
      .getSchema(this.selectedVersion, this.selectedEvent)
      .subscribe(tree => {
        console.log('tree: ', tree);
        this.loader = false;
        this.nodesUpdated.emit({
          nodes: tree
        });
      });
  }
}
