import { IJob } from 'app/shared/model//job.model';

export const enum JobStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    PURGED = 'PURGED'
}

export interface IJobBid {
    id?: number;
    status?: JobStatus;
    job?: IJob;
}

export class JobBid implements IJobBid {
    constructor(public id?: number, public status?: JobStatus, public job?: IJob) {}
}
