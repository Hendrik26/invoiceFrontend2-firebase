export interface CustomerType {
    customerNumber: string; // Kundennummer
    customerName: string;  // Kundenname
    country:  string;
    postalCode:  string;
    city:  string;
    addressLine1:  string;
    addressLine2:  string;
    addressLine3:  string;
    customerSalesTaxNumber:  string;
    customerBIC: string;
    customerIBAN: string;
    mandateIdentification: string; // Mandatsreferenz fuer SEPA-Lastschriftverfahren
    creationTime: Date;
    lastUpdateTime: Date;
    archived: boolean;
}
