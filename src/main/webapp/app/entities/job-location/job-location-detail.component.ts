import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJobLocation } from 'app/shared/model/job-location.model';

@Component({
    selector: 'jhi-job-location-detail',
    templateUrl: './job-location-detail.component.html'
})
export class JobLocationDetailComponent implements OnInit {
    jobLocation: IJobLocation;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ jobLocation }) => {
            this.jobLocation = jobLocation;
        });
    }

    previousState() {
        window.history.back();
    }
}
