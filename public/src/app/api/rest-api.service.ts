import { Injectable } from '@angular/core';
import {
  Http,
  Response,
  Headers,
  RequestOptions,
  URLSearchParams
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { environment } from '../../environments/environment';
import { v4 as uuidGenarator } from 'uuid';

@Injectable()
export class RestApiService {
  options: RequestOptions;
  headers: Headers;
  baseUrl: string;

  constructor(private http: Http) {
    this.baseUrl = `${environment.apiBaseUrl}`;
    this.headers = new Headers({
      'Content-Type': 'application/json',
      USER_ID: 'ym903w'
    });
    this.options = new RequestOptions({ headers: this.headers });
  }

  getVfcmtsForMigration(params) {
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
    const url = `${this.baseUrl}/getVfcmtReferenceData/${vfcmtUUID}`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .get(url, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  getFlowType() {
    const url = `${this.baseUrl}/conf/composition`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .get(url, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  createNewVFCMT(params) {
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
    const url = `${this.baseUrl}/getResourcesByMonitoringTemplateCategory`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .get(url, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  getMonitoringComponents(params) {
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
    const { contextType, uuid } = params;
    const url = `${
      this.baseUrl
    }/${contextType}/${uuid}/${vfiName}/${vfcmtUuid}/deleteVfcmtReference`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .delete(url, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteMonitoringComponentWithBlueprint(
    params,
    monitoringComponentName,
    vfcmtUuid,
    vfiName
  ) {
    const { contextType, uuid } = params;
    const url = `${
      this.baseUrl
    }/${contextType}/${monitoringComponentName}/${uuid}/${vfiName}/${vfcmtUuid}/deleteVfcmtReference`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .delete(url, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  getCompositionMonitoringComponent(vfcmtUuid) {
    const url = `${this.baseUrl}/getMC/${vfcmtUuid}`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .get(url, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  saveMonitoringComponent(params) {
    const { contextType, serviceUuid, vfiName, vfcmtUuid, cdump } = params;
    const url = `${
      this.baseUrl
    }/${contextType}/${serviceUuid}/${vfiName}/saveComposition/${vfcmtUuid}`;
    this.options.headers.set('X-ECOMP-RequestID', uuidGenarator());
    return this.http
      .post(url, cdump, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  submitMonitoringComponent(params) {
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
