import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { JobLocation } from 'app/shared/model/job-location.model';
import { JobLocationService } from './job-location.service';
import { JobLocationComponent } from './job-location.component';
import { JobLocationDetailComponent } from './job-location-detail.component';
import { JobLocationUpdateComponent } from './job-location-update.component';
import { JobLocationDeletePopupComponent } from './job-location-delete-dialog.component';
import { IJobLocation } from 'app/shared/model/job-location.model';

@Injectable({ providedIn: 'root' })
export class JobLocationResolve implements Resolve<IJobLocation> {
    constructor(private service: JobLocationService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((jobLocation: HttpResponse<JobLocation>) => jobLocation.body));
        }
        return of(new JobLocation());
    }
}

export const jobLocationRoute: Routes = [
    {
        path: 'job-location',
        component: JobLocationComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'odaatApp.jobLocation.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'job-location/:id/view',
        component: JobLocationDetailComponent,
        resolve: {
            jobLocation: JobLocationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'odaatApp.jobLocation.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'job-location/new',
        component: JobLocationUpdateComponent,
        resolve: {
            jobLocation: JobLocationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'odaatApp.jobLocation.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'job-location/:id/edit',
        component: JobLocationUpdateComponent,
        resolve: {
            jobLocation: JobLocationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'odaatApp.jobLocation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const jobLocationPopupRoute: Routes = [
    {
        path: 'job-location/:id/delete',
        component: JobLocationDeletePopupComponent,
        resolve: {
            jobLocation: JobLocationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'odaatApp.jobLocation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
