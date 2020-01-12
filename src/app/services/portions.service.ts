import { Injectable } from '@angular/core';

import { Portion } from '../models/portion'; // Interface Portion

@Injectable({
  providedIn: 'root'
})
export class PortionsService {

  private portions: Portion[] = [];

  /**
   * Constructor
   */
  constructor() { 

  }

  /**
   * Get portions
   * @return Portion[]
   */
  public getPortions(): Portion[]{
    if(this.portions.length > 0){
      return this.portions.slice();
    
    } else {
      // Get portions from the local storage
      if(localStorage.getItem('portions') !== null){
        this.portions = JSON.parse(localStorage.getItem("portions"));
        // Save and sort the loaded datalist into the portions array
        this.portions = this.portions.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      } else {
        this.portions = [];
      }
      return this.portions.slice();
    }
  }

  /**
   * Get total charge
   * @return Sum of all portion charges
   */
  public getCharge() {
    let charge = 0;
    this.portions.map(portion => charge = charge + portion.charge);
    return charge;
  }

  /**
   * Add a portion in the portions array
   * @param portion The object Portion to add
   */
  public addPortion(portion: Portion) {
    this.portions.push(portion);
    // Save portions to local storage
    this.savePortionsToLocalStorage();
  }

  /**
   * Remove a portion in the portions array
   * @param portion The object Portion to remove
   */
  public removePortion(portion: Portion){
    this.portions = this.portions.filter(po => po.name != portion.name);
    // Save portions to local storage
    this.savePortionsToLocalStorage();
  }

  /**
   * Remove a portion in the portions array
   * @param portion The object Portion to remove
   */
  public removeAllPortions(){
    this.portions = [];
    // Save portions to local storage
    this.savePortionsToLocalStorage();
  }

  /**
   * Save portions to local storage
   */
  private savePortionsToLocalStorage(){
    localStorage.setItem('portions', JSON.stringify(this.portions));
  }

}
