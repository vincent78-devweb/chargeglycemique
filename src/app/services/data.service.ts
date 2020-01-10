import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { Aliment } from '../models/aliment'; // Interface Aliment

@Injectable({
  providedIn: 'root'
})

export class DataService {
 
  aliments: Aliment[] = []; // Aliments collection
  isLocalStorage = false; // TODO : inutile...?

  /**
   * Constructor
   * @param HttpClient
   */
  constructor(
    private http: HttpClient
    ) { }

  /**
   * Get Aliments
   * **************************
   * !!! Asynchron function !!!
   * **************************
   */
  getAliments(): Observable<Aliment[]> {
    if (this.aliments.length > 0) {
      // If already exists, return a observable copy of aliments array
      return of(this.aliments.slice())
    } else {
      // If not, load aliments JSON collection
      return this.http.get<Aliment[]>('/assets/aliments.json')
        .pipe( // Perfom these actions when loading complete
               tap(dataList => this.aliments = dataList.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))), // Save the loaded datalist into the aliments array
               tap(dataList => sessionStorage.setItem('dataStorageKey', JSON.stringify(dataList))) // Save aliments to local storage
               //tap(dataList => this.alimentsArray = dataList), // Save the loaded datalist into the aliments array
               //tap(dataList => console.log(JSON.stringify(dataList))) 
              );
    }
  }

  /**
   * Add an aliment
   * @param aliment 
   */
  addAliment(aliment) {
    this.aliments.push(aliment);
  }

    /**
   * Remove an aliment
   * @param aliment 
   */
  removeAliment(aliment){
    this.aliments = this.aliments.filter(al => al.name != aliment.name);
  }

  sortAlimentsByName(): Aliment[] {
    this.aliments.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    return this.aliments; 
  }
}
