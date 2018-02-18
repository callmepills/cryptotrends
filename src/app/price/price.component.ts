import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
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
          cryptos: []
        };

        this.model.unit = params.get('unit');
        const price = 'price_' + this.model.unit;

        this.cmcService.getCurrencies(queryParams.get('limit') || 10)
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
                  this.loadPricesAndDiffs(this.model.cryptos[ index ], charts[ price ].reverse());
                });
            });

            return Observable.forkJoin(chartObersvables);
          });
      });
  }

  loadPricesAndDiffs(crypto: any, chart: Array<Array<number>>) {
    const currentTime = new Date().getTime();
    crypto.oneDayPrice = this.getHistoricPrice(chart, currentTime - ONE_DAY);
    crypto.oneDayDiff = this.getHistoricDiff(crypto.price, crypto.oneDayPrice);
    crypto.threeDayPrice = this.getHistoricPrice(chart, currentTime - THREE_DAY);
    crypto.threeDayDiff = this.getHistoricDiff(crypto.price, crypto.threeDayPrice);
    crypto.oneWeekPrice = this.getHistoricPrice(chart, currentTime - ONE_WEEK);
    crypto.oneWeekDiff = this.getHistoricDiff(crypto.price, crypto.oneWeekPrice);
    crypto.oneMonthPrice = this.getHistoricPrice(chart, currentTime - ONE_MONTH);
    crypto.oneMonthDiff = this.getHistoricDiff(crypto.price, crypto.oneMonthPrice);
    crypto.threeMonthPrice = this.getHistoricPrice(chart, currentTime - THREE_MONTH);
    crypto.threeMonthDiff = this.getHistoricDiff(crypto.price, crypto.threeMonthPrice);
    crypto.oneYearPrice = this.getHistoricPrice(chart, currentTime - ONE_YEAR);
    crypto.oneYearDiff = this.getHistoricDiff(crypto.price, crypto.oneYearPrice);
  }

  getHistoricPrice(chart: Array<Array<number>>, startTime: number) {
    return (chart.find(c => c[ 0 ] <= startTime) || chart[ chart.length - 1 ])[ 1 ];
  }

  getHistoricDiff(currentPrice: number, historicPrice: number) {
    return (currentPrice - historicPrice) / historicPrice * 100;
  }

  sort(column: string) {
    if (this.model.sortColumn === column) {
      this.model.sortOrder = this.model.sortOrder === 'desc' ? 'asc' : 'desc';
      this.model.cryptos.reverse();
    } else {
      this.model.sortColumn = column;
      this.model.sortOrder = 'desc';
      this.model.cryptos.sort((a, b) => b[ column ] - a[ column ]);
    }
  }
}
