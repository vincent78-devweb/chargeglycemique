import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Aliment } from '../models/aliment'; // Interface Aliment

@Injectable({
  providedIn: 'root'
})

export class DataService {

  private aliments: Aliment[] = []; // Aliments collection
  private alimentListAvailable = false;

  /**
   * Constructor
   * @param http A object HttpClient used to load the aliments list from the server
   */
  constructor(
    private http: HttpClient
  ) { }

  /**
   * Get Aliments (caution : asynchron method!)
   * @return Observable<Aliment[]> 
   */
  public getAliments(): Observable<Aliment[]> {
    if (this.alimentListAvailable) {
      // If already exists, return a observable copy of aliments array
      return of(this.aliments.slice());

    } else {
      
      // If not, load aliments from local storage
      if(localStorage.getItem('aliments') !== null){
          // Get Aliments from the local storage
          let dataList = JSON.parse(localStorage.getItem("aliments"));
          // Save and sort the loaded datalist into the aliments array
          this.aliments = dataList.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
          this.alimentListAvailable = true;
          // Return an observable copy of aliments
          return of(this.aliments.slice());
      
      } else {
      
          // If not, load aliments JSON collection
        return this.http.get<Aliment[]>('/assets/aliments.json')
          // Perfom these actions when loading complete
          .pipe(
            // Save and sort the loaded datalist into the aliments array
            tap(dataList => this.aliments = dataList.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))),
            // Set boolean Aliments list available to true
            tap(dataList => this.alimentListAvailable = true),
            // Save aliments to local storage
            tap(dataList => localStorage.setItem('aliments', JSON.stringify(dataList))),
            // Generic error handler
            catchError(this.handleError)
          );
      }
    }
  }

  /**
   * Add an new aliment to the aliments array
   * @param aliment The object Aliment to add 
   */
  public addAliment(aliment: Aliment) {
    this.aliments.push(aliment);
    // Save aliments to local storage
    localStorage.setItem('aliments', JSON.stringify(this.aliments));
  }

  /**
   * Remove an aliment from the aliments array
   * @param aliment The object Aliment to remove
   */
  public removeAliment(aliment) {
    this.aliments = this.aliments.filter(al => al.name != aliment.name);
    // Save aliments to local storage
    localStorage.setItem('aliments', JSON.stringify(this.aliments));
  }

  /**
   * Check if the aliment list is available
   * @return boolean
   */
  public isAlimentListAvailable(): boolean {
    return this.alimentListAvailable;
  }

  /**
   * Manage http error
   * @param err The HttpErrorResponse to manage
   */
  private handleError(err: HttpErrorResponse) {
    this.alimentListAvailable = false;
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

}
