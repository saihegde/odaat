import { element, by, ElementFinder } from 'protractor';

export class UserProfileComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-user-profile div table .btn-danger'));
    title = element.all(by.css('jhi-user-profile div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async clickOnLastDeleteButton() {
        await this.deleteButtons.last().click();
    }

    async countDeleteButtons() {
        return this.deleteButtons.count();
    }

    async getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class UserProfileUpdatePage {
    pageTitle = element(by.id('jhi-user-profile-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    receiveEmailAlertsInput = element(by.id('field_receiveEmailAlerts'));
    receiveTextAlertsInput = element(by.id('field_receiveTextAlerts'));
    notifyOfJobsInAreaInput = element(by.id('field_notifyOfJobsInArea'));
    userSelect = element(by.id('field_user'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    getReceiveEmailAlertsInput() {
        return this.receiveEmailAlertsInput;
    }
    getReceiveTextAlertsInput() {
        return this.receiveTextAlertsInput;
    }
    getNotifyOfJobsInAreaInput() {
        return this.notifyOfJobsInAreaInput;
    }

    async userSelectLastOption() {
        await this.userSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async userSelectOption(option) {
        await this.userSelect.sendKeys(option);
    }

    getUserSelect(): ElementFinder {
        return this.userSelect;
    }

    async getUserSelectedOption() {
        return this.userSelect.element(by.css('option:checked')).getText();
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}

export class UserProfileDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-userProfile-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-userProfile'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
