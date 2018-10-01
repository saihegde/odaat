/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { OdaatTestModule } from '../../../test.module';
import { LocationStateUpdateComponent } from 'app/entities/location-state/location-state-update.component';
import { LocationStateService } from 'app/entities/location-state/location-state.service';
import { LocationState } from 'app/shared/model/location-state.model';

describe('Component Tests', () => {
    describe('LocationState Management Update Component', () => {
        let comp: LocationStateUpdateComponent;
        let fixture: ComponentFixture<LocationStateUpdateComponent>;
        let service: LocationStateService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OdaatTestModule],
                declarations: [LocationStateUpdateComponent]
            })
                .overrideTemplate(LocationStateUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(LocationStateUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LocationStateService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new LocationState(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.locationState = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new LocationState();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.locationState = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
