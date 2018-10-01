import { Moment } from 'moment';
import { IJobLocation } from 'app/shared/model//job-location.model';
import { IUser } from 'app/core/user/user.model';
import { IJobBid } from 'app/shared/model//job-bid.model';

export interface IJob {
    id?: number;
    title?: string;
    description?: string;
    jobDate?: Moment;
    pay?: number;
    location?: IJobLocation;
    owner?: IUser;
    jobBids?: IJobBid[];
}

export class Job implements IJob {
    constructor(
        public id?: number,
        public title?: string,
        public description?: string,
        public jobDate?: Moment,
        public pay?: number,
        public location?: IJobLocation,
        public owner?: IUser,
        public jobBids?: IJobBid[]
    ) {}
}
