import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceRoutingModule } from './price-routing.module';
import { PriceComponent } from './price.component';

@NgModule({
  imports: [
    CommonModule,
    PriceRoutingModule
  ],
  declarations: [
    PriceComponent
  ]
})
export class PriceModule { }
