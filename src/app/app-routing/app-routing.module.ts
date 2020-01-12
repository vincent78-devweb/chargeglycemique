import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AlimentListComponent } from '../components/aliment/aliment-list/aliment-list.component';
import { CalculatorComponent } from '../components/calculator/calculator.component';
import { MealListComponent } from '../components/meal/meal-list/meal-list.component';
import { MealDetailComponent } from '../components/meal/meal-detail/meal-detail.component';

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
    path: 'meals',
    component: MealListComponent
},
{
  path: 'meal/:meal.id',
  component: MealDetailComponent
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
