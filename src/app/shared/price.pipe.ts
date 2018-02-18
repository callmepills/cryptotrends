import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  constructor(private decimalPipe: DecimalPipe,
              private currencyPipe: CurrencyPipe) {

  }

  transform(value: any, args?: any): any {
    if (args === 'btc') {
      return this.decimalPipe.transform(value, '1.8-8');
    } else {
      return this.currencyPipe.transform(value, args.toUpperCase());
    }
  }

}
