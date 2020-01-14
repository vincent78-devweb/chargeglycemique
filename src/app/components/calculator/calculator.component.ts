import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import {Sort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';

import { DataService } from '../../services/data.service';
import { PortionsService } from '../../services/portions.service';
import { Portion } from '../../models/portion'; // Interface Portion
import { Aliment } from '../../models/aliment'; // Interface Aliment
import { MealCreateDialogComponent } from '../../components/meal/meal-create-dialog/meal-create-dialog.component';


@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {

  portionForm;
  aliments: Aliment[] = [];
  
  globalCharge = 0;
  portions: Portion[];
  portionsDisplayedColumns;

  /**
   * Constructor
   * @param DataService
   * @param PortionsService
   * @param FormBuilder
   */
  constructor(
    private dataService: DataService,
    private portionsService: PortionsService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {

   }

  /**
   * Initialize module
   */
  ngOnInit() {
    // Set displayable columns of the portions table 
    this.portionsDisplayedColumns = ['name', 'ig', 'carbs', 'charge', 'suppr'];
    // Set the portions table
    this.portions = this.portionsService.getPortions();
    this.globalCharge = this.portionsService.getCharge();

    // Load Aliments list from the associate service
    this.refreshAliments();
    
    // Initialize the aliment add form
    this.portionForm = this.formBuilder.group({
      carbs: new FormControl(null, [Validators.required, Validators.min(0)]),
      idx: '',
      hideRequired: false,
      floatLabel: 'auto'
    });
  }

  /**
   * Refresh the aliments with the aliments from the aliment service
   */
  refreshAliments() {
    // Load Aliments list from the associate service
    // and subscribe to the callback when loading complete 
    this.dataService.getAliments().subscribe(dataList => {
      this.aliments = dataList.slice();
    });
  }

  /**
   * Generic error manager for the form controler
   * @param controlName The name property of the field to control (see <mat-error> tag in the template for more details)
   * @param errorName The name property of the error to control (see <mat-error> tag in the template for more details)
   */
  hasError = (controlName: string, errorName: string) =>{
    return this.portionForm.controls[controlName].hasError(errorName);
  }

  /**
   * Add a new portion in the portions table
   * @param portion The portion to add
   */
  onSubmitPortion(portion) {
    // @TODO : Le bouton Ajouter ne se grise pas après validation du formulaire
    // Workaround : test si tous les champs sont renseignés
    if (this.portionForm.valid && portion.idx !== null && portion.carbs != null) {
      // Retrieve the associate aliment
      let aliment = this.aliments[portion.idx];

      // CG = (IG de l'aliment x quantité de glucides dans la portion d'aliment) / 100
      let charge = ( (aliment.ig * aliment.carbs ) / 100 ) * portion.carbs / 100;
      this.globalCharge = this.globalCharge + charge;

      // Add the portion into the portion collection
      this.portionsService.addPortion(
        {
          name   : aliment.name,
          ig     : aliment.ig,
          carbs  : portion.carbs,
          charge : charge
      });

    // Reset the form
    this.resetPortionForm();

      // Refresh portions list
      this.portions = this.portionsService.getPortions();
   }
  }

  /**
   * Remove a portion from the portions table
   * @param portion The portion to remove
   */
  onDeletePortion(portion) {
    // Remove the portion
    this.portionsService.removePortion(portion);
    // Reset the form
    this.resetPortionForm();

    // Refresh portions list
    this.portions = this.portionsService.getPortions();
    this.globalCharge = this.portionsService.getCharge();
  }

  /**
   * Reset Portion form
   */
  resetPortionForm() {
    // Reset the form
    this.portionForm.reset();
    // Bug FormGroup.reset() does not reset validation
    // See here for details : https://github.com/angular/components/issues/9347
    // Workaround :
    Object.keys(this.portionForm.controls).forEach(key => {
      this.portionForm.controls[key].setErrors(null)
    });
  }

  /**
   * Open Save Meal dialog
   */
  openSaveMealDialog(): void {
    const dialogRef = this.dialog.open(MealCreateDialogComponent, {
      width: '250px',
      data: {name: '', portions: this.portions}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === "VALIDATED"){
        this.portionsService.removeAllPortions();
        // Refresh portions list
        this.portions = this.portionsService.getPortions();
      }
      
    });
  }

  /**
   * Sort Portion list (all columns)
   * @param Sort
   */
  sortPortions(sort: Sort) {
    const data = this.portions.slice();
    if (!sort.active || sort.direction === '') {
      this.portions = data;
      return;
    }

    this.portions = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'ig': return this.compare(a.ig, b.ig, isAsc);
        case 'carbs': return this.compare(a.carbs, b.carbs, isAsc);
        case 'charge': return this.compare(a.charge, b.charge, isAsc);
        default: return 0;
      }
    });
  }

  /**
   * Generic compare
   */
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
