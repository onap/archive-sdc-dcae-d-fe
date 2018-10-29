import { Injectable } from '@angular/core';
import {
  Headers,
  Http,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import 'rxjs/add/operator/catch';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { v4 as uuid } from 'uuid';
import { environment } from '../../../environments/environment';

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
  currentTab: Subject<any> = new BehaviorSubject(-1);
  tabIndex = this.currentTab.asObservable();

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

  getLatestMcUuid(params) {
    const { contextType, serviceUuid, vfiName, vfcmtUuid } = params;
    const url = `${
      environment.apiBaseUrl
    }/${contextType}/${serviceUuid}/${vfiName}/${vfcmtUuid}/getLatestMcUuid`;
    this.options.headers.set('X-ECOMP-RequestID', uuid());
    return this.http
      .get(url, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        return Observable.throw(error.json().requestError || 'Server error');
      });
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

  getInitialPhases(flowType): Observable<any> {
    const url = `${environment.apiBaseUrl}/conf/getPhases/${flowType}`;
    this.options.headers.set('X-ECOMP-RequestID', uuid());
    return this.http
      .get(url, this.options)
      .map(response => response.json())
      .catch((error: any) => {
        return Observable.throw(error.json().requestError || 'Server error');
      });
  }

  exportRules() {
    const url = `${this.baseUrl}/export/${this.vfcmtUuid}/${
      this.dcaeCompName
    }/${this.nid}/${this.configParam}`;
    console.log(url);
    const link = document.createElement('a');
    link.download = 'a';
    link.href = url;
    document.body.appendChild(link);
    link.click();
  }

  importRules(rule, vfcmtUuid, isGroup) {
    const url = `${this.baseUrl}/import/${vfcmtUuid}/${this.dcaeCompName}/${
      this.nid
    }/${this.configParam}/${isGroup}`;
    this.options.headers.set('X-ECOMP-RequestID', uuid());
    return this.http
      .post(url, rule, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        return Observable.throw(error.json() || 'Server error');
      });
  }

  importPhase(ruleList) {
    const url = `${this.baseUrl}/importPhase`;

    Object.assign(ruleList, {
      vfcmtUuid: this.vfcmtUuid,
      dcaeCompLabel: this.dcaeCompName,
      nid: this.nid,
      configParam: this.configParam
    });

    this.options.headers.set('X-ECOMP-RequestID', uuid());
    return this.http
      .post(url, ruleList, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        return Observable.throw(error.json().requestError || 'Server error');
      });
  }

  applyFilter(newFilter) {
    const url = `${this.baseUrl}/applyFilter`;

    Object.assign(newFilter, {
      vfcmtUuid: this.vfcmtUuid,
      dcaeCompLabel: this.dcaeCompName,
      nid: this.nid,
      configParam: this.configParam
    });

    this.options.headers.set('X-ECOMP-RequestID', uuid());
    return this.http
      .post(url, newFilter, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        return Observable.throw(error.json().requestError || 'Server error');
      });
  }

  deleteFilter(vfcmtUuid) {
    const deleteFilter = {
      vfcmtUuid: vfcmtUuid,
      dcaeCompLabel: this.dcaeCompName,
      nid: this.nid,
      configParam: this.configParam
    };
    const url = `${this.baseUrl}/deleteFilter`;
    this.options.headers.set('X-ECOMP-RequestID', uuid());
    return this.http
      .post(url, deleteFilter, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        return Observable.throw(error.json().requestError || 'Server error');
      });
  }

  modifyRule(newRole, vfcmtUuid) {
    const url = `${this.baseUrl}/rule/${vfcmtUuid}/${this.dcaeCompName}/${
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

  deleteRule(uid, vfcmtUuid) {
    const url = `${this.baseUrl}/rule/${vfcmtUuid}/${this.dcaeCompName}/${
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

  deleteGroup(groupId, vfcmtUuid) {
    const url = `${this.baseUrl}/group/${vfcmtUuid}/${this.dcaeCompName}/${
      this.nid
    }/${this.configParam}/${groupId}`;
    this.options.headers.set('X-ECOMP-RequestID', uuid());
    return this.http
      .delete(url, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        return Observable.throw(error.json().requestError || 'Server error');
      });
  }

  translate(entryPhase, publishPhase, vfcmtUuid) {
    const url = `${this.baseUrl}/rule/translate`;
    const params = {
      vfcmtUuid: vfcmtUuid,
      dcaeCompLabel: this.dcaeCompName,
      nid: this.nid,
      configParam: this.configParam,
      entryPhase: entryPhase,
      publishPhase: publishPhase
    };
    this.options.headers.set('X-ECOMP-RequestID', uuid());
    // const params = new URLSearchParams(); params.append('flowType',
    // this.flowType); const options = {   ...this.options,   params: params };
    return this.http
      .post(url, params, this.options)
      .map(response => response.json())
      .catch((error: any) => {
        return Observable.throw(error.json().requestError || 'Server error');
      });
  }

  generateMappingRulesFileName(dcaeCompLabel, nid, vfcmtUuid) {
    const url = `${
      this.baseUrl
    }/getExistingRuleTargets/${vfcmtUuid}/${dcaeCompLabel}/${nid}`;
    this.options.headers.set('X-ECOMP-RequestID', uuid());
    const params = new URLSearchParams();
    return this.http
      .get(url, this.options)
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

  callUpdateTabIndex(index) {
    this.currentTab.next(index);
  }
}
