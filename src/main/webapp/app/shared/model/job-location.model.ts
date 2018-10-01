import { ILocationState } from 'app/shared/model//location-state.model';
import { ICountry } from 'app/shared/model//country.model';

export interface IJobLocation {
    id?: number;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    zipcode?: string;
    state?: ILocationState;
    country?: ICountry;
}

export class JobLocation implements IJobLocation {
    constructor(
        public id?: number,
        public addressLine1?: string,
        public addressLine2?: string,
        public city?: string,
        public zipcode?: string,
        public state?: ILocationState,
        public country?: ICountry
    ) {}
}
