import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJobBid } from 'app/shared/model/job-bid.model';

@Component({
    selector: 'jhi-job-bid-detail',
    templateUrl: './job-bid-detail.component.html'
})
export class JobBidDetailComponent implements OnInit {
    jobBid: IJobBid;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ jobBid }) => {
            this.jobBid = jobBid;
        });
    }

    previousState() {
        window.history.back();
    }
}
