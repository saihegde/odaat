import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { LocationStateComponentsPage, LocationStateDeleteDialog, LocationStateUpdatePage } from './location-state.page-object';

describe('LocationState e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let locationStateUpdatePage: LocationStateUpdatePage;
    let locationStateComponentsPage: LocationStateComponentsPage;
    let locationStateDeleteDialog: LocationStateDeleteDialog;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load LocationStates', async () => {
        await navBarPage.goToEntity('location-state');
        locationStateComponentsPage = new LocationStateComponentsPage();
        expect(await locationStateComponentsPage.getTitle()).toMatch(/odaatApp.locationState.home.title/);
    });

    it('should load create LocationState page', async () => {
        await locationStateComponentsPage.clickOnCreateButton();
        locationStateUpdatePage = new LocationStateUpdatePage();
        expect(await locationStateUpdatePage.getPageTitle()).toMatch(/odaatApp.locationState.home.createOrEditLabel/);
        await locationStateUpdatePage.cancel();
    });

    it('should create and save LocationStates', async () => {
        await locationStateComponentsPage.clickOnCreateButton();
        await locationStateUpdatePage.setNameInput('name');
        expect(await locationStateUpdatePage.getNameInput()).toMatch('name');
        await locationStateUpdatePage.countrySelectLastOption();
        await locationStateUpdatePage.save();
        expect(await locationStateUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    it('should delete last LocationState', async () => {
        const nbButtonsBeforeDelete = await locationStateComponentsPage.countDeleteButtons();
        await locationStateComponentsPage.clickOnLastDeleteButton();

        locationStateDeleteDialog = new LocationStateDeleteDialog();
        expect(await locationStateDeleteDialog.getDialogTitle()).toMatch(/odaatApp.locationState.delete.question/);
        await locationStateDeleteDialog.clickOnConfirmButton();

        expect(await locationStateComponentsPage.countDeleteButtons()).toBe(nbButtonsBeforeDelete - 1);
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});
