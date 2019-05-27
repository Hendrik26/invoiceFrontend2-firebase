import {SettingType} from './setting-type';

export class Setting implements SettingType {

    headerShortAddress: string;
    headerAddressLine01: string;
    /* headerAddressLine02: string;
    headerAddressLine03: string;
    headerAddressLine04: string;
    headerAddressLine05: string;
    headerAddressLine06: string;
    headerAddressLine07: string;
    headerAddressLine08: string;
    headerAddressLine09: string;
    headerAddressLine10: string;
    headerLocation: string;
    creditorIdentificationNumber: string;
    footerAddressLine01: string;
    footerAddressLine02: string;
    footerAddressLine03: string;
    footerAddressLine04: string;
    footerAddressLine05: string;
    footerContactLine01: string;
    footerContactLine02: string;
    footerContactLine03: string;
    footerContactLine04: string;
    footerContactLine05: string;
    footerBankAccount01: string;
    footerBankAccount02: string;
    footerBankAccount03: string;
    footerBankAccount04: string;
    footerBankAccount05: string;
    footerTaxIdentification: string;
    LogoUrl: string; */
    creationTime: Date;

    public static normalizeSetting(inSetting: any): Setting {
        let setting = new Setting();
        setting.headerShortAddress = inSetting.headerShortAddress ? inSetting.headerShortAddress : '';
        setting.headerAddressLine01 = inSetting.headerAddressLine01 ? inSetting.headerAddressLine01 : '';
        setting.creationTime = inSetting.creationTime ? inSetting.creationTime : new Date();
        return setting;
    }

    constructor() {
        this.headerShortAddress = '';
        this.headerAddressLine01 = '';
        this.creationTime = new Date();
    }

    exportSettingData(): SettingType {
        return {
            headerShortAddress: this.headerShortAddress ? this.headerShortAddress : '',
            headerAddressLine01: this.headerAddressLine01 ? this.headerAddressLine01 : '',
            creationTime: new Date()
        };
    }

}
