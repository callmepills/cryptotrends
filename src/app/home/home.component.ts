import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { CoinMarketCapService } from '../core/coin-market-cap.service';

const ONE_DAY = 24 * 60 * 60 * 1000;
const THREE_DAY = 3 * ONE_DAY;
const ONE_WEEK = 7 * ONE_DAY;
const ONE_MONTH = 30 * ONE_DAY;
const THREE_MONTH = 90 * ONE_DAY;
const ONE_YEAR = 365 * ONE_DAY;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit {
  model: any;

  constructor(private cmcService: CoinMarketCapService) {

  }

  ngOnInit() {
    this.model = {
      cryptos: []
    };

    this.cmcService.getCurrenices()
      .subscribe((currencies: any) => {
        const chartObersvables = currencies.map((currency, index) => {
          this.model.cryptos.push({
            id: currency.id,
            rank: currency.rank,
            name: currency.name,
            symbol: currency.symbol,
            btcPrice: currency.price_btc,
            usdPrice: currency.price_usd
          });

          return this.cmcService.getCharts(currency.id)
            .subscribe((charts: any) => {
              this.loadPricesAndDiffs(this.model.cryptos[ index ], charts.price_btc.reverse());
            });
        });

        return Observable.forkJoin(chartObersvables);
      });
  }

  loadPricesAndDiffs(crypto: any, chart: Array<Array<number>>) {
    const currentTime = new Date().getTime();
    crypto.oneDayPrice = this.getHistoricPrice(chart, currentTime - ONE_DAY);
    crypto.oneDayDiff = this.getHistoricDiff(crypto.btcPrice, crypto.oneDayPrice);
    crypto.threeDayPrice = this.getHistoricPrice(chart, currentTime - THREE_DAY);
    crypto.threeDayDiff = this.getHistoricDiff(crypto.btcPrice, crypto.threeDayPrice);
    crypto.oneWeekPrice = this.getHistoricPrice(chart, currentTime - ONE_WEEK);
    crypto.oneWeekDiff = this.getHistoricDiff(crypto.btcPrice, crypto.oneWeekPrice);
    crypto.oneMonthPrice = this.getHistoricPrice(chart, currentTime - ONE_MONTH);
    crypto.oneMonthDiff = this.getHistoricDiff(crypto.btcPrice, crypto.oneMonthPrice);
    crypto.threeMonthPrice = this.getHistoricPrice(chart, currentTime - THREE_MONTH);
    crypto.threeMonthDiff = this.getHistoricDiff(crypto.btcPrice, crypto.threeMonthPrice);
    crypto.oneYearPrice = this.getHistoricPrice(chart, currentTime - ONE_YEAR);
    crypto.oneYearDiff = this.getHistoricDiff(crypto.btcPrice, crypto.oneYearPrice);
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
      this.model.cryptos.sort((a, b) => b[column] - a[column]);
    }
  }
}
