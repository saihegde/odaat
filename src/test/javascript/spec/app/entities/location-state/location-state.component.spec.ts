/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { OdaatTestModule } from '../../../test.module';
import { LocationStateComponent } from 'app/entities/location-state/location-state.component';
import { LocationStateService } from 'app/entities/location-state/location-state.service';
import { LocationState } from 'app/shared/model/location-state.model';

describe('Component Tests', () => {
    describe('LocationState Management Component', () => {
        let comp: LocationStateComponent;
        let fixture: ComponentFixture<LocationStateComponent>;
        let service: LocationStateService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OdaatTestModule],
                declarations: [LocationStateComponent],
                providers: []
            })
                .overrideTemplate(LocationStateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(LocationStateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LocationStateService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new LocationState(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.locationStates[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
