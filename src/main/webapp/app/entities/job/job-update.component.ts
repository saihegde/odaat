import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { IJob } from 'app/shared/model/job.model';
import { JobService } from './job.service';
import { IJobLocation } from 'app/shared/model/job-location.model';
import { JobLocationService } from 'app/entities/job-location';
import { IUser, UserService } from 'app/core';
import { ILocationState } from 'app/shared/model/location-state.model';
import { LocationStateService } from 'app/entities/location-state';
import { ICountry } from 'app/shared/model/country.model';
import { CountryService } from 'app/entities/country';

@Component({
    selector: 'jhi-job-update',
    templateUrl: './job-update.component.html'
})
export class JobUpdateComponent implements OnInit {
    private _job: IJob;
    isSaving: boolean;

    locations: IJobLocation[];

    users: IUser[];
    jobDate: string;

    locationstates: ILocationState[];
    countries: ICountry[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private jobService: JobService,
        private jobLocationService: JobLocationService,
        private userService: UserService,
        private locationStateService: LocationStateService,
        private countryService: CountryService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ job }) => {
            this.job = job;
        });
        this.jobLocationService.query({ filter: 'job-is-null' }).subscribe(
            (res: HttpResponse<IJobLocation[]>) => {
                if (!this.job.location || !this.job.location.id) {
                    this.locations = res.body;
                } else {
                    this.jobLocationService.find(this.job.location.id).subscribe(
                        (subRes: HttpResponse<IJobLocation>) => {
                            this.locations = [subRes.body].concat(res.body);
                        },
                        (subRes: HttpErrorResponse) => this.onError(subRes.message)
                    );
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.locationStateService.query().subscribe(
            (res: HttpResponse<ILocationState[]>) => {
                this.locationstates = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.countryService.query().subscribe(
            (res: HttpResponse<ICountry[]>) => {
                this.countries = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.job.jobDate = moment(this.jobDate, DATE_TIME_FORMAT);
        if (this.job.id !== undefined) {
            this.subscribeToSaveResponse(this.jobService.update(this.job));
        } else {
            this.subscribeToSaveResponse(this.jobService.create(this.job));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IJob>>) {
        result.subscribe((res: HttpResponse<IJob>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackJobLocationById(index: number, item: IJobLocation) {
        return item.id;
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }
    get job() {
        return this._job;
    }

    set job(job: IJob) {
        this._job = job;
        this.jobDate = moment(job.jobDate).format(DATE_TIME_FORMAT);
    }
}
