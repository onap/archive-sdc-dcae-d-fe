import { Injectable, EventEmitter } from '@angular/core';
import {
  Http,
  Response,
  Headers,
  RequestOptions,
  URLSearchParams
} from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment } from '../../../environments/environment';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RuleEngineApiService {
  options: RequestOptions;
  headers: Headers;
  baseUrl: string;
  vfcmtUuid: string;
  dcaeCompName: string;
  nid: string;
  configParam: string;
  flowType: string;
  editorData: Subject<any> = new Subject();
  updateVersionLock: Subject<any> = new Subject();

  constructor(private http: Http) {
    this.baseUrl = `${environment.apiBaseUrl}/rule-editor`;
  }

  setParams(params) {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      USER_ID: params.userId
    });
    this.options = new RequestOptions({ headers: this.headers });
    this.vfcmtUuid = params.vfcmtUuid;
    this.dcaeCompName = params.nodeName;
    this.nid = params.nodeId;
    this.configParam = params.fieldName;
    this.flowType = params.flowType;
  }

  setFieldName(name) {
    this.configParam = name;
  }

  getMetaData() {
    const url = `${this.baseUrl}/list-events-by-versions`;
    this.options.headers.set('X-ECOMP-RequestID', uuid());
    return this.http
      .get(url, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().requestError || 'Server error')
      );
  }

  getSchema(version, eventType) {
    const url = `${this.baseUrl}/definition/${version}/${eventType}`;
    this.options.headers.set('X-ECOMP-RequestID', uuid());
    return this.http
      .get(url, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().requestError || 'Server error')
      );
  }

  getListOfRules(): Observable<any> {
    const url = `${this.baseUrl}/rule/${this.vfcmtUuid}/${this.dcaeCompName}/${
      this.nid
    }/${this.configParam}`;
    this.options.headers.set('X-ECOMP-RequestID', uuid());
    return this.http
      .get(url, this.options)
      .map(response => response.json())
      .catch((error: any) => {
        return Observable.throw(error.json().requestError || 'Server error');
      });
  }

  modifyRule(newRole) {
    const url = `${this.baseUrl}/rule/${this.vfcmtUuid}/${this.dcaeCompName}/${
      this.nid
    }/${this.configParam}`;
    this.options.headers.set('X-ECOMP-RequestID', uuid());
    return this.http
      .post(url, newRole, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        return Observable.throw(error.json().requestError || 'Server error');
      });
  }

  deleteRule(uid) {
    const url = `${this.baseUrl}/rule/${this.vfcmtUuid}/${this.dcaeCompName}/${
      this.nid
    }/${this.configParam}/${uid}`;
    this.options.headers.set('X-ECOMP-RequestID', uuid());
    return this.http
      .delete(url, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        return Observable.throw(error.json().requestError || 'Server error');
      });
  }

  translate() {
    const url = `${this.baseUrl}/rule/translate/${this.vfcmtUuid}/${
      this.dcaeCompName
    }/${this.nid}/${this.configParam}`;
    this.options.headers.set('X-ECOMP-RequestID', uuid());
    const params = new URLSearchParams();
    params.append('flowType', this.flowType);
    const options = { ...this.options, params: params };
    return this.http
      .get(url, options)
      .map(response => response.json())
      .catch((error: any) => {
        return Observable.throw(error.json().requestError || 'Server error');
      });
  }

  passDataToEditor(data) {
    this.editorData.next(data);
  }

  callUpdateVersionLock() {
    this.updateVersionLock.next();
  }
}
