import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Meal } from '../../../models/meal'; // Interface Repas
import { MealService } from '../../../services/meal.service';

@Component({
  selector: 'app-meal-list',
  templateUrl: './meal-list.component.html',
  styleUrls: ['./meal-list.component.css']
})
export class MealListComponent implements OnInit {

  meals: Meal[];
  mealsDisplayedColumns;

  dataSource: MatTableDataSource<Meal>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private mealService: MealService,
  ) { }

  ngOnInit() {
    // Set displayable columns of the aliments table 
    this.mealsDisplayedColumns = ['name', 'details', 'suppr'];

    // Load meals list from the associate service
    this.meals = this.mealService.getMeals();
    this.dataSource = new MatTableDataSource(this.meals);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Remove a meal from the meals table
   * @param meal The meal to remove
   */
  onDeleteMeal(meal) {
    // Remove the meal
    this.mealService.removeMeal(meal);

    // Refresh portions list
    this.meals = this.mealService.getMeals();
    this.dataSource.data = this.meals;
  }

}