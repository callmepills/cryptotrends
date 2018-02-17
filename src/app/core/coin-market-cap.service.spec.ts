import { TestBed, inject } from '@angular/core/testing';

import { CoinMarketCapService } from './coin-market-cap.service';

describe('CoinMarketCapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoinMarketCapService]
    });
  });

  it('should be created', inject([CoinMarketCapService], (service: CoinMarketCapService) => {
    expect(service).toBeTruthy();
  }));
});
