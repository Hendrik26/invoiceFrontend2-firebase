import {CustomerType} from './customer-type';

// import {InvoiceType} from './invoice-type';

export class Customer implements CustomerType {
    //region static properties
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
        creationTime: new Date()
    };

    private static editedCustomer: CustomerType = {
        customerNumber: '2018', // Kundennummer
        customerName: 'neuer Kunde',  // Kundenname
        country: 'Deutschland',
        postalCode: '',
        city: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        customerSalesTaxNumber: '000000',
        creationTime: new Date()
    };
    //endregion
    //region other properties

    customerNumber: string; // Kundennummer
    customerName: string;  // Kundenname
    country: string;
    postalCode: string;
    city: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    customerSalesTaxNumber: string;
    creationTime: Date;
    private customerId: string; // === key
    key: string;

    //endregion

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
        this.creationTime = new Date();
    }

    //region static methods
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
       // this.editedCustomer = {
        const cData : CustomerType = {
            customerNumber: inCustomer.customerNumber, // Kundennummer
            customerName: inCustomer.customerName,  // Kundenname
            country: inCustomer.country,
            postalCode: inCustomer.postalCode,
            city: inCustomer.city,
            addressLine1: inCustomer.addressLine1,
            addressLine2: inCustomer.addressLine2,
            addressLine3: inCustomer.addressLine3,
            customerSalesTaxNumber: inCustomer.customerSalesTaxNumber,
            creationTime: inCustomer.creationTime
        };
        return new Customer(inCustomer.key, /* this.editedCustomer */ cData);
    }

    public static normalizeCustomerList(inCustomers: any[]): Customer[] {
        const retCustomers: Customer[] = [];
        // TODO: add transformation here
        return retCustomers;
    }

    //endregion
    //region getter
    public getCustomerId(): string {
        return this.customerId;
        // return this.key;
    }

    //endregion
}