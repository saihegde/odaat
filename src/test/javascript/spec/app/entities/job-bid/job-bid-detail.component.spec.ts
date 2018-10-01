/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OdaatTestModule } from '../../../test.module';
import { JobBidDetailComponent } from 'app/entities/job-bid/job-bid-detail.component';
import { JobBid } from 'app/shared/model/job-bid.model';

describe('Component Tests', () => {
    describe('JobBid Management Detail Component', () => {
        let comp: JobBidDetailComponent;
        let fixture: ComponentFixture<JobBidDetailComponent>;
        const route = ({ data: of({ jobBid: new JobBid(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OdaatTestModule],
                declarations: [JobBidDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(JobBidDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(JobBidDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.jobBid).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
