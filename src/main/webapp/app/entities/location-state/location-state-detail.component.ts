import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILocationState } from 'app/shared/model/location-state.model';

@Component({
    selector: 'jhi-location-state-detail',
    templateUrl: './location-state-detail.component.html'
})
export class LocationStateDetailComponent implements OnInit {
    locationState: ILocationState;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ locationState }) => {
            this.locationState = locationState;
        });
    }

    previousState() {
        window.history.back();
    }
}
