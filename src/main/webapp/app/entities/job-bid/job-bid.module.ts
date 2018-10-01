import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OdaatSharedModule } from 'app/shared';
import {
    JobBidComponent,
    JobBidDetailComponent,
    JobBidUpdateComponent,
    JobBidDeletePopupComponent,
    JobBidDeleteDialogComponent,
    jobBidRoute,
    jobBidPopupRoute
} from './';

const ENTITY_STATES = [...jobBidRoute, ...jobBidPopupRoute];

@NgModule({
    imports: [OdaatSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [JobBidComponent, JobBidDetailComponent, JobBidUpdateComponent, JobBidDeleteDialogComponent, JobBidDeletePopupComponent],
    entryComponents: [JobBidComponent, JobBidUpdateComponent, JobBidDeleteDialogComponent, JobBidDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OdaatJobBidModule {}
