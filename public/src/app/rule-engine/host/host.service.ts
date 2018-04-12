import { Injectable } from '@angular/core';
import { HostParams } from './host-params';
import { ExitMode } from './exit-mode.enum';

@Injectable()
export class HostService {
  /* Public Members */

  public static getParams(): HostParams {
    return this.getQueryParamsObj(window.location.search) as HostParams;
  }

  public static enterModifyRule(): void {
    this.postMessage('modifyRule', null);
  }

  public static exitModifyRule(): void {
    this.postMessage('ruleList', null);
  }

  public static disableLoader(): void {
    this.postMessage('disable-loader', null);
  }

  public static exit(mode: ExitMode, data: string): void {
    if (mode === ExitMode.Cancel) {
      this.postMessage('exit', null);
    } else if (mode === ExitMode.Done) {
      this.postMessage('exit', data);
    }
  }

  /* Private Methods */

  private static postMessage(eventName: string, data: string): void {
    window.parent.postMessage(
      {
        type: eventName,
        data: data
      },
      '*'
    );
  }

  private static getQueryParamsObj(query: string): object {
    return query
      .substring(1) // removes '?' that always appears as prefix to the query-string
      .split('&') // splits query-string to "key=value" strings
      .map(p => p.split('=')) // splits each "key=value" string to [key,value] array
      .reduce((res, p) => {
        // converts to a dictionary (object) of params
        res[p[0]] = p[1];
        return res;
      }, {});
  }
}
