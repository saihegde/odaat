import { element, by, ElementFinder } from 'protractor';

export class JobBidComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-job-bid div table .btn-danger'));
    title = element.all(by.css('jhi-job-bid div h2#page-heading span')).first();

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

export class JobBidUpdatePage {
    pageTitle = element(by.id('jhi-job-bid-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    statusSelect = element(by.id('field_status'));
    jobSelect = element(by.id('field_job'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setStatusSelect(status) {
        await this.statusSelect.sendKeys(status);
    }

    async getStatusSelect() {
        return this.statusSelect.element(by.css('option:checked')).getText();
    }

    async statusSelectLastOption() {
        await this.statusSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async jobSelectLastOption() {
        await this.jobSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async jobSelectOption(option) {
        await this.jobSelect.sendKeys(option);
    }

    getJobSelect(): ElementFinder {
        return this.jobSelect;
    }

    async getJobSelectedOption() {
        return this.jobSelect.element(by.css('option:checked')).getText();
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

export class JobBidDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-jobBid-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-jobBid'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
