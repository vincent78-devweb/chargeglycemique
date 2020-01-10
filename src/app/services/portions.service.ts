import { Injectable } from '@angular/core';

import { Portion } from '../models/portion'; // Interface Portion

@Injectable({
  providedIn: 'root'
})
export class PortionsService {

  portions: Portion[] = [];

  /**
   * Constructor
   */
  constructor() { 

  }

  /**
   * Get portions
   */
  getPortions(){
    return this.portions;
  }

  /**
   * Get charge totale
   */
  getCharge() {
    let charge = 0;
    this.portions.map(portion => charge = charge + portion.charge);
    return charge;
  }

  /**
   * Add a portion
   * @param portion 
   */
  addPortion(portion) {
    this.portions.push(portion);
  }

  /**
   * Remove a portion
   * @param portion 
   */
  removePortion(portion){
    this.portions = this.portions.filter(po => po.name != portion.name);
  }

}
