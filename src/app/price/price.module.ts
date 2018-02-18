import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceRoutingModule } from './price-routing.module';
import { PriceComponent } from './price.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    PriceRoutingModule,
    SharedModule
  ],
  declarations: [
    PriceComponent
  ]
})
export class PriceModule { }
