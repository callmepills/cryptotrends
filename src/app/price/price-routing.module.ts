import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PriceComponent } from './price.component';

const routes: Routes = [
  { path: 'price', component: PriceComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PriceRoutingModule {
}
