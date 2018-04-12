import { Injectable } from '@angular/core';

interface HostParams {
  readonly userId: string;
  readonly contextType: string;
  readonly vfcmtUuid: string;
  readonly lifecycleState: string;
  readonly isOwner: string;
}

@Injectable()
export class HostService {
  /* Public Members */
  public static getParams(): HostParams {
    return this.getQueryParamsObj(window.location.hash) as HostParams;
  }

  public static disableLoader(): void {
    this.postMessage('READY', null);
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
      .substring(7) // removes '?' that always appears as prefix to the query-string
      .split('&') // splits query-string to "key=value" strings
      .map(p => p.split('=')) // splits each "key=value" string to [key,value] array
      .reduce((res, p) => {
        // converts to a dictionary (object) of params
        res[p[0]] = p[1];
        return res;
      }, {});
  }
}
