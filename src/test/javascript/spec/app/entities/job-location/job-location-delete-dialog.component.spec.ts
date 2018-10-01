/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { OdaatTestModule } from '../../../test.module';
import { JobLocationDeleteDialogComponent } from 'app/entities/job-location/job-location-delete-dialog.component';
import { JobLocationService } from 'app/entities/job-location/job-location.service';

describe('Component Tests', () => {
    describe('JobLocation Management Delete Component', () => {
        let comp: JobLocationDeleteDialogComponent;
        let fixture: ComponentFixture<JobLocationDeleteDialogComponent>;
        let service: JobLocationService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OdaatTestModule],
                declarations: [JobLocationDeleteDialogComponent]
            })
                .overrideTemplate(JobLocationDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(JobLocationDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(JobLocationService);
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
