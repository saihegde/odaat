import { IUser } from 'app/core/user/user.model';

export interface IUserProfile {
    id?: number;
    receiveEmailAlerts?: boolean;
    receiveTextAlerts?: boolean;
    notifyOfJobsInArea?: boolean;
    user?: IUser;
}

export class UserProfile implements IUserProfile {
    constructor(
        public id?: number,
        public receiveEmailAlerts?: boolean,
        public receiveTextAlerts?: boolean,
        public notifyOfJobsInArea?: boolean,
        public user?: IUser
    ) {
        this.receiveEmailAlerts = this.receiveEmailAlerts || false;
        this.receiveTextAlerts = this.receiveTextAlerts || false;
        this.notifyOfJobsInArea = this.notifyOfJobsInArea || false;
    }
}
