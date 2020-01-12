import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Portion } from '../../../models/portion'; // Interface Portion
import { Meal } from '../../../models/meal'; // Interface IRepas
import { MealService } from '../../../services/meal.service';

@Component({
  selector: 'app-meal-detail',
  templateUrl: './meal-detail.component.html',
  styleUrls: ['./meal-detail.component.css']
})
export class MealDetailComponent implements OnInit {

  meal: Meal;
  globalCharge = 0;
  portionsDisplayedColumns;

  dataSource: MatTableDataSource<Portion>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  constructor(
    private mealService: MealService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    // Load meals list from the associate service
    this.route.paramMap.subscribe(params => {
      this.meal = this.mealService.getMeals()[+params.get('Id')];
    });

    // Set displayable columns of the portions table 
    this.portionsDisplayedColumns = ['name', 'ig', 'carbs', 'charge'];
    this.dataSource = new MatTableDataSource(this.meal.portions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Global charge
    this.meal.portions.map(portion => this.globalCharge = this.globalCharge + portion.charge);
  }

}
