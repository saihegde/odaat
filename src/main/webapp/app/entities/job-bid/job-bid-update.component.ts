import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IJobBid } from 'app/shared/model/job-bid.model';
import { JobBidService } from './job-bid.service';
import { IJob } from 'app/shared/model/job.model';
import { JobService } from 'app/entities/job';

@Component({
    selector: 'jhi-job-bid-update',
    templateUrl: './job-bid-update.component.html'
})
export class JobBidUpdateComponent implements OnInit {
    private _jobBid: IJobBid;
    isSaving: boolean;

    jobs: IJob[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private jobBidService: JobBidService,
        private jobService: JobService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ jobBid }) => {
            this.jobBid = jobBid;
        });
        this.jobService.query().subscribe(
            (res: HttpResponse<IJob[]>) => {
                this.jobs = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.jobBid.id !== undefined) {
            this.subscribeToSaveResponse(this.jobBidService.update(this.jobBid));
        } else {
            this.subscribeToSaveResponse(this.jobBidService.create(this.jobBid));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IJobBid>>) {
        result.subscribe((res: HttpResponse<IJobBid>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackJobById(index: number, item: IJob) {
        return item.id;
    }
    get jobBid() {
        return this._jobBid;
    }

    set jobBid(jobBid: IJobBid) {
        this._jobBid = jobBid;
    }
}
