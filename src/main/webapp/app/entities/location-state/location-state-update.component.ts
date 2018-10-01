import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { ILocationState } from 'app/shared/model/location-state.model';
import { LocationStateService } from './location-state.service';
import { ICountry } from 'app/shared/model/country.model';
import { CountryService } from 'app/entities/country';

@Component({
    selector: 'jhi-location-state-update',
    templateUrl: './location-state-update.component.html'
})
export class LocationStateUpdateComponent implements OnInit {
    private _locationState: ILocationState;
    isSaving: boolean;

    countries: ICountry[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private locationStateService: LocationStateService,
        private countryService: CountryService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ locationState }) => {
            this.locationState = locationState;
        });
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
        if (this.locationState.id !== undefined) {
            this.subscribeToSaveResponse(this.locationStateService.update(this.locationState));
        } else {
            this.subscribeToSaveResponse(this.locationStateService.create(this.locationState));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ILocationState>>) {
        result.subscribe((res: HttpResponse<ILocationState>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackCountryById(index: number, item: ICountry) {
        return item.id;
    }
    get locationState() {
        return this._locationState;
    }

    set locationState(locationState: ILocationState) {
        this._locationState = locationState;
    }
}
