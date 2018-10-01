/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { OdaatTestModule } from '../../../test.module';
import { JobBidUpdateComponent } from 'app/entities/job-bid/job-bid-update.component';
import { JobBidService } from 'app/entities/job-bid/job-bid.service';
import { JobBid } from 'app/shared/model/job-bid.model';

describe('Component Tests', () => {
    describe('JobBid Management Update Component', () => {
        let comp: JobBidUpdateComponent;
        let fixture: ComponentFixture<JobBidUpdateComponent>;
        let service: JobBidService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OdaatTestModule],
                declarations: [JobBidUpdateComponent]
            })
                .overrideTemplate(JobBidUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(JobBidUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(JobBidService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new JobBid(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.jobBid = entity;
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
                    const entity = new JobBid();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.jobBid = entity;
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
