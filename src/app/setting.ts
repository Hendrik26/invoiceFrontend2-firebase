import {SettingType} from './setting-type';

export class Setting implements SettingType {

    headerShortAddress: string;
    headerAddressLine01: string;
    headerAddressLine02: string;
    headerAddressLine03: string;
    headerAddressLine04: string;
    headerAddressLine05: string;
    headerLocation: string;
    footerAddressLine01: string;
    footerAddressLine02: string;
    footerAddressLine03: string;
    footerAddressLine04: string;
    footerAddressLine05: string;
    footerAddressCountry: string;
    footerContactLine01: string;
    footerContactLine02: string;
    footerContactLine03: string;
    footerContactLine04: string;
    footerContactLine05: string;
    footerContactLine11: string;
    footerContactLine12: string;
    footerContactLine13: string;
    footerContactLine14: string;
    footerContactLine15: string;
    footerBankConnection01: string;
    footerBankConnection02: string;
    footerBankConnection03: string;
    footerBankConnection04: string;
    footerBankConnection05: string;
    footerTaxIdentification: string;
    creditorIdentificationNumber: string;
    logoId: string;
    creationTime: Date;

    constructor() {
        this.headerShortAddress = '';
        this.headerAddressLine01 = '';
        this.headerAddressLine02 = '';
        this.headerAddressLine03 = '';
        this.headerAddressLine04 = '';
        this.headerAddressLine05 = '';
        this.headerLocation = '';
        this.footerAddressLine01 = '';
        this.footerAddressLine02 = '';
        this.footerAddressLine03 = '';
        this.footerAddressLine04 = '';
        this.footerAddressLine05 = '';
        this.footerAddressCountry = '';
        this.footerContactLine01 = '';
        this.footerContactLine02 = '';
        this.footerContactLine03 = '';
        this.footerContactLine04 = '';
        this.footerContactLine05 = '';
        this.footerContactLine11 = '';
        this.footerContactLine12 = '';
        this.footerContactLine13 = '';
        this.footerContactLine14 = '';
        this.footerContactLine15 = '';
        this.footerBankConnection01 = '';
        this.footerBankConnection02 = '';
        this.footerBankConnection03 = '';
        this.footerBankConnection04 = '';
        this.footerBankConnection05 = '';
        this.footerTaxIdentification = '';
        this.creditorIdentificationNumber = '';
        this.logoId = '';
        this.creationTime = new Date();
    }

    public static normalizeSetting(inSetting: any): Setting {
        const setting = new Setting();
        setting.headerShortAddress = inSetting.headerShortAddress ? inSetting.headerShortAddress : '';
        setting.headerAddressLine01 = inSetting.headerAddressLine01 ? inSetting.headerAddressLine01 : '';
        setting.headerAddressLine02 = inSetting.headerAddressLine02 ? inSetting.headerAddressLine02 : '';
        setting.headerAddressLine03 = inSetting.headerAddressLine03 ? inSetting.headerAddressLine03 : '';
        setting.headerAddressLine04 = inSetting.headerAddressLine04 ? inSetting.headerAddressLine04 : '';
        setting.headerAddressLine05 = inSetting.headerAddressLine05 ? inSetting.headerAddressLine05 : '';
        setting.headerLocation = inSetting.headerLocation ? inSetting.headerLocation : '';
        setting.footerAddressLine01 = inSetting.footerAddressLine01 ? inSetting.footerAddressLine01 : '';
        setting.footerAddressLine02 = inSetting.footerAddressLine02 ? inSetting.footerAddressLine02 : '';
        setting.footerAddressLine03 = inSetting.footerAddressLine03 ? inSetting.footerAddressLine03 : '';
        setting.footerAddressLine04 = inSetting.footerAddressLine04 ? inSetting.footerAddressLine04 : '';
        setting.footerAddressLine05 = inSetting.footerAddressLine05 ? inSetting.footerAddressLine05 : '';
        setting.footerAddressCountry = inSetting.footerAddressCountry ? inSetting.footerAddressCountry : '';
        setting.footerContactLine01 = inSetting.footerContactLine01 ? inSetting.footerContactLine01 : '';
        setting.footerContactLine02 = inSetting.footerContactLine02 ? inSetting.footerContactLine02 : '';
        setting.footerContactLine03 = inSetting.footerContactLine03 ? inSetting.footerContactLine03 : '';
        setting.footerContactLine04 = inSetting.footerContactLine04 ? inSetting.footerContactLine04 : '';
        setting.footerContactLine05 = inSetting.footerContactLine05 ? inSetting.footerContactLine05 : '';
        setting.footerContactLine11 = inSetting.footerContactLine11 ? inSetting.footerContactLine11 : '';
        setting.footerContactLine12 = inSetting.footerContactLine12 ? inSetting.footerContactLine12 : '';
        setting.footerContactLine13 = inSetting.footerContactLine13 ? inSetting.footerContactLine13 : '';
        setting.footerContactLine14 = inSetting.footerContactLine14 ? inSetting.footerContactLine14 : '';
        setting.footerContactLine15 = inSetting.footerContactLine15 ? inSetting.footerContactLine15 : '';
        setting.footerBankConnection01 = inSetting.footerBankConnection01 ? inSetting.footerBankConnection01 : '';
        setting.footerBankConnection02 = inSetting.footerBankConnection02 ? inSetting.footerBankConnection02 : '';
        setting.footerBankConnection03 = inSetting.footerBankConnection03 ? inSetting.footerBankConnection03 : '';
        setting.footerBankConnection04 = inSetting.footerBankConnection04 ? inSetting.footerBankConnection04 : '';
        setting.footerBankConnection05 = inSetting.footerBankConnection05 ? inSetting.footerBankConnection05 : '';
        setting.footerTaxIdentification = inSetting.footerTaxIdentification ? inSetting.footerTaxIdentification : '';
        setting.creditorIdentificationNumber = inSetting.logoId ? inSetting.creditorIdentificationNumber : '';
        setting.logoId = inSetting.logoId ? inSetting.logoId : '';
        setting.creationTime = inSetting.creationTime ? inSetting.creationTime : new Date();
        return setting;
    }

    exportSettingData(): SettingType {
        return {
            headerShortAddress: this.headerShortAddress,
            headerAddressLine01: this.headerAddressLine01,
            headerAddressLine02: this.headerAddressLine02,
            headerAddressLine03: this.headerAddressLine03,
            headerAddressLine04: this.headerAddressLine04,
            headerAddressLine05: this.headerAddressLine05,
            headerLocation: this.headerLocation,
            footerAddressLine01: this.footerAddressLine01,
            footerAddressLine02: this.footerAddressLine02,
            footerAddressLine03: this.footerAddressLine03,
            footerAddressLine04: this.footerAddressLine04,
            footerAddressLine05: this.footerAddressLine05,
            footerAddressCountry: this.footerAddressCountry,
            footerContactLine01: this.footerContactLine01,
            footerContactLine02: this.footerContactLine02,
            footerContactLine03: this.footerContactLine03,
            footerContactLine04: this.footerContactLine04,
            footerContactLine05: this.footerContactLine05,
            footerContactLine11: this.footerContactLine11,
            footerContactLine12: this.footerContactLine12,
            footerContactLine13: this.footerContactLine13,
            footerContactLine14: this.footerContactLine14,
            footerContactLine15: this.footerContactLine15,
            footerBankConnection01: this.footerBankConnection01,
            footerBankConnection02: this.footerBankConnection02,
            footerBankConnection03: this.footerBankConnection03,
            footerBankConnection04: this.footerBankConnection04,
            footerBankConnection05: this.footerBankConnection05,
            footerTaxIdentification: this.footerTaxIdentification,
            creditorIdentificationNumber: this.creditorIdentificationNumber,
            logoId: this.logoId,
            creationTime: new Date()
        };
    }

}
