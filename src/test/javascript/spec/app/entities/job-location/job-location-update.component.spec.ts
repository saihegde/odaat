/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { OdaatTestModule } from '../../../test.module';
import { JobLocationUpdateComponent } from 'app/entities/job-location/job-location-update.component';
import { JobLocationService } from 'app/entities/job-location/job-location.service';
import { JobLocation } from 'app/shared/model/job-location.model';

describe('Component Tests', () => {
    describe('JobLocation Management Update Component', () => {
        let comp: JobLocationUpdateComponent;
        let fixture: ComponentFixture<JobLocationUpdateComponent>;
        let service: JobLocationService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OdaatTestModule],
                declarations: [JobLocationUpdateComponent]
            })
                .overrideTemplate(JobLocationUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(JobLocationUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(JobLocationService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new JobLocation(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.jobLocation = entity;
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
                    const entity = new JobLocation();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.jobLocation = entity;
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
