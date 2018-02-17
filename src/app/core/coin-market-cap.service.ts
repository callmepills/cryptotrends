import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CoinMarketCapService {

  constructor(private http: HttpClient) {

  }

  getCurrenices() {
    return this.http.get('/api/v1/ticker/?limit=10');
  }

  getCharts(id: string) {
    return this.http.get(`/graphs2/currencies/${id}/`);
  }
}
