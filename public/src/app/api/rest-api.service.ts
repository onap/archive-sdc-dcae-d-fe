import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import { v4 as uuidGenarator } from 'uuid';
import { environment } from '../../environments/environment';
import { Store } from '../store/store';
import { cloneDeep } from 'lodash';
import { toJS } from 'mobx';

@Injectable()
export class RestApiService {
  options: RequestOptions;
  headers: Headers;
  baseUrl: string;

  constructor(private http: Http, public store: Store) {
    this.baseUrl = `${environment.apiBaseUrl}`;
  }

  addHeaders() {
    const userID =
      this.store.sdcParmas === undefined
        ? 'ym903w'
        : this.store.sdcParmas.userId;
    this.headers = new Headers({
      'Content-Type': 'application/json',
      USER_ID: userID
    });
    this.options = new RequestOptions({ headers: this.headers });
  }

  getVfcmtsForMigration(params) {
    this.addHeaders();
    const { contextType, uuid, version } = params;
    const url = `${
      this.baseUrl
    }/${contextType}/${uuid}/${version}/getVfcmtsForMigration`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .get(url, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        return Observable.throw(error.json() || 'Server error');
      });
  }

  getVfcmtReferenceData(vfcmtUUID) {
    this.addHeaders();
    const url = `${this.baseUrl}/getVfcmtReferenceData/${vfcmtUUID}`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .get(url, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  getFlowType() {
    this.addHeaders();
    const url = `${this.baseUrl}/conf/composition`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .get(url, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  createNewVFCMT(params) {
    this.addHeaders();
    const url = `${this.baseUrl}/createMC`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .post(url, params, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        return Observable.throw(error.json() || 'Server error');
      });
  }

  importVFCMT(params) {
    this.addHeaders();
    const url = `${this.baseUrl}/importMC`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .post(url, params, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        return Observable.throw(error.json() || 'Server error');
      });
  }

  getServiceInstances(serviceID) {
    this.addHeaders();
    const url = `${this.baseUrl}/service/${serviceID}`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .get(url, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        return Observable.throw(error.json() || 'Server error');
      });
  }

  getTemplateResources() {
    this.addHeaders();
    const url = `${this.baseUrl}/getResourcesByMonitoringTemplateCategory`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .get(url, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  getMonitoringComponents(params) {
    this.addHeaders();
    const { contextType, uuid, version } = params;
    const url = `${
      this.baseUrl
    }/${contextType}/${uuid}/${version}/monitoringComponents`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .get(url, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteMonitoringComponent(params, vfcmtUuid, vfiName) {
    this.addHeaders();
    const { contextType, uuid } = params;
    const url = `${
      this.baseUrl
    }/${contextType}/${uuid}/${vfiName}/${vfcmtUuid}/deleteVfcmtReference`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .delete(url, this.options)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteMonitoringComponentWithBlueprint(
    params,
    monitoringComponentName,
    vfcmtUuid,
    vfiName,
    submittedUuid
  ) {
    this.addHeaders();
    const { contextType, uuid } = params;
    const url = `${
      this.baseUrl
    }/${contextType}/${monitoringComponentName}/${uuid}/${vfiName}/${vfcmtUuid}/deleteVfcmtReference/${submittedUuid}`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .delete(url, this.options)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  getCompositionMonitoringComponent(vfcmtUuid) {
    this.addHeaders();
    const url = `${this.baseUrl}/getMC/${vfcmtUuid}`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .get(url, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  revertMC(params) {
    this.addHeaders();
    const {
      contextType,
      serviceUuid,
      vfiName,
      vfcmtUuid,
      submittedUuid
    } = params;
    const url = `${
      this.baseUrl
    }/${contextType}/${serviceUuid}/${vfiName}/${vfcmtUuid}/revert/${submittedUuid}`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .post(url, {}, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  saveMonitoringComponent(params) {
    this.addHeaders();
    const {
      contextType,
      serviceUuid,
      vfiName,
      vfcmtUuid,
      cdump,
      revertedUuid
    } = params;
    const fixedCdump = cloneDeep(toJS(cdump));
    fixedCdump.nodes.forEach(node =>
      node.properties.forEach(item => {
        if (item.value === '' && typeof item.assignment.value === 'object') {
          item.value = item.assignment.value;
        }
      })
    );
    const url = `${
      this.baseUrl
    }/${contextType}/${serviceUuid}/${vfiName}/saveComposition/${vfcmtUuid}`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .post(url, JSON.stringify(fixedCdump), this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  submitMonitoringComponent(params) {
    this.addHeaders();
    const { contextType, serviceUuid, vfiName, vfcmtUuid, flowType } = params;
    const url = `${
      this.baseUrl
    }/${contextType}/createBluePrint/${vfcmtUuid}/${serviceUuid}/${vfiName}`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .post(url, {}, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }
}
