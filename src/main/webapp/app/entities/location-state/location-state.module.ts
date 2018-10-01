import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OdaatSharedModule } from 'app/shared';
import {
    LocationStateComponent,
    LocationStateDetailComponent,
    LocationStateUpdateComponent,
    LocationStateDeletePopupComponent,
    LocationStateDeleteDialogComponent,
    locationStateRoute,
    locationStatePopupRoute
} from './';

const ENTITY_STATES = [...locationStateRoute, ...locationStatePopupRoute];

@NgModule({
    imports: [OdaatSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        LocationStateComponent,
        LocationStateDetailComponent,
        LocationStateUpdateComponent,
        LocationStateDeleteDialogComponent,
        LocationStateDeletePopupComponent
    ],
    entryComponents: [
        LocationStateComponent,
        LocationStateUpdateComponent,
        LocationStateDeleteDialogComponent,
        LocationStateDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OdaatLocationStateModule {}
