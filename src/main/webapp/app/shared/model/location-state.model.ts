import { ICountry } from 'app/shared/model//country.model';

export interface ILocationState {
    id?: number;
    name?: string;
    country?: ICountry;
}

export class LocationState implements ILocationState {
    constructor(public id?: number, public name?: string, public country?: ICountry) {}
}
