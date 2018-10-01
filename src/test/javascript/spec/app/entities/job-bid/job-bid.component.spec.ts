/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { OdaatTestModule } from '../../../test.module';
import { JobBidComponent } from 'app/entities/job-bid/job-bid.component';
import { JobBidService } from 'app/entities/job-bid/job-bid.service';
import { JobBid } from 'app/shared/model/job-bid.model';

describe('Component Tests', () => {
    describe('JobBid Management Component', () => {
        let comp: JobBidComponent;
        let fixture: ComponentFixture<JobBidComponent>;
        let service: JobBidService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OdaatTestModule],
                declarations: [JobBidComponent],
                providers: []
            })
                .overrideTemplate(JobBidComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(JobBidComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(JobBidService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new JobBid(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.jobBids[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
