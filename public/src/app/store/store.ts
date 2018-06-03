import { Injectable } from '@angular/core';
import { findIndex } from 'lodash';
import { action, computed, observable, toJS } from 'mobx';

@Injectable()
export class Store {
  @observable sdcParmas;
  @observable isOwner;
  @observable mcUuid;
  @observable cdump;
  @observable tabsProperties;
  @observable tabIndex = 0;
  @observable isEditMode = false;
  @observable loader = false;
  @observable cdumpIsDirty = false;
  @observable expandAdvancedSetting = [];
  @observable generalflow;
  @observable vfiName;
  @observable flowType;
  @observable ifrmaeMessenger;
  @observable waitForSave = false;
  @observable displaySDCDialog = false;
  // error dialog
  @observable displayErrorDialog = false;
  @observable ErrorContent = [];

  // rule-engine
  @observable tabParmasForRule;
  @observable ruleList = new Array();
  @observable ruleListExistParams;
  @observable ruleEditorInitializedState;
  @observable isLeftVisible;
  @observable inprogress;
  @observable notifyIdValue = '';

  @action
  updateRuleInList(rule) {
    console.log('current list:', toJS(this.ruleList));
    console.log('new rule', rule);
    const ruleIndex = findIndex(this.ruleList, function(ruleFromList) {
      console.log(
        `find match rule: list - ${ruleFromList.uid}, rule - ${rule.uid}`
      );
      return ruleFromList.uid === rule.uid;
    });
    if (ruleIndex > -1) {
      console.log('update rule');
      this.ruleList[ruleIndex] = rule;
    } else {
      console.log('new rule');
      this.ruleList.push(rule);
    }
  }

  @action
  updateRuleList(listOfRules) {
    this.ruleList = listOfRules;
    console.log(toJS(this.ruleList));
  }

  @action
  removeRuleFromList(uid) {
    this.ruleList = this.ruleList.filter(item => item.uid !== uid);
  }

  @action
  resetRuleList() {
    this.ruleList = new Array();
  }

  @action
  changeStateForEditor(data) {
    this.ruleEditorInitializedState = data;
  }

  @action
  setTabIndex(value) {
    this.tabIndex = value;
  }

  @action
  setTabsProperties(nodes) {
    this.tabsProperties = nodes.map(tabItem => {
      return tabItem.properties.map(x => {
        if (!x.assignment) {
          x.assignment = {};
          x.assignment.value = '';
        } else if (typeof x.assignment.value === 'object') {
          x.assignment.value = JSON.stringify(x.assignment.value);
        }
        if (x.value) {
          if (typeof x.value === 'object') {
            x.value = JSON.stringify(x.value);
          }
        } else if (!x.value) {
          x.value = x.assignment.value;
        }
        return x;
      });
    });
    nodes.map(() => {
      this.expandAdvancedSetting.push(false);
    });
    console.log('tabsProperties: %o', this.tabsProperties.toJS());
  }

  @computed
  get configurationForm() {
    return this.tabIndex >= 0 ? this.tabsProperties[this.tabIndex] : null;
  }
}
