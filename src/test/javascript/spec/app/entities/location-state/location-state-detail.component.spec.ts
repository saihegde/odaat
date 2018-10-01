/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OdaatTestModule } from '../../../test.module';
import { LocationStateDetailComponent } from 'app/entities/location-state/location-state-detail.component';
import { LocationState } from 'app/shared/model/location-state.model';

describe('Component Tests', () => {
    describe('LocationState Management Detail Component', () => {
        let comp: LocationStateDetailComponent;
        let fixture: ComponentFixture<LocationStateDetailComponent>;
        const route = ({ data: of({ locationState: new LocationState(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OdaatTestModule],
                declarations: [LocationStateDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(LocationStateDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(LocationStateDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.locationState).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
