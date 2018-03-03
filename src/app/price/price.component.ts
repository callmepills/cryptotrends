import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/switchMap';

import { CoinMarketCapService } from '../core/coin-market-cap.service';

const ONE_DAY = 24 * 60 * 60 * 1000;
const THREE_DAY = 3 * ONE_DAY;
const ONE_WEEK = 7 * ONE_DAY;
const ONE_MONTH = 30 * ONE_DAY;
const THREE_MONTH = 90 * ONE_DAY;
const ONE_YEAR = 365 * ONE_DAY;

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: [ './price.component.scss' ]
})
export class PriceComponent implements OnInit {
  model: any;

  constructor(private cmcService: CoinMarketCapService,
              private route: ActivatedRoute) {

  }

  ngOnInit() {
    Observable.combineLatest(this.route.paramMap, this.route.queryParamMap)
      .subscribe((data: any) => {
        const params = data[ 0 ];
        const queryParams = data[ 1 ];

        this.model = {
          cryptos: [],
          sortColumn: 'rank',
          sortOrder: 'asc',
          unit: params.get('unit')
        };

        const price = 'price_' + this.model.unit;

        this.cmcService.getCurrencies(100)
          .subscribe((currencies: any) => {
            const chartObersvables = currencies.map((currency, index) => {
              this.model.cryptos.push({
                id: currency.id,
                rank: currency.rank,
                name: currency.name,
                symbol: currency.symbol,
                price: currency[ price ]
              });

              return this.cmcService.getCharts(currency.id)
                .subscribe((charts: any) => {
                  this.loadDiffs(this.model.cryptos[ index ], charts[ price ].reverse());
                });
            });

            return Observable.forkJoin(chartObersvables);
          });
      });
  }

  loadDiffs(crypto: any, chart: Array<Array<number>>) {
    const currentTime = new Date().getTime();
    crypto.oneDayDiff = this.getHistoricDiff(chart, currentTime - ONE_DAY, crypto.price);
    crypto.threeDayDiff = this.getHistoricDiff(chart, currentTime - THREE_DAY, crypto.price);
    crypto.oneWeekDiff = this.getHistoricDiff(chart, currentTime - ONE_WEEK, crypto.price);
    crypto.oneMonthDiff = this.getHistoricDiff(chart, currentTime - ONE_MONTH, crypto.price);
    crypto.threeMonthDiff = this.getHistoricDiff(chart, currentTime - THREE_MONTH, crypto.price);
    crypto.oneYearDiff = this.getHistoricDiff(chart, currentTime - ONE_YEAR, crypto.price);
  }

  getHistoricDiff(chart: Array<Array<number>>, startTime: number, price: number) {
    const historicPrice = (chart.find(c => c[ 0 ] <= startTime));
    return historicPrice ? (price - historicPrice[ 1 ]) / historicPrice[ 1 ] * 100 : 0;
  }

  sort(column: string) {
    if (this.model.sortColumn === column) {
      this.model.sortOrder = this.model.sortOrder === 'desc' ? 'asc' : 'desc';
      this.model.cryptos.reverse();
    } else {
      this.model.sortColumn = column;
      this.model.sortOrder = 'asc';
      if (column === 'name') {
        this.model.cryptos.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        this.model.cryptos.sort((a, b) => a[ column ] - b[ column ]);
      }
    }
  }
}
