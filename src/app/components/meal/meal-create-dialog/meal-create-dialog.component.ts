import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Meal } from '../../../models/meal'; // Interface IRepas
import { CalculatorComponent } from '../../../components/calculator/calculator.component';
import { MealService } from '../../../services/meal.service';

@Component({
  selector: 'app-meal-create-dialog',
  templateUrl: './meal-create-dialog.component.html',
  styleUrls: ['./meal-create-dialog.component.css']
})
export class MealCreateDialogComponent implements OnInit {

  mealForm: FormGroup;
  windowStatus: string;

  constructor(    
    private mealService: MealService,
    public dialogRef: MatDialogRef<CalculatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Meal) {}

  onCancelClick(): void {
    this.windowStatus = "CANCELED";
    this.dialogRef.close("CANCELED");
  }

  ngOnInit() {
    // Initialize the meal add form
    this.mealForm = new FormGroup({
      name  : new FormControl('', [Validators.required, Validators.maxLength(60)])
    });
  }

    /**
   * Add a new meal in the meal table
   * @param meal The name of the meal to add
   */
  onSubmitMeal(meal) {
    if (this.mealForm.valid && this.windowStatus !== "CANCELED") {
      this.data.name = meal.name;
      
      // Save the new meal into the service meals array
      this.mealService.addMeal(this.data);

      // Close the window
      console.log("valid");
      this.dialogRef.close("VALIDATED");
    }
  }

  /**
   * Generic error manager for the form controler
   * @param controlName The name property of the field to control (see <mat-error> tag in the template for more details)
   * @param errorName The name property of the error to control (see <mat-error> tag in the template for more details)
   */
  hasError = (controlName: string, errorName: string) =>{
    return this.mealForm.controls[controlName].hasError(errorName);
  }

}
