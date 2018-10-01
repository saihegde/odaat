import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IJobLocation } from 'app/shared/model/job-location.model';
import { Principal } from 'app/core';
import { JobLocationService } from './job-location.service';

@Component({
    selector: 'jhi-job-location',
    templateUrl: './job-location.component.html'
})
export class JobLocationComponent implements OnInit, OnDestroy {
    jobLocations: IJobLocation[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private jobLocationService: JobLocationService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.jobLocationService
                .search({
                    query: this.currentSearch
                })
                .subscribe(
                    (res: HttpResponse<IJobLocation[]>) => (this.jobLocations = res.body),
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
        }
        this.jobLocationService.query().subscribe(
            (res: HttpResponse<IJobLocation[]>) => {
                this.jobLocations = res.body;
                this.currentSearch = '';
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInJobLocations();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IJobLocation) {
        return item.id;
    }

    registerChangeInJobLocations() {
        this.eventSubscriber = this.eventManager.subscribe('jobLocationListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
