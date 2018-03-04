import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceRoutingModule } from './price-routing.module';
import { PriceComponent } from './price.component';
import { DiffComponent } from './diff/diff.component';

@NgModule({
  imports: [
    CommonModule,
    PriceRoutingModule
  ],
  declarations: [
    PriceComponent,
    DiffComponent
  ]
})
export class PriceModule { }
