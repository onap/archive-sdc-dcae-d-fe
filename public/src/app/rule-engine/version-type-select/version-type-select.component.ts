import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '../../store/store';
import { RuleEngineApiService } from '../api/rule-engine-api.service';

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
  advancedSetting: Array<any>;
  notifyIdCheckbox = false;

  constructor(private _ruleApi: RuleEngineApiService, public store: Store) {
    this.selectedVersion = null;
    this.selectedEvent = null;
    // set ddl with the first option value.

    this._ruleApi.tabIndex.subscribe(index => {
      if (index >= 0) {
        const tabName = this.store.cdump.nodes[index].name;
        console.log('tab name:', tabName);
        if (
          tabName.toLowerCase().includes('map') ||
          tabName.toLowerCase().includes('highlandpark') ||
          tabName.toLowerCase().includes('hp')
        ) {
          this.advancedSetting = this.store.tabsProperties[index].filter(
            item => {
              if (
                !(
                  item.hasOwnProperty('constraints') &&
                  item.value !== undefined &&
                  !item.value.includes('get_input')
                )
              ) {
                return item;
              }
            }
          );
          this.mappingTarget = this.advancedSetting[0].name;

          this._ruleApi
            .generateMappingRulesFileName(
              this.store.ruleListExistParams.nodeName,
              this.store.ruleListExistParams.nodeId,
              this.store.ruleListExistParams.vfcmtUuid
            )
            .subscribe(response => {
              console.log('generateMappingRulesFileName response: ', response);
              this.advancedSetting.forEach(element => {
                if (response.includes(element.name)) {
                  element.isExist = true;
                } else {
                  element.isExist = false;
                }
              });
            });
        }
      }
    });
  }

  changeNotifyId() {
    if (!this.notifyIdCheckbox) {
      this.store.notifyIdValue = '';
    }
    return (this.notifyIdCheckbox = !this.notifyIdCheckbox);
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
        this.nodesUpdated.emit({ nodes: tree });
      });
  }
}
