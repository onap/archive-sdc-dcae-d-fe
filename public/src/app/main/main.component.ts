import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RestApiService } from '../api/rest-api.service';
import { Store } from '../store/store';
import { RuleFrameComponent } from '../rule-frame/rule-frame.component';
import { GeneralComponent } from '../general/general.component';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'app-main',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  cdump;
  nodes = [];
  @ViewChild(GeneralComponent) generalComponent: GeneralComponent;
  // @ViewChildren(RuleFrameComponent) ruleFrameRef: QueryList<RuleFrameComponent>;

  constructor(
    private route: ActivatedRoute,
    private restApi: RestApiService,
    private toastr: ToastrService,
    public store: Store,
    private location: Location
  ) {
    this.route.snapshot.params.mcid === 'import'
      ? (this.store.generalflow = 'import')
      : (this.store.generalflow = 'new');
  }

  goBack() {
    this.location.back();
  }

  createMC(params) {
    console.log('newVfcmt: %o', params);
    this.store.loader = true;
    this.restApi
      .createNewVFCMT({
        name: params.name,
        description: params.description,
        templateUuid: params.template,
        vfiName: params.serviceAttached,
        serviceUuid: this.route.snapshot.params.uuid,
        contextType: this.route.snapshot.params.contextType,
        flowType: 'default'
      })
      .subscribe(
        success => {
          console.log(success);
          this.store.mcUuid = success.vfcmt.uuid;
          console.log(this.cleanProperty(success));
          this.store.cdump = success.cdump;
          this.nodes = this.store.cdump.nodes;
          this.store.setTabsProperties(this.nodes);
          this.setDataFromMapToRuleEngine(success.cdump);
          this.store.loader = false;
          this.store.isEditMode = true;
        },
        error => {
          this.store.loader = false;
          console.log(error.notes);
          this.store.ErrorContent = Object.values(error.requestError);
          this.store.displayErrorDialog = true;
        }
      );
  }

  updateCdump(cdump) {
    this.store.cdump = cdump;
    this.nodes = this.store.cdump.nodes;
    this.store.setTabsProperties(this.nodes);
    this.setDataFromMapToRuleEngine(cdump);
  }

  importMC(params) {
    console.log('importVfcmt: %o', params);
    this.generalComponent.importCompleted = true;
    this.store.loader = true;
    this.restApi
      .importVFCMT({
        name: params.name,
        description: params.description,
        templateUuid: params.template,
        vfiName: params.vfni,
        serviceUuid: this.route.snapshot.params.uuid,
        contextType: this.route.snapshot.params.contextType,
        flowType: params.flowType,
        cloneVFCMT: params.isCloneVFCMT,
        updateFlowType: params.isUpdateFlowType
      })
      .subscribe(
        success => {
          console.log(success);
          this.location.path();
          // this.location.go();
          this.store.mcUuid = success.vfcmt.uuid;
          console.log(this.cleanProperty(success));
          this.store.cdump = success.cdump;
          this.nodes = this.store.cdump.nodes;
          this.store.setTabsProperties(this.nodes);
          this.setDataFromMapToRuleEngine(success.cdump);
          this.store.generalflow = 'edit';
          this.store.loader = false;
          this.store.isEditMode = true;
        },
        error => {
          this.store.loader = false;
          console.log(error.notes);
          this.store.ErrorContent = Object.values(error.requestError);
          this.store.displayErrorDialog = true;
        }
      );
  }

  setDataFromMapToRuleEngine(cdump) {
    this.store.tabParmasForRule = cdump.nodes
      .filter(x => x.name.includes('map'))
      .map(y => {
        return {
          name: y.name,
          nid: y.nid
        };
      });
  }

  cleanProperty(response) {
    return response.cdump.nodes.map(node => {
      const t = node.properties.filter(item =>
        item.hasOwnProperty('assignment')
      );
      node.properties = t;
      return node;
    });
  }

  saveCDUMP() {
    debugger;
    this.store.loader = true;
    this.restApi
      .saveMonitoringComponent({
        contextType: this.store.sdcParmas.contextType,
        serviceUuid: this.store.sdcParmas.uuid,
        vfiName: this.generalComponent.newVfcmt.vfni,
        vfcmtUuid: this.store.mcUuid,
        flowType: this.generalComponent.newVfcmt.flowType,
        cdump: this.store.cdump
      })
      .subscribe(
        success => {
          this.store.loader = false;
          this.store.mcUuid = success.uuid;
          this.toastr.success('', 'Save succeeded');
        },
        error => {
          this.store.loader = false;
          console.log(error.notes);
          this.store.ErrorContent = Object.values(error.requestError);
          this.store.displayErrorDialog = true;
        },
        () => {}
      );
  }

  saveAndCreateBlueprint() {
    debugger;
    this.store.loader = true;
    if (this.store.cdumpIsDirty) {
      this.restApi
        .saveMonitoringComponent({
          contextType: this.store.sdcParmas.contextType,
          serviceUuid: this.store.sdcParmas.uuid,
          vfiName: this.generalComponent.newVfcmt.vfni,
          vfcmtUuid: this.store.mcUuid,
          cdump: this.store.cdump
        })
        .subscribe(
          success => {
            this.store.loader = false;
            this.store.mcUuid = success.uuid;
            this.submitBlueprint();
          },
          error => {
            this.store.loader = false;
            console.log(error.notes);
            this.store.ErrorContent = Object.values(error.requestError);
            this.store.displayErrorDialog = true;
          },
          () => {}
        );
    } else {
      this.submitBlueprint();
    }
  }

  submitBlueprint() {
    this.store.loader = true;
    this.restApi
      .submitMonitoringComponent({
        contextType: this.store.sdcParmas.contextType,
        serviceUuid: this.store.sdcParmas.uuid,
        vfiName: this.generalComponent.newVfcmt.vfni,
        vfcmtUuid: this.store.mcUuid,
        flowType: this.store.cdump.flowType
      })
      .subscribe(
        success => {
          this.store.loader = false;
          this.toastr.success('', 'Save succeeded');
        },
        error => {
          this.store.loader = false;
          console.log(error.notes);
          this.store.ErrorContent = Object.values(error.requestError);
          this.store.displayErrorDialog = true;
        },
        () => {}
      );
  }

  handleChange(e) {
    this.store.setTabIndex(e.index - 1);
  }
}
