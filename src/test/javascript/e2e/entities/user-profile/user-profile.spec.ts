import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { UserProfileComponentsPage, UserProfileDeleteDialog, UserProfileUpdatePage } from './user-profile.page-object';

describe('UserProfile e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let userProfileUpdatePage: UserProfileUpdatePage;
    let userProfileComponentsPage: UserProfileComponentsPage;
    let userProfileDeleteDialog: UserProfileDeleteDialog;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load UserProfiles', async () => {
        await navBarPage.goToEntity('user-profile');
        userProfileComponentsPage = new UserProfileComponentsPage();
        expect(await userProfileComponentsPage.getTitle()).toMatch(/odaatApp.userProfile.home.title/);
    });

    it('should load create UserProfile page', async () => {
        await userProfileComponentsPage.clickOnCreateButton();
        userProfileUpdatePage = new UserProfileUpdatePage();
        expect(await userProfileUpdatePage.getPageTitle()).toMatch(/odaatApp.userProfile.home.createOrEditLabel/);
        await userProfileUpdatePage.cancel();
    });

    it('should create and save UserProfiles', async () => {
        await userProfileComponentsPage.clickOnCreateButton();
        const selectedReceiveEmailAlerts = userProfileUpdatePage.getReceiveEmailAlertsInput();
        if (await selectedReceiveEmailAlerts.isSelected()) {
            await userProfileUpdatePage.getReceiveEmailAlertsInput().click();
            expect(await userProfileUpdatePage.getReceiveEmailAlertsInput().isSelected()).toBeFalsy();
        } else {
            await userProfileUpdatePage.getReceiveEmailAlertsInput().click();
            expect(await userProfileUpdatePage.getReceiveEmailAlertsInput().isSelected()).toBeTruthy();
        }
        const selectedReceiveTextAlerts = userProfileUpdatePage.getReceiveTextAlertsInput();
        if (await selectedReceiveTextAlerts.isSelected()) {
            await userProfileUpdatePage.getReceiveTextAlertsInput().click();
            expect(await userProfileUpdatePage.getReceiveTextAlertsInput().isSelected()).toBeFalsy();
        } else {
            await userProfileUpdatePage.getReceiveTextAlertsInput().click();
            expect(await userProfileUpdatePage.getReceiveTextAlertsInput().isSelected()).toBeTruthy();
        }
        const selectedNotifyOfJobsInArea = userProfileUpdatePage.getNotifyOfJobsInAreaInput();
        if (await selectedNotifyOfJobsInArea.isSelected()) {
            await userProfileUpdatePage.getNotifyOfJobsInAreaInput().click();
            expect(await userProfileUpdatePage.getNotifyOfJobsInAreaInput().isSelected()).toBeFalsy();
        } else {
            await userProfileUpdatePage.getNotifyOfJobsInAreaInput().click();
            expect(await userProfileUpdatePage.getNotifyOfJobsInAreaInput().isSelected()).toBeTruthy();
        }
        await userProfileUpdatePage.userSelectLastOption();
        await userProfileUpdatePage.save();
        expect(await userProfileUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    it('should delete last UserProfile', async () => {
        const nbButtonsBeforeDelete = await userProfileComponentsPage.countDeleteButtons();
        await userProfileComponentsPage.clickOnLastDeleteButton();

        userProfileDeleteDialog = new UserProfileDeleteDialog();
        expect(await userProfileDeleteDialog.getDialogTitle()).toMatch(/odaatApp.userProfile.delete.question/);
        await userProfileDeleteDialog.clickOnConfirmButton();

        expect(await userProfileComponentsPage.countDeleteButtons()).toBe(nbButtonsBeforeDelete - 1);
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});
