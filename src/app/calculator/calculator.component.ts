import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import {Sort} from '@angular/material/sort';

import { DataService } from '../services/data.service';
import { PortionsService } from '../services/portions.service';
import { Portion } from '../models/portion'; // Interface Portion

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {

  portionForm;
  dataService;
  portionsService;

  aliments = [];
  globalCharge = 0;

  portions: Portion[];
  sortedData: Portion[];
  portionsDisplayedColumns;

  /**
   * Constructor
   * @param DataService
   * @param PortionsService
   * @param FormBuilder
   */
  constructor(
    private ds: DataService,
    private po: PortionsService,
    private formBuilder: FormBuilder
  ) {
    this.dataService = ds;
    this.portionsService = po;
    this.portionForm = this.formBuilder.group({
      carbs: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(200)]),
      idx: '',
      hideRequired: false,
      floatLabel: 'auto'
    });
   }

  /**
   * Initialize module
   */
  ngOnInit() {
    this.aliments = this.dataService.getAliments();
    this.portions = this.portionsService.getPortions();
    this.sortedData = this.portions.slice();
    this.portionsDisplayedColumns = ['name', 'ig', 'carbs', 'charge', 'suppr'];
    this.globalCharge = this.portionsService.getCharge();
  }

  /**
   * Generic form controler error manager
   */
  public hasError = (controlName: string, errorName: string) =>{
    return this.portionForm.controls[controlName].hasError(errorName);
  }

  /**
   * Add a portion
   * @param portion 
   */
  onSubmitPortion(portion) {
    if (this.portionForm.valid) {
      // Retrieve the associate aliment
      let aliment = this.dataService.aliments[portion.idx];

      // CG = (IG de l'aliment x quantité de glucides dans la portion d'aliment) / 100
      let charge = ( (aliment.ig * aliment.carbs ) / 100 ) * portion.carbs / 100;
      this.globalCharge = this.globalCharge + charge;

      // Add the portion into the portion collection
      this.portionsService.addPortion(
        {
        name: aliment.name,
        ig: aliment.ig,
        carbs: portion.carbs,
        charge: charge
      });

    // Reset the form
    this.resetPortionForm();

      // Refresh portions list
      this.portions = this.portionsService.getPortions();
      this.sortedData = this.portions.slice();
   }
  }

  /**
   * Remove a portion
   * @param portion 
   */
  onDeletePortion(portion) {
    // Remove the portion
    this.portionsService.removePortion(portion);
    // Reset the form
    this.resetPortionForm();

    // Refresh portions list
    this.portions = this.portionsService.getPortions();
    this.sortedData = this.portions.slice();
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
   * Sort Portion list (all columns)
   * @param Sort
   */
  sortData(sort: Sort) {
    const data = this.portions.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
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
