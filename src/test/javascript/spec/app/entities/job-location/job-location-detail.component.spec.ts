/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OdaatTestModule } from '../../../test.module';
import { JobLocationDetailComponent } from 'app/entities/job-location/job-location-detail.component';
import { JobLocation } from 'app/shared/model/job-location.model';

describe('Component Tests', () => {
    describe('JobLocation Management Detail Component', () => {
        let comp: JobLocationDetailComponent;
        let fixture: ComponentFixture<JobLocationDetailComponent>;
        const route = ({ data: of({ jobLocation: new JobLocation(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OdaatTestModule],
                declarations: [JobLocationDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(JobLocationDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(JobLocationDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.jobLocation).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
