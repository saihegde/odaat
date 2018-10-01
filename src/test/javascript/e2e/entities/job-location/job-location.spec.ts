import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { JobLocationComponentsPage, JobLocationDeleteDialog, JobLocationUpdatePage } from './job-location.page-object';

describe('JobLocation e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let jobLocationUpdatePage: JobLocationUpdatePage;
    let jobLocationComponentsPage: JobLocationComponentsPage;
    let jobLocationDeleteDialog: JobLocationDeleteDialog;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load JobLocations', async () => {
        await navBarPage.goToEntity('job-location');
        jobLocationComponentsPage = new JobLocationComponentsPage();
        expect(await jobLocationComponentsPage.getTitle()).toMatch(/odaatApp.jobLocation.home.title/);
    });

    it('should load create JobLocation page', async () => {
        await jobLocationComponentsPage.clickOnCreateButton();
        jobLocationUpdatePage = new JobLocationUpdatePage();
        expect(await jobLocationUpdatePage.getPageTitle()).toMatch(/odaatApp.jobLocation.home.createOrEditLabel/);
        await jobLocationUpdatePage.cancel();
    });

    it('should create and save JobLocations', async () => {
        await jobLocationComponentsPage.clickOnCreateButton();
        await jobLocationUpdatePage.setAddressLine1Input('addressLine1');
        expect(await jobLocationUpdatePage.getAddressLine1Input()).toMatch('addressLine1');
        await jobLocationUpdatePage.setAddressLine2Input('addressLine2');
        expect(await jobLocationUpdatePage.getAddressLine2Input()).toMatch('addressLine2');
        await jobLocationUpdatePage.setCityInput('city');
        expect(await jobLocationUpdatePage.getCityInput()).toMatch('city');
        await jobLocationUpdatePage.setZipcodeInput('zipcode');
        expect(await jobLocationUpdatePage.getZipcodeInput()).toMatch('zipcode');
        await jobLocationUpdatePage.stateSelectLastOption();
        await jobLocationUpdatePage.countrySelectLastOption();
        await jobLocationUpdatePage.save();
        expect(await jobLocationUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    it('should delete last JobLocation', async () => {
        const nbButtonsBeforeDelete = await jobLocationComponentsPage.countDeleteButtons();
        await jobLocationComponentsPage.clickOnLastDeleteButton();

        jobLocationDeleteDialog = new JobLocationDeleteDialog();
        expect(await jobLocationDeleteDialog.getDialogTitle()).toMatch(/odaatApp.jobLocation.delete.question/);
        await jobLocationDeleteDialog.clickOnConfirmButton();

        expect(await jobLocationComponentsPage.countDeleteButtons()).toBe(nbButtonsBeforeDelete - 1);
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});
