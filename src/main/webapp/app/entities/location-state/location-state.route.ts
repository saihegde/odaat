import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocationState } from 'app/shared/model/location-state.model';
import { LocationStateService } from './location-state.service';
import { LocationStateComponent } from './location-state.component';
import { LocationStateDetailComponent } from './location-state-detail.component';
import { LocationStateUpdateComponent } from './location-state-update.component';
import { LocationStateDeletePopupComponent } from './location-state-delete-dialog.component';
import { ILocationState } from 'app/shared/model/location-state.model';

@Injectable({ providedIn: 'root' })
export class LocationStateResolve implements Resolve<ILocationState> {
    constructor(private service: LocationStateService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((locationState: HttpResponse<LocationState>) => locationState.body));
        }
        return of(new LocationState());
    }
}

export const locationStateRoute: Routes = [
    {
        path: 'location-state',
        component: LocationStateComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'odaatApp.locationState.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'location-state/:id/view',
        component: LocationStateDetailComponent,
        resolve: {
            locationState: LocationStateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'odaatApp.locationState.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'location-state/new',
        component: LocationStateUpdateComponent,
        resolve: {
            locationState: LocationStateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'odaatApp.locationState.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'location-state/:id/edit',
        component: LocationStateUpdateComponent,
        resolve: {
            locationState: LocationStateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'odaatApp.locationState.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const locationStatePopupRoute: Routes = [
    {
        path: 'location-state/:id/delete',
        component: LocationStateDeletePopupComponent,
        resolve: {
            locationState: LocationStateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'odaatApp.locationState.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
