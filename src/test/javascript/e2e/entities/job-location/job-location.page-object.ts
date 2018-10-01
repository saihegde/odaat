import { element, by, ElementFinder } from 'protractor';

export class JobLocationComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-job-location div table .btn-danger'));
    title = element.all(by.css('jhi-job-location div h2#page-heading span')).first();

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

export class JobLocationUpdatePage {
    pageTitle = element(by.id('jhi-job-location-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    addressLine1Input = element(by.id('field_addressLine1'));
    addressLine2Input = element(by.id('field_addressLine2'));
    cityInput = element(by.id('field_city'));
    zipcodeInput = element(by.id('field_zipcode'));
    stateSelect = element(by.id('field_state'));
    countrySelect = element(by.id('field_country'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setAddressLine1Input(addressLine1) {
        await this.addressLine1Input.sendKeys(addressLine1);
    }

    async getAddressLine1Input() {
        return this.addressLine1Input.getAttribute('value');
    }

    async setAddressLine2Input(addressLine2) {
        await this.addressLine2Input.sendKeys(addressLine2);
    }

    async getAddressLine2Input() {
        return this.addressLine2Input.getAttribute('value');
    }

    async setCityInput(city) {
        await this.cityInput.sendKeys(city);
    }

    async getCityInput() {
        return this.cityInput.getAttribute('value');
    }

    async setZipcodeInput(zipcode) {
        await this.zipcodeInput.sendKeys(zipcode);
    }

    async getZipcodeInput() {
        return this.zipcodeInput.getAttribute('value');
    }

    async stateSelectLastOption() {
        await this.stateSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async stateSelectOption(option) {
        await this.stateSelect.sendKeys(option);
    }

    getStateSelect(): ElementFinder {
        return this.stateSelect;
    }

    async getStateSelectedOption() {
        return this.stateSelect.element(by.css('option:checked')).getText();
    }

    async countrySelectLastOption() {
        await this.countrySelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async countrySelectOption(option) {
        await this.countrySelect.sendKeys(option);
    }

    getCountrySelect(): ElementFinder {
        return this.countrySelect;
    }

    async getCountrySelectedOption() {
        return this.countrySelect.element(by.css('option:checked')).getText();
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

export class JobLocationDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-jobLocation-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-jobLocation'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
