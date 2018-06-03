import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forEach, sortBy } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import {
  descend,
  find,
  findIndex,
  groupBy,
  map,
  pipe,
  prop,
  propEq,
  sort
} from 'ramda';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { RestApiService } from '../api/rest-api.service';
import { Store } from '../store/store';

export const groupingData = pipe(
  groupBy(prop('name')),
  map(sort(descend(prop('version'))))
);

@Component({
  selector: 'app-general',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  newVfcmt = {
    name: null,
    description: null,
    template: null,
    flowType: null,
    vfni: null,
    isCloneVFCMT: false,
    isUpdateFlowType: false
  };
  isLatestVersion = true;
  vfniList = [];
  templates = [];
  serviceUUID: string;
  vfcmts = new Array();
  versions = new Array();
  result = new Array();
  flowTypes = new Array();
  selectedVfcmt;
  selectedVersion = null;
  importCompleted = false;
  disableName = false;
  disableDescription = false;
  disableFlowType = false;
  disableVnfiList = false;
  @Output() updateCdumpEv = new EventEmitter<string>();
  @ViewChild('generalForm') generalForm;
  list = [];

  constructor(
    private restApi: RestApiService,
    public store: Store,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    console.log('route mcid: ', this.route.snapshot.params.mcid);
    if (
      this.route.snapshot.params.mcid === 'import' ||
      this.route.snapshot.params.mcid === 'new'
    ) {
      this.store.generalflow = this.route.snapshot.params.mcid;
    } else {
      this.store.generalflow = 'edit';
      this.store.mcUuid = this.route.snapshot.params.mcid;
    }
    this.serviceUUID = this.route.snapshot.params.uuid;
  }

  onChangeTemplate(template) {
    console.log('flow template', template);
  }
  onChangeVfni(vfni) {
    console.log('vfni', vfni);
  }
  vfcmtChange(vfcmtName) {
    vfcmtName !== undefined
      ? (this.versions = this.result[vfcmtName])
      : ((this.versions = []), this.restForm());
    this.store.isEditMode = true;
    this.selectedVersion = null;
  }
  versionChange(version) {
    const versionIndex = findIndex(propEq('version', version))(this.versions);
    this.isLatestVersion = versionIndex === 0 ? true : false;
    const selectedVfcmtByVersion = find(
      propEq('version', version),
      this.result[this.selectedVfcmt]
    );
    this.newVfcmt.template = selectedVfcmtByVersion.uuid;
    this.restApi.getVfcmtReferenceData(selectedVfcmtByVersion.uuid).subscribe(
      success => {
        this.store.loader = false;
        console.log('vfcmt ref data:', success);
        this.store.isEditMode = false;
        this.getServiceRef(success);
      },
      error => {
        this.notifyError(error);
      },
      () => {
        this.store.loader = false;
      }
    );
  }
  private notifyError(error: any) {
    this.store.loader = false;
    console.log(error.notes);
    this.store.ErrorContent = Object.values(error.requestError);
    this.store.displayErrorDialog = true;
  }

  ngOnInit() {
    if (this.store.generalflow === 'edit') {
      this.store.loader = true;
      this.restApi
        .getCompositionMonitoringComponent(this.store.mcUuid)
        .subscribe(
          response => {
            this.newVfcmt = response.vfcmt;
            this.flowTypes.push(response.cdump.flowType);
            this.newVfcmt.flowType = response.cdump.flowType;
            this.store.flowType = response.cdump.flowType;
            this.newVfcmt.vfni = this.store.vfiName;
            this.vfniList.push({ resourceInstanceName: this.newVfcmt.vfni });
            this.updateCdumpEv.next(response.cdump);
            this.store.isEditMode = true;
            this.store.loader = false;

            this.list = response.cdump.relations.map(item => {
              return {
                name1: item.name1,
                name2: item.name2,
                p1: item.meta.p1,
                p2: item.meta.p2
              };
            });
          },
          error => {
            this.notifyError(error);
          }
        );
    } else if (this.store.generalflow === 'import') {
      this.store.loader = true;
      this.store.isEditMode = true;
      this.restApi
        .getVfcmtsForMigration({
          contextType: this.route.snapshot.params.contextType,
          uuid: this.route.snapshot.params.uuid,
          version: this.route.snapshot.params.version
        })
        .subscribe(
          success => {
            this.store.loader = false;
            this.result = groupingData(success);
            this.vfcmts = sortBy(Object.keys(this.result), name => name);
          },
          error => {
            this.notifyError(error);
          },
          () => {
            this.store.loader = false;
          }
        );
    } else if (this.route.snapshot.params.mcid === 'new') {
      // get template data for ddl
      const template$ = this.restApi.getTemplateResources();
      // get service vfi list for ddl '08ff91f1-9b57-4918-998b-4d2c98832815'
      const vfniList$ = this.restApi.getServiceInstances(this.serviceUUID);
      this.store.loader = true;
      forkJoin(template$, vfniList$).subscribe(
        success => {
          console.log('all', success);
          this.templates = success[0];
          this.vfniList = success[1].resources;
        },
        error => {
          this.notifyError(error);
        },
        () => {
          this.store.loader = false;
        }
      );
    }
  }

  private restForm() {
    this.newVfcmt = {
      name: null,
      description: null,
      template: null,
      flowType: null,
      vfni: null,
      isCloneVFCMT: false,
      isUpdateFlowType: false
    };
    const controls = this.generalForm.controls;
    forEach(controls, control => {
      control.markAsUntouched();
    });
  }

  private getServiceRef(data) {
    if (data.flowType !== undefined) {
      if (data.serviceUuid === this.serviceUUID) {
        this.newVfcmt.name = data.name;
        this.newVfcmt.description = data.description;
        this.disableName = true;
        this.disableDescription = true;
        this.setFlowType(data); // true
        this.setVfni(data);
        this.newVfcmt.isCloneVFCMT = false;
      } else {
        this.isCloneVfcmtToast();
        this.setFlowType(data); // true
        this.setVfni(data);
        this.newVfcmt.isCloneVFCMT = true;
      }
    } else {
      if (data.serviceUuid === this.serviceUUID && this.isLatestVersion) {
        this.newVfcmt.name = data.name;
        this.newVfcmt.description = data.description;
        this.disableName = true;
        this.disableDescription = true;
        this.newVfcmt.isCloneVFCMT = false;
        this.setFlowType(data); // true
        this.setVfni(data);
      } else {
        this.isCloneVfcmtToast();
        this.setFlowType(data); // true
        this.setVfni(data);
        this.newVfcmt.isCloneVFCMT = true;
      }
    }
  }

  private isCloneVfcmtToast() {
    this.toastr.warning(
      `<h3>The monitoring configuration is copied.</h3>
        <div>
          The selected VFCMT is assigned to a different
        </div>
        <div>
          service or has a newer version.
        </div>
      `,
      '',
      {
        enableHtml: true,
        // disableTimeOut: true
        timeOut: 10000
      }
    );
  }

  private setVfni(data: any) {
    if (data.serviceUuid !== this.serviceUUID) {
      this.getVfniList();
      this.disableVnfiList = false;
    } else {
      this.disableVnfiList = true;
      this.vfniList.push({ resourceInstanceName: data.vfiName });
      this.newVfcmt.vfni = data.vfiName;
    }
  }

  private setFlowType(data: any) {
    if (data.flowType === undefined) {
      this.newVfcmt.isUpdateFlowType = true;
      this.disableFlowType = false;
      this.getFlowTypeList();
    } else {
      this.newVfcmt.isUpdateFlowType = false;
      this.disableFlowType = true;
      this.flowTypes.push(data.flowType);
      this.newVfcmt.flowType = data.flowType;
    }
  }

  private getFlowTypeList() {
    this.restApi.getFlowType().subscribe(
      success => {
        console.log('flow types', success.flowTypes);
        this.flowTypes = success.flowTypes;
      },
      error => {
        this.notifyError(error);
      },
      () => {
        this.store.loader = false;
      }
    );
  }
  private getVfniList() {
    this.restApi.getServiceInstances(this.serviceUUID).subscribe(
      success => {
        console.log('vfni List', success);
        this.vfniList = success.resources;
      },
      error => {
        this.notifyError(error);
        return null;
      },
      () => {
        this.store.loader = false;
      }
    );
  }
}
