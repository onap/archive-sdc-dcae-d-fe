import { Injectable } from '@angular/core';
import { findIndex } from 'lodash';
import { action, computed, observable, toJS } from 'mobx';
import { groupBy, prop, compose, values } from 'ramda';

@Injectable()
export class Store {
  @observable sdcParmas;
  @observable isOwner;
  @observable viewOnly = false;
  @observable mcUuid;
  @observable mcName;
  @observable submittedMcUuid;
  @observable monitoringComponents = [];
  @observable cdump;
  @observable tabsProperties;
  @observable tabIndex = 0;
  @observable isEditMode = false;
  @observable loader = false;
  @observable cdumpIsDirty = false;
  @observable expandAdvancedSetting = [];
  @observable advancedSetting = [];
  @observable expandImports = [];
  @observable generalflow;
  @observable vfiName;
  @observable flowType;
  @observable ifrmaeMessenger;
  @observable waitForSave = false;
  @observable displaySDCDialog = false;
  @observable displayRevertDialog = false;
  // error dialog
  @observable displayErrorDialog = false;
  @observable ErrorContent = [];

  // rule-engine
  @observable tabParmasForRule;
  @observable ruleList = [];
  @observable groupList = [];
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
    // handle group list
    if (rule.groupId !== undefined) {
      this.groupList
        .filter(item => item.groupId === rule.groupId)
        .map(item2 => {
          if (item2.list === undefined) {
            item2.list = [];
          }
          const ruleItemIndex = findIndex(
            item2.list,
            (ruleFromList: any) => ruleFromList.uid === rule.uid
          );
          if (ruleItemIndex > -1) {
            item2.list[ruleItemIndex] = rule;
          } else {
            item2.list.push(rule);
          }
        });
    }
  }

  @action
  updateRuleList(listOfRules) {
    this.ruleList = listOfRules;
    console.log(toJS(this.ruleList));
    const fn = compose(values, groupBy(prop('groupId')))(listOfRules);
    const dis = fn.map(item => {
      return { groupId: item[0].groupId, phase: item[0].phase, list: item };
    });
    console.log(dis);
    this.groupList = dis;
  }

  @action
  deleteFromGroup(groupId) {
    this.groupList = this.groupList.filter(item => item.groupId !== groupId);
  }

  @action
  removeRuleFromList(uid, groupId) {
    this.ruleList = this.ruleList.filter(item => item.uid !== uid);
    // remove from group
    this.groupList.forEach(item => {
      if (item.groupId === groupId) {
        item.list = item.list.filter(listItem => listItem.uid !== uid);
      }
      return item;
    });
  }

  @action
  resetRuleList() {
    this.ruleList = [];
    this.groupList = [];
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
        }
        if (x.value) {
          if (typeof x.value === 'object') {
            x.value = '';
          }
        } else if (!x.value) {
          if (typeof x.assignment.value === 'object') {
            x.value = '';
          }
          // else {   x.value = x.assignment.value; }
        }
        return x;
      });
    });
    this.expandAdvancedSetting = [];
    nodes.map(() => {
      this.expandAdvancedSetting.push(false);
      this.expandImports.push(false);
    });
    // console.log('this.tabIndex', this.tabIndex);
    // console.log('this.expandAdvancedSetting', this.expandAdvancedSetting);
    console.log('tabsProperties: %o', this.tabsProperties.toJS());
  }

  @computed
  get configurationForm() {
    return this.tabIndex >= 0 ? this.tabsProperties[this.tabIndex] : null;
  }
}
