import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, async, inject } from '@angular/core/testing';
import {
  BaseRequestOptions,
  Http,
  HttpModule,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { v4 as genrateUuid } from 'uuid';
import { Store } from '../store/store';
import { RestApiService } from './rest-api.service';

describe('RestApiService', () => {
  let service: RestApiService;
  let backend: MockBackend;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpModule, HttpClientTestingModule],
        providers: [
          RestApiService,
          Store,
          MockBackend,
          BaseRequestOptions,
          {
            provide: Http,
            deps: [MockBackend, BaseRequestOptions],
            useFactory: (
              backend: XHRBackend,
              defaultOptions: BaseRequestOptions
            ) => {
              return new Http(backend, defaultOptions);
            }
          }
        ]
      });
      // Get the MockBackend
      backend = TestBed.get(MockBackend);
      service = TestBed.get(RestApiService);
    })
  );

  it(
    'should be created',
    inject([RestApiService], () => {
      expect(service).toBeTruthy();
    })
  );

  it('should baseUrl match localhost', () => {
    expect(service.baseUrl).toBe('http://localhost:8446');
  });

  it('should headers user id get default', () => {
    service.addHeaders();
    expect(service.headers.get('USER_ID')).toBe('ym903w');
  });

  it('should headers Content-Type json', () => {
    service.addHeaders();
    expect(service.headers.get('Content-Type')).toBe('application/json');
  });

  it(
    'should get service instance from API',
    async(() => {
      const serviceInstances = [
        {
          name: 'ciService669277f472b0',
          category: 'Mobility'
        }
      ];

      backend.connections.subscribe(connection => {
        connection.mockRespond(
          new Response(
            new ResponseOptions({
              body: JSON.stringify(serviceInstances)
            })
          )
        );
      });

      service.getServiceInstances('123456').subscribe(_res => {
        expect(_res.length).toBe(1);
        expect(_res).toEqual(serviceInstances);
      });
    })
  );

  it(
    'should get template resources from API',
    async(() => {
      const template = [
        {
          name: 'AviStone1234',
          version: '0.1'
        }
      ];

      backend.connections.subscribe(connection => {
        connection.mockRespond(
          new Response(
            new ResponseOptions({
              body: JSON.stringify(template)
            })
          )
        );
      });

      service.getTemplateResources().subscribe(_res => {
        expect(_res.length).toBe(1);
        expect(_res).toEqual(template);
      });
    })
  );

  it(
    'should getCompositionMonitoringComponent from API',
    async(() => {
      const template = [
        {
          name: 'AviStone1234',
          version: '0.1'
        }
      ];

      backend.connections.subscribe(connection => {
        connection.mockRespond(
          new Response(
            new ResponseOptions({
              body: JSON.stringify(template)
            })
          )
        );
      });

      service.getCompositionMonitoringComponent('123456').subscribe(_res => {
        expect(_res.length).toBe(1);
        expect(_res).toEqual(template);
      });
    })
  );

  it(
    'importVFCMT from API',
    async(() => {
      const template = [
        {
          name: 'AviStone1234',
          version: '0.1'
        }
      ];

      backend.connections.subscribe(connection => {
        connection.mockRespond(
          new Response(
            new ResponseOptions({
              body: JSON.stringify(template)
            })
          )
        );
      });

      service.importVFCMT({}).subscribe(_res => {
        expect(_res.length).toBe(1);
        expect(_res).toEqual(template);
      });
    })
  );

  it(
    'deleteMonitoringComponent from API',
    async(() => {
      const template = [
        {
          name: 'AviStone1234',
          version: '0.1'
        }
      ];

      backend.connections.subscribe(connection => {
        connection.mockRespond(
          new Response(
            new ResponseOptions({
              body: JSON.stringify(template)
            })
          )
        );
      });

      service
        .deleteMonitoringComponent(
          {
            contextType: 'service',
            uuid: '123456'
          },
          '45678',
          'liav'
        )
        .subscribe(_res => {
          console.log('delete', _res);
        });
    })
  );

  it(
    'deleteMonitoringComponentWithBlueprint from API',
    async(() => {
      const template = [
        {
          name: 'AviStone1234',
          version: '0.1'
        }
      ];

      backend.connections.subscribe(connection => {
        connection.mockRespond(
          new Response(
            new ResponseOptions({
              body: JSON.stringify(template)
            })
          )
        );
      });

      service
        .deleteMonitoringComponentWithBlueprint(
          {
            contextType: 'service',
            uuid: '123456'
          },
          'voskComp',
          '45678',
          'liav',
          '98765'
        )
        .subscribe(_res => {
          console.log('delete', _res);
        });
    })
  );

  it(
    'createNewVFCMT from API',
    async(() => {
      const template = [
        {
          name: 'AviStone1234',
          version: '0.1'
        }
      ];

      backend.connections.subscribe(connection => {
        connection.mockRespond(
          new Response(
            new ResponseOptions({
              body: JSON.stringify(template)
            })
          )
        );
      });

      service.createNewVFCMT({}).subscribe(_res => {
        expect(_res.length).toBe(1);
        expect(_res).toEqual(template);
      });
    })
  );

  // it(   'saveMonitoringComponent from API',   async(() => {     const template
  // = [       {         name: 'AviStone1234',         version: '0.1'       }
  // ];     backend.connections.subscribe(connection => {
  // connection.mockRespond(         new Response(           new ResponseOptions({
  //             body: JSON.stringify(template)           })         )       );
  //  });     service       .saveMonitoringComponent({         contextType:
  // 'service',         serviceUuid: '123456',         vfiName: 'liavVfi',
  // vfcmtUuid: '987456',         cdump: {}       })       .subscribe(_res => {
  //      expect(_res.length).toBe(1);         expect(_res).toEqual(template);
  //   });   }) );

  it(
    'submitMonitoringComponent from API',
    async(() => {
      const template = [
        {
          name: 'AviStone1234',
          version: '0.1'
        }
      ];

      backend.connections.subscribe(connection => {
        connection.mockRespond(
          new Response(
            new ResponseOptions({
              body: JSON.stringify(template)
            })
          )
        );
      });

      service
        .submitMonitoringComponent({
          contextType: 'service',
          serviceUuid: '123456',
          vfiName: 'liavVfi',
          vfcmtUuid: '987456',
          cdump: {},
          flowType: 'SNMP'
        })
        .subscribe(_res => {
          expect(_res.length).toBe(1);
          expect(_res).toEqual(template);
        });
    })
  );

  it(
    'should get Vfcmt Reference Data from API',
    async(() => {
      const template = [
        {
          name: 'AviStone1234',
          version: '0.1'
        }
      ];

      backend.connections.subscribe(connection => {
        connection.mockRespond(
          new Response(
            new ResponseOptions({
              body: JSON.stringify(template)
            })
          )
        );
      });

      service.getVfcmtReferenceData('123456').subscribe(_res => {
        expect(_res.length).toBe(1);
        expect(_res).toEqual(template);
      });
    })
  );

  it(
    'should get vfcmt list from API',
    async(() => {
      const dummyVfcmts = [
        {
          uuid: 'cba37ed8-94e1-406f-b4f5-b5edbc31ac85',
          name: 'CIe4d5a9b271d6'
        },
        {
          uuid: '64471437-8feb-40d9-a8b0-9407a81dd5c0',
          name: 'teSt.__.monitoring---TempLATE.6hnc'
        }
      ];

      backend.connections.subscribe(connection => {
        expect(connection.request.url).toMatch(
          'http://localhost:8446/service/123456/0.1/monitoringComponents'
        );
        connection.mockRespond(
          new Response(
            new ResponseOptions({
              body: JSON.stringify(dummyVfcmts)
            })
          )
        );
      });

      service
        .getMonitoringComponents({
          contextType: 'service',
          uuid: '123456',
          version: '0.1'
        })
        .subscribe(_res => {
          expect(_res.length).toBe(2);
          expect(_res).toEqual(dummyVfcmts);
        });
    })
  );

  it(
    'should get migration vfcmt list from API',
    async(() => {
      const dummyVfcmts = [
        {
          uuid: 'cba37ed8-94e1-406f-b4f5-b5edbc31ac85',
          name: 'CIe4d5a9b271d6'
        },
        {
          uuid: '64471437-8feb-40d9-a8b0-9407a81dd5c0',
          name: 'teSt.__.monitoring---TempLATE.6hnc'
        }
      ];

      backend.connections.subscribe(connection => {
        expect(connection.request.url).toMatch(
          'http://localhost:8446/service/123456/0.1/getVfcmtsForMigration'
        );
        connection.mockRespond(
          new Response(
            new ResponseOptions({
              body: JSON.stringify(dummyVfcmts)
            })
          )
        );
      });

      service
        .getVfcmtsForMigration({
          contextType: 'service',
          uuid: '123456',
          version: '0.1'
        })
        .subscribe(_res => {
          expect(_res.length).toBe(2);
          expect(_res).toEqual(dummyVfcmts);
        });
    })
  );

  it(
    'should get flow type from API',
    async(() => {
      const flowType = ['syslog', 'SNMP'];

      backend.connections.subscribe(connection => {
        expect(connection.request.url).toMatch(
          'http://localhost:8446/conf/composition'
        );
        connection.mockRespond(
          new Response(
            new ResponseOptions({
              body: JSON.stringify(flowType)
            })
          )
        );
      });

      service.getFlowType().subscribe(_res => {
        expect(_res.length).toBe(2);
        expect(_res).toEqual(flowType);
      });
    })
  );

  it('should genrate deffrent uuid each time for request id', () => {
    const firstUuid = genrateUuid();
    const secondUuid = genrateUuid();
    expect(firstUuid !== secondUuid).toBe(true);
  });
});
