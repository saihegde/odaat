import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { JobBidComponentsPage, JobBidDeleteDialog, JobBidUpdatePage } from './job-bid.page-object';

describe('JobBid e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let jobBidUpdatePage: JobBidUpdatePage;
    let jobBidComponentsPage: JobBidComponentsPage;
    let jobBidDeleteDialog: JobBidDeleteDialog;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load JobBids', async () => {
        await navBarPage.goToEntity('job-bid');
        jobBidComponentsPage = new JobBidComponentsPage();
        expect(await jobBidComponentsPage.getTitle()).toMatch(/odaatApp.jobBid.home.title/);
    });

    it('should load create JobBid page', async () => {
        await jobBidComponentsPage.clickOnCreateButton();
        jobBidUpdatePage = new JobBidUpdatePage();
        expect(await jobBidUpdatePage.getPageTitle()).toMatch(/odaatApp.jobBid.home.createOrEditLabel/);
        await jobBidUpdatePage.cancel();
    });

    it('should create and save JobBids', async () => {
        await jobBidComponentsPage.clickOnCreateButton();
        await jobBidUpdatePage.statusSelectLastOption();
        await jobBidUpdatePage.jobSelectLastOption();
        await jobBidUpdatePage.save();
        expect(await jobBidUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    it('should delete last JobBid', async () => {
        const nbButtonsBeforeDelete = await jobBidComponentsPage.countDeleteButtons();
        await jobBidComponentsPage.clickOnLastDeleteButton();

        jobBidDeleteDialog = new JobBidDeleteDialog();
        expect(await jobBidDeleteDialog.getDialogTitle()).toMatch(/odaatApp.jobBid.delete.question/);
        await jobBidDeleteDialog.clickOnConfirmButton();

        expect(await jobBidComponentsPage.countDeleteButtons()).toBe(nbButtonsBeforeDelete - 1);
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});
