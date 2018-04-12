import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { RestApiService } from './rest-api.service';
import { v4 as genrateUuid } from 'uuid';

describe('RestApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [RestApiService]
    });
  });

  it(
    'should be created',
    inject([RestApiService], (service: RestApiService) => {
      expect(service).toBeTruthy();
    })
  );

  it('should genrate deffrent uuid each time for request id', () => {
    const firstUuid = genrateUuid();
    const secondUuid = genrateUuid();
    expect(firstUuid !== secondUuid).toBe(true);
  });
});
