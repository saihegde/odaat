import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { OdaatCountryModule } from './country/country.module';
import { OdaatLocationStateModule } from './location-state/location-state.module';
import { OdaatUserProfileModule } from './user-profile/user-profile.module';
import { OdaatJobModule } from './job/job.module';
import { OdaatJobLocationModule } from './job-location/job-location.module';
import { OdaatJobBidModule } from './job-bid/job-bid.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        OdaatCountryModule,
        OdaatLocationStateModule,
        OdaatUserProfileModule,
        OdaatJobModule,
        OdaatJobLocationModule,
        OdaatJobBidModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OdaatEntityModule {}
