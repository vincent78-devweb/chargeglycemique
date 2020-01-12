import { Portion } from '../models/portion'; // Interface Portion

export interface Meal {
    id: number;
    name: string;
    portions: Portion[];
}
