import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IJobLocation } from 'app/shared/model/job-location.model';
import { JobLocationService } from './job-location.service';
import { ILocationState } from 'app/shared/model/location-state.model';
import { LocationStateService } from 'app/entities/location-state';
import { ICountry } from 'app/shared/model/country.model';
import { CountryService } from 'app/entities/country';

@Component({
    selector: 'jhi-job-location-update',
    templateUrl: './job-location-update.component.html'
})
export class JobLocationUpdateComponent implements OnInit {
    private _jobLocation: IJobLocation;
    isSaving: boolean;

    locationstates: ILocationState[];

    countries: ICountry[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private jobLocationService: JobLocationService,
        private locationStateService: LocationStateService,
        private countryService: CountryService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ jobLocation }) => {
            this.jobLocation = jobLocation;
        });
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
        if (this.jobLocation.id !== undefined) {
            this.subscribeToSaveResponse(this.jobLocationService.update(this.jobLocation));
        } else {
            this.subscribeToSaveResponse(this.jobLocationService.create(this.jobLocation));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IJobLocation>>) {
        result.subscribe((res: HttpResponse<IJobLocation>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackLocationStateById(index: number, item: ILocationState) {
        return item.id;
    }

    trackCountryById(index: number, item: ICountry) {
        return item.id;
    }
    get jobLocation() {
        return this._jobLocation;
    }

    set jobLocation(jobLocation: IJobLocation) {
        this._jobLocation = jobLocation;
    }
}
