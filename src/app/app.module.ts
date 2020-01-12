import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {DemoMaterialModule} from './material-module';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';
import 'hammerjs';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { AlimentListComponent } from './components/aliment/aliment-list/aliment-list.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { MealListComponent } from './components/meal/meal-list/meal-list.component';
import { MealCreateDialogComponent } from './components/meal/meal-create-dialog/meal-create-dialog.component';
import { MealDetailComponent } from './components/meal/meal-detail/meal-detail.component'

@NgModule({
  declarations: [
    AppComponent,
    AlimentListComponent,
    CalculatorComponent,
    MealCreateDialogComponent,
    MealListComponent,
    MealDetailComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    MatTabsModule,
    BrowserAnimationsModule,
    DemoMaterialModule
  ],
  entryComponents: [
    MealCreateDialogComponent,
    MealListComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
