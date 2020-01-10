import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AlimentListComponent } from '../aliment-list/aliment-list.component';
import { CalculatorComponent } from '../calculator/calculator.component';

const appRouteList: Routes = [
  {
      path: 'aliments',
      component: AlimentListComponent
  },
  {
      path: 'calculator',
      component: CalculatorComponent
  },
  {
      path: '**',
      redirectTo: 'aliments'
  }
];

@NgModule({
  declarations: [],
  exports: [
    RouterModule
],
  imports: [
    RouterModule.forRoot(appRouteList),
    CommonModule
  ]
})
export class AppRoutingModule { }
