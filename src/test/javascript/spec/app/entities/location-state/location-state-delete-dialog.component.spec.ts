/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { OdaatTestModule } from '../../../test.module';
import { LocationStateDeleteDialogComponent } from 'app/entities/location-state/location-state-delete-dialog.component';
import { LocationStateService } from 'app/entities/location-state/location-state.service';

describe('Component Tests', () => {
    describe('LocationState Management Delete Component', () => {
        let comp: LocationStateDeleteDialogComponent;
        let fixture: ComponentFixture<LocationStateDeleteDialogComponent>;
        let service: LocationStateService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OdaatTestModule],
                declarations: [LocationStateDeleteDialogComponent]
            })
                .overrideTemplate(LocationStateDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(LocationStateDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LocationStateService);
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
