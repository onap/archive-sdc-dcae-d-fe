import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { RuleEngineApiService } from './rule-engine-api.service';

describe('RuleEngineApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [RuleEngineApiService]
    });
  });

  it(
    'should be created',
    inject([RuleEngineApiService], (service: RuleEngineApiService) => {
      expect(service).toBeTruthy();
    })
  );
});
