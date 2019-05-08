import {CustomerType} from './customer-type';
import {CustomerTypePlus} from './customer-type-plus';
import {ItemType} from './item-type';

export class Customer implements CustomerType {
    //////

    // region static properties
    private static emptyCustomer: CustomerType = {
        customerNumber: '2018', // Kundennummer
        customerName: 'neuer Kunde',  // Kundenname
        country: 'Deutschland',
        postalCode: '',
        city: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        customerSalesTaxNumber: '000000',
        customerBIC: 'Customer-Bsp-BIC',
        customerIBAN: '',
        mandateIdentification: '', // Mandatsreferenz fuer SEPA-Lastschriftverfahren
        creationTime: new Date(),
        lastUpdateTime: new Date(),
        archived: false
    };

    // endregion
    // region other properties

    customerNumber: string; // Kundennummer
    customerName: string;  // Kundenname
    country: string;
    postalCode: string;
    city: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    customerSalesTaxNumber: string;
    customerBIC: string;
    customerIBAN: string;
    mandateIdentification: string; // Mandatsreferenz fuer SEPA-Lastschriftverfahren
    creationTime: Date;
    lastUpdateTime: Date;
    archived = false;
    private customerId: string; // === key
    key: string;

    // endregion

    constructor(customerId: string, data: CustomerType) {
        // IDs
        this.customerId = customerId; // New Commit after problems with merging
        // other properties
        this.customerNumber = data.customerNumber;
        this.customerName = data.customerName;
        this.country = data.country;
        this.postalCode = data.postalCode;
        this.city = data.city;
        this.addressLine1 = data.addressLine1;
        this.addressLine2 = data.addressLine2;
        this.addressLine3 = data.addressLine3;
        this.customerSalesTaxNumber = data.customerSalesTaxNumber;
        this.customerBIC = data.customerBIC;
        this.customerIBAN = data.customerIBAN;
        this.mandateIdentification = data.mandateIdentification;
        this.creationTime = data.creationTime ? data.creationTime : new Date();
        this.lastUpdateTime = data.lastUpdateTime ? data.lastUpdateTime : new Date();
        this.archived = data.archived;
    }

    // region static methods
    public static getEmptyCustomer(): CustomerType {
        return new Customer('emptyCustomer', Customer.emptyCustomer);
    }

    public static createNewCustomerId() {
        const methDate: Date = new Date();
        return 'Cus' + methDate.getTime();
    }

    public static createNewCustomer(): Customer { // factory pattern, prime example
        let methCustomer: Customer;
        methCustomer = new Customer(this.createNewCustomerId(), this.emptyCustomer);
        return methCustomer;
    }

    public static normalizeCustomer(inCustomer: any): Customer {
        const cData: CustomerType = {
            archived: !!inCustomer.archived,
            addressLine1: inCustomer.addressLine1 ? inCustomer.addressLine1 : '',
            addressLine2: inCustomer.addressLine2 ? inCustomer.addressLine2 : '',
            addressLine3: inCustomer.addressLine3 ? inCustomer.addressLine3 : '',
            city: inCustomer.city ? inCustomer.city : '',
            country: inCustomer.country ? inCustomer.country : '',
            creationTime: inCustomer.creationTime ? inCustomer.creationTime.toDate() : new Date(),
            customerBIC: inCustomer.customerBIC ? inCustomer.customerBIC : '',
            customerIBAN: inCustomer.customerIBAN ? inCustomer.customerIBAN : '',
            customerName: inCustomer.customerName ? inCustomer.customerName : '',  // Kundenname
            customerNumber: inCustomer.customerNumber ? inCustomer.customerNumber : '', // Kundennummer
            customerSalesTaxNumber: inCustomer.customerSalesTaxNumber ? inCustomer.customerSalesTaxNumber : '',
            mandateIdentification: inCustomer.mandateIdentification ? inCustomer.mandateIdentification : '',
            lastUpdateTime: new Date(),
            postalCode: inCustomer.postalCode ? inCustomer.postalCode : ''
        };
        return new Customer(inCustomer.key, cData);
    }

    // endregion
    // region getter
    public getCustomerId(): string {
        return this.customerId;
    }

    public exportCustomerData(): CustomerType {
        return {
            customerNumber: this.customerNumber, // Kundennummer
            customerName: this.customerName,  // Kundenname
            country: this.country,
            postalCode: this.postalCode,
            city: this.city,
            addressLine1: this.addressLine1,
            addressLine2: this.addressLine2,
            addressLine3: this.addressLine3,
            customerSalesTaxNumber: this.customerSalesTaxNumber,
            customerBIC: this.customerBIC,
            customerIBAN: this.customerIBAN,
            mandateIdentification: this.mandateIdentification,
            creationTime: this.creationTime ? this.creationTime : new Date(),
            lastUpdateTime: this.lastUpdateTime ? this.lastUpdateTime : new Date(),
            archived: this.archived
        };
    }

    public exportCustomerDataPlus(): CustomerTypePlus {
        return {
            customerId: this.customerId,
            customerNumber: this.customerNumber, // Kundennummer
            customerName: this.customerName,  // Kundenname
            country: this.country,
            postalCode: this.postalCode,
            city: this.city,
            addressLine1: this.addressLine1,
            addressLine2: this.addressLine2,
            addressLine3: this.addressLine3,
            customerSalesTaxNumber: this.customerSalesTaxNumber,
            customerBIC: this.customerBIC,
            customerIBAN: this.customerIBAN,
            mandateIdentification: this.mandateIdentification,
            creationTime: this.creationTime ? this.creationTime : new Date(),
            lastUpdateTime: this.lastUpdateTime ? this.lastUpdateTime : new Date(),
            archived: this.archived
        };
    }


    // endregion
}
