import { Injectable } from '@angular/core';

import { Meal } from '../models/meal'; // Interface Meal

@Injectable({
  providedIn: 'root'
})
export class MealService {

  private meal: Meal[] = [];

  /**
   * Constructor
   */
  constructor() { }

    /**
   * Get meal
   * @return meal[]
   */
  public getMeals(): Meal[]{
    if(this.meal.length > 0){
      return this.meal.slice();
    
    } else {
      // Get meal from the local storage
      if(localStorage.getItem('repas') !== null){
        this.meal = JSON.parse(localStorage.getItem("repas"));
        // Save and sort the loaded datalist into the repas array
        this.meal = this.meal.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      } else {
        this.meal = [];
      }
      return this.meal.slice();
    }
  }

  /**
   * Add a meal in the meal array
   * @param meal The object meal to add
   */
  public addMeal(meal) {
    // Set the id & add the meal
    meal.id = this.meal.length;
    this.meal.push(meal);
    // Save meal to local storage
    this.saveMealToLocalStorage();
  }

  /**
   * Remove a meal in the meal array
   * @param meal The object meal to remove
   */
  public removeMeal(meal){
    this.meal = this.meal.filter(po => po.name != meal.name);
    // Save meal to local storage
    this.saveMealToLocalStorage();
  }

  /**
   * Save meal to local storage
   */
  private saveMealToLocalStorage(){
    localStorage.setItem('repas', JSON.stringify(this.meal));
  }

}
