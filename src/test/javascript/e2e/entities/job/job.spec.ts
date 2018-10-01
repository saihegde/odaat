import { browser, ExpectedConditions as ec, protractor } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { JobComponentsPage, JobDeleteDialog, JobUpdatePage } from './job.page-object';

describe('Job e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let jobUpdatePage: JobUpdatePage;
    let jobComponentsPage: JobComponentsPage;
    let jobDeleteDialog: JobDeleteDialog;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Jobs', async () => {
        await navBarPage.goToEntity('job');
        jobComponentsPage = new JobComponentsPage();
        expect(await jobComponentsPage.getTitle()).toMatch(/odaatApp.job.home.title/);
    });

    it('should load create Job page', async () => {
        await jobComponentsPage.clickOnCreateButton();
        jobUpdatePage = new JobUpdatePage();
        expect(await jobUpdatePage.getPageTitle()).toMatch(/odaatApp.job.home.createOrEditLabel/);
        await jobUpdatePage.cancel();
    });

    it('should create and save Jobs', async () => {
        await jobComponentsPage.clickOnCreateButton();
        await jobUpdatePage.setTitleInput('title');
        expect(await jobUpdatePage.getTitleInput()).toMatch('title');
        await jobUpdatePage.setDescriptionInput('description');
        expect(await jobUpdatePage.getDescriptionInput()).toMatch('description');
        await jobUpdatePage.setJobDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
        expect(await jobUpdatePage.getJobDateInput()).toContain('2001-01-01T02:30');
        await jobUpdatePage.setPayInput('5');
        expect(await jobUpdatePage.getPayInput()).toMatch('5');
        await jobUpdatePage.locationSelectLastOption();
        await jobUpdatePage.ownerSelectLastOption();
        await jobUpdatePage.save();
        expect(await jobUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    it('should delete last Job', async () => {
        const nbButtonsBeforeDelete = await jobComponentsPage.countDeleteButtons();
        await jobComponentsPage.clickOnLastDeleteButton();

        jobDeleteDialog = new JobDeleteDialog();
        expect(await jobDeleteDialog.getDialogTitle()).toMatch(/odaatApp.job.delete.question/);
        await jobDeleteDialog.clickOnConfirmButton();

        expect(await jobComponentsPage.countDeleteButtons()).toBe(nbButtonsBeforeDelete - 1);
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});
