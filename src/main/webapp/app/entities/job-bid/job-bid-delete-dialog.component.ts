import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IJobBid } from 'app/shared/model/job-bid.model';
import { JobBidService } from './job-bid.service';

@Component({
    selector: 'jhi-job-bid-delete-dialog',
    templateUrl: './job-bid-delete-dialog.component.html'
})
export class JobBidDeleteDialogComponent {
    jobBid: IJobBid;

    constructor(private jobBidService: JobBidService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.jobBidService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'jobBidListModification',
                content: 'Deleted an jobBid'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-job-bid-delete-popup',
    template: ''
})
export class JobBidDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ jobBid }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(JobBidDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.jobBid = jobBid;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
