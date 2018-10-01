/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { OdaatTestModule } from '../../../test.module';
import { JobBidDeleteDialogComponent } from 'app/entities/job-bid/job-bid-delete-dialog.component';
import { JobBidService } from 'app/entities/job-bid/job-bid.service';

describe('Component Tests', () => {
    describe('JobBid Management Delete Component', () => {
        let comp: JobBidDeleteDialogComponent;
        let fixture: ComponentFixture<JobBidDeleteDialogComponent>;
        let service: JobBidService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OdaatTestModule],
                declarations: [JobBidDeleteDialogComponent]
            })
                .overrideTemplate(JobBidDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(JobBidDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(JobBidService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
