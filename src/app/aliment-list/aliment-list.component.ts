import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import {Sort} from '@angular/material/sort';

import { of } from 'rxjs';

import { DataService } from '../services/data.service';
import { Aliment } from '../models/aliment';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-aliment-list',
  templateUrl: './aliment-list.component.html',
  styleUrls: ['./aliment-list.component.css']
})

export class AlimentListComponent implements OnInit {

  alimentForm; // FormBuilder instance

  aliments;
  sortedData;
  alimentsDisplayedColumns;

  /**
   * Constructor
   * @param DataService
   * @param FormBuilder
   */
  constructor(
    private dataService: DataService
    //private formBuilder: FormBuilder
    ) {
    /**
    this.alimentForm = this.formBuilder.group({
      ig: new FormControl([0, [Validators.min(0), Validators.max(200)]]),
      carbs: 0,
      name: '',
      emailFormControl: new FormControl('', [ Validators.required, Validators.email])
    });
    */
  }

  /**
   * Initialize module
   */
  ngOnInit() {
    // Passage de tableau par référence
    // Tableau aliments partagé avec le module DataService
    this.aliments = this.dataService.getAliments();
    this.sortedData = this.aliments;
    this.alimentsDisplayedColumns = ['name', 'ig', 'carbs', 'suppr'];

    this.alimentForm = new FormGroup({
      ig: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(200)]),
      carbs: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
      name: new FormControl('', [Validators.required, Validators.maxLength(60)])
    });
  }

    /**
   * Generic form controler error manager
   */
  public hasError = (controlName: string, errorName: string) =>{
    return this.alimentForm.controls[controlName].hasError(errorName);
  }

  /**
   * Add a new aliment
   * @param aliment 
   */
  onSubmitAliment(aliment) {
    if (this.alimentForm.valid) {
      // Add the new aliment into the aliments array
      this.dataService.addAliment(aliment);
      // Refresh the aliment array
      this.aliments = this.dataService.getAliments();
      this.sortedData = this.aliments;
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
   * Delete an aliment
   * @param aliment 
   */
  onDeleteAliment(aliment) {
    // Delete the aliment
    this.dataService.removeAliment(aliment);
    // Refresh the aliment array
    this.aliments = this.dataService.getAliments();
    this.sortedData = this.aliments;
  }

  /**
   * Sort aliments (all columns)
   * @param Sort
   */
  sortData(sort: Sort) {
    this.sortedData = this.dataService.getAliments().pipe(
      tap(dataList => dataList.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'name': return this.compare(a.name, b.name, isAsc);
          case 'ig': return this.compare(a.ig, b.ig, isAsc);
          case 'carbs': return this.compare(a.carbs, b.carbs, isAsc);
          default: return 0;
        }
      })
    ));

    // const data = this.dataService.aliments.slice();
    // if (!sort.active || sort.direction === '') {
    //   this.sortedData = of(data); // Aliment list is observable -> Must transform array into an observable object
    //   return;
    // }

    // this.sortedData = of(data.sort((a, b) => {
    //   const isAsc = sort.direction === 'asc';
    //   switch (sort.active) {
    //     case 'name': return this.compare(a.name, b.name, isAsc);
    //     case 'ig': return this.compare(a.ig, b.ig, isAsc);
    //     case 'carbs': return this.compare(a.carbs, b.carbs, isAsc);
    //     default: return 0;
    //   }
    // }));
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}

