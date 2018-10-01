import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OdaatSharedModule } from 'app/shared';
import {
    JobLocationComponent,
    JobLocationDetailComponent,
    JobLocationUpdateComponent,
    JobLocationDeletePopupComponent,
    JobLocationDeleteDialogComponent,
    jobLocationRoute,
    jobLocationPopupRoute
} from './';

const ENTITY_STATES = [...jobLocationRoute, ...jobLocationPopupRoute];

@NgModule({
    imports: [OdaatSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        JobLocationComponent,
        JobLocationDetailComponent,
        JobLocationUpdateComponent,
        JobLocationDeleteDialogComponent,
        JobLocationDeletePopupComponent
    ],
    entryComponents: [JobLocationComponent, JobLocationUpdateComponent, JobLocationDeleteDialogComponent, JobLocationDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OdaatJobLocationModule {}
