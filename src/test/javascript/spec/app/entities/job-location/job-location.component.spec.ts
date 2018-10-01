/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { OdaatTestModule } from '../../../test.module';
import { JobLocationComponent } from 'app/entities/job-location/job-location.component';
import { JobLocationService } from 'app/entities/job-location/job-location.service';
import { JobLocation } from 'app/shared/model/job-location.model';

describe('Component Tests', () => {
    describe('JobLocation Management Component', () => {
        let comp: JobLocationComponent;
        let fixture: ComponentFixture<JobLocationComponent>;
        let service: JobLocationService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OdaatTestModule],
                declarations: [JobLocationComponent],
                providers: []
            })
                .overrideTemplate(JobLocationComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(JobLocationComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(JobLocationService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new JobLocation(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.jobLocations[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
