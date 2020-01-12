import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { DataService } from '../../../services/data.service';
import { Aliment } from '../../../models/aliment';

@Component({
  selector: 'app-aliment-list',
  templateUrl: './aliment-list.component.html',
  styleUrls: ['./aliment-list.component.css']
})

export class AlimentListComponent implements OnInit {

  alimentForm; // FormBuilder instance
  aliments: Aliment[];
  alimentsDisplayedColumns = [];

  dataSource: MatTableDataSource<Aliment>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

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
    this.dataSource = new MatTableDataSource(this.aliments);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
  hasError = (controlName: string, errorName: string) => {
    return this.alimentForm.controls[controlName].hasError(errorName);
  }

  /**
   * Refresh the aliments with the aliments from the aliment service
   */
  refreshAliments() {
    // Load Aliments list from the associate service
    // and subscribe to the callback when loading complete 
    this.dataService.getAliments().subscribe(dataList => {
      this.aliments = dataList.slice();
      this.dataSource.data = this.aliments;
    });
  }

  /**
   * Add a new aliment in the aliments table
   * @param aliment The aliment to add
   */
  onSubmitAliment(aliment: Aliment) {
    // @TODO : Le bouton Ajouter ne se grise pas après validation du formulaire
    // Workaround : test si tous les champs sont renseignés
    if (this.alimentForm.valid && aliment.name != null && aliment.ig != null && aliment.carbs != null) {
      console.log("ig=" + JSON.stringify(aliment));

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
  onDeleteAliment(aliment: Aliment) {
    // Delete the aliment
    this.dataService.removeAliment(aliment);

    // Refresh the aliment array
    this.refreshAliments();
  }

}

