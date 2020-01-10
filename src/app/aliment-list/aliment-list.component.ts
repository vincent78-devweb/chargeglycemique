import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';

import { DataService } from '../services/data.service';
import { Aliment } from '../models/aliment';

@Component({
  selector: 'app-aliment-list',
  templateUrl: './aliment-list.component.html',
  styleUrls: ['./aliment-list.component.css']
})

export class AlimentListComponent implements OnInit {

  public alimentForm; // FormBuilder instance
  public aliments: Aliment[];
  public alimentsDisplayedColumns = [];

  /**
   * Constructor
   * @param dataService DataService Aliments
   */
  constructor(
    private dataService: DataService
  ) {
  }

  /**
   * Initialize the module
   */
  ngOnInit() {
    // Set displayable columns of the aliments table 
    this.alimentsDisplayedColumns = ['name', 'ig', 'carbs', 'suppr'];

    // Load Aliments list from the associate service
    this.refreshAliments();

    // Initialize the aliment add form
    this.alimentForm = new FormGroup({
      ig    : new FormControl(null, [Validators.required, Validators.min(0), Validators.max(200)]),
      carbs : new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
      name  : new FormControl('', [Validators.required, Validators.maxLength(60)])
    });
  }

  /**
   * Generic error manager for the form controler
   * @param controlName The name property of the field to control (see <mat-error> tag in the template for more details)
   * @param errorName The name property of the error to control (see <mat-error> tag in the template for more details)
   */
  public hasError = (controlName: string, errorName: string) => {
    return this.alimentForm.controls[controlName].hasError(errorName);
  }

  /**
   * Refresh the aliments with the aliments from the aliment service
   */
  public refreshAliments() {
    // Load Aliments list from the associate service
    // and subscribe to the callback when loading complete 
    this.dataService.getAliments().subscribe(dataList => {
      this.aliments = dataList;
    });
  }

  /**
   * Add a new aliment in the aliments table
   * @param aliment The aliment to add
   */
  public onSubmitAliment(aliment: Aliment) {
    if (this.alimentForm.valid) {
      
      // Save the new aliment into the service aliments array
      this.dataService.addAliment(aliment);
      
      // Refresh the aliment array
      this.refreshAliments();
      
      // Reset the form
      this.alimentForm.reset();

      // Bug FormGroup.reset() does not reset validation
      // See here for details : https://github.com/angular/components/issues/9347
      // Workaround :
      Object.keys(this.alimentForm.controls).forEach(key => {
        this.alimentForm.controls[key].setErrors(null)
      });
    }
  }

  /**
   * Delete an aliment in the aliments table
   * @param aliment The aliment to remove
   */
  public onDeleteAliment(aliment: Aliment) {
    // Delete the aliment
    this.dataService.removeAliment(aliment);

    // Refresh the aliment array
    this.refreshAliments();
  }

  /**
   * Sort aliments (all columns)
   * @param sort The object Sort used to retrieve which column has to be sorted
   */
  public sortAliments(sort: Sort) {

    const data = this.aliments.slice();
    if (!sort.active || sort.direction === '') {
      this.aliments = data;
      return;
    }

    this.aliments = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'ig': return this.compare(a.ig, b.ig, isAsc);
        case 'carbs': return this.compare(a.carbs, b.carbs, isAsc);
        default: return 0;
      }
    });
  }

  /**
   * Generic compare method
   * @TODO : should be include in a share directive?
   */
  public compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}

