// import {APP_BASE_HREF} from '@angular/common'; import {ComponentFixture,
// TestBed, async} from '@angular/core/testing'; import {FormsModule} from
// '@angular/forms'; import {BaseRequestOptions, Http, HttpModule, XHRBackend}
// from '@angular/http'; import {MockBackend} from '@angular/http/testing';
// import {ActivatedRoute} from '@angular/router'; import {NgSelectModule} from
// '@ng-select/ng-select'; import {sortBy} from 'lodash'; import {ToastrModule,
// ToastrService} from 'ngx-toastr'; import {FeatherIconsPipe} from
// '../api/feather-pipe'; import {RestApiService} from
// '../api/rest-api.service'; import {DiagramComponent} from
// '../diagram/diagram.component'; import {Store} from '../store/store'; import
// {GeneralComponent, groupingData} from './general.component'; const data = [
// {     name: 'avi',     version: '2.0'   }, {     name: 'stone',     version:
// '0.9'   }, {     name: 'avi',     version: '2.1'   }, {     name: 'vosk',
// version: '0.1'   }, {     name: 'liav',     version: '0.5'   } ]; const
// sortedMatchVfcmtList = ['avi', 'liav', 'stone', 'vosk']; const
// sortedVersionInGroup = [   {     name: 'avi',     version: '2.1'   }, {
// name: 'avi',     version: '2.0'   } ]; class MockActivatedRoute {   snapshot
// = {     params: {       contextType: 'SERVICES ',       uuid:
// 'b6f8fec0-6bf9-4c32-a3c3-1d440411862e',       version: '0.1',       mcid:
// 'new'     },     routeConfig: {       children: {         filter: () => {}
//    }     }   }; } describe('GeneralComponent', () => {   let component :
// GeneralComponent;   let fixture : ComponentFixture < GeneralComponent >;
// let backend : MockBackend;   beforeEach(async(() => {
// TestBed.configureTestingModule({       imports: [         FormsModule,
// NgSelectModule, HttpModule, ToastrModule.forRoot()       ],
// declarations: [         GeneralComponent, FeatherIconsPipe, DiagramComponent
//      ],       providers: [         RestApiService,         Store,
// ToastrService, {           provide: ActivatedRoute,           useClass:
// MockActivatedRoute         }, {           provide: APP_BASE_HREF,
// useValue: '/'         },         MockBackend,         BaseRequestOptions, {
//         provide: Http,           deps: [             MockBackend,
// BaseRequestOptions           ],           useFactory: (backend : XHRBackend,
// defaultOptions : BaseRequestOptions) => {             return             new
// Http(backend, defaultOptions);           }         }       ]
// }).compileComponents();     backend = TestBed.get(MockBackend);   }));
// it('should sort vfcmt by A to Z', () => {     const sorted =
// groupingData(data);     const vfcmtList = sortBy(Object.keys(sorted), name =>
// name);     expect(vfcmtList).toEqual(sortedMatchVfcmtList);   });
// it('should group vfcmt by name', () => {     const sorted =
// groupingData(data);     expect(Object.keys(sorted)).toEqual(['avi', 'stone',
// 'vosk', 'liav']);   });   it('should version array be sorted in group', () =>
// {     const sorted = groupingData(data);
// expect(Object.values(sorted)[0]).toEqual(sortedVersionInGroup);   }); });
