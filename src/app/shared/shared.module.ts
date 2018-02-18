import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';

import { PricePipe } from './price.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PricePipe
  ],
  providers: [
    CurrencyPipe,
    DecimalPipe
  ],
  exports: [
    CommonModule,
    PricePipe
  ]
})
export class SharedModule { }
