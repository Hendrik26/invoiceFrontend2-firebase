import {Item} from './item';
import {InvoiceType} from './invoice-type';
import {InvoiceKind} from './invoice-kind';
import {InvoiceKindType} from './invoice-kind-type';
import {ItemType} from './item-type';
import {INVOICES} from './mock-invoice';

export class Invoice implements InvoiceType {
    // //////////////////////


    //region static properties
    private static emptyData: InvoiceType = {
        /*invoiceDate: new Date(),
        invoiceDueDate: new Date(),
        invoiceIntendedUse: 'die Rechnungsnummer 2018',
        invoiceNumber: '2018',
        recipient: '',
        invoiceState: 'Entwurf',
        wholeCost: 0,
        countReminders: 0,
        timeSpan: 'unknown',
        salesTaxPercentage: 19,
        customerTaxNumber: 'standardCustomerTaxNumber' */
        countReminders: 0, // <th>Anzahl der Mahnungen</th>
        newCreatedInvoice: true,
        //endregion
        currency: '€',

        customerIBAN: 'bspCustomerIBAN',
        mandateIdentification: 'bspMandateIdentification', // Mandatsreferenz fuer SEPA-Lastschriftverfahren

        customerTaxNumber: 'bspCcustomerTaxNumber',
        invoiceDate: new Date(), // <th>Rechnungsdatum</th>
        invoiceDueDate: new Date(), // Faelligkeitsdatum
        invoiceNumber: '2018xy', // <th>RechnungsNr</th>
        invoiceIntendedUse: 'bspInvoiceIntendedUse', // Verwendungszweck
        invoiceKind: InvoiceKind.create(false, false, false),
        invoiceState: 'Entwurf', // <th>Status (Entwurf, bezahlt, ...)</th>
        items: [],
        recipient: 'bspRecipient', // <th>Empfänger</th>
        salesTaxPercentage: 19,
        timeSpan: 'bspTimeSpan', // <th>Rechnungzeitraum</th>

        timespanBegin: new Date(),
        timespanEnd: new Date(),

        wholeCost: -111 // <th>Gesamtpreis</th>
    };
    //endregion
    //region other properties
    countReminders: number; // <th>Anzahl der Mahnungen</th>
    newCreatedInvoice: boolean;
    //endregion
    currency = '€';

    customerIBAN = 'Invoice-Bsp-IBAN';
    mandateIdentification = 'Invoice-Bsp-Mandat'; // Mandatsreferenz fuer SEPA-Lastschriftverfahren

    customerTaxNumber = 'myCustomerTaxNumber';
    invoiceDate: Date; // <th>Rechnungsdatum</th>
    invoiceDueDate: Date; // Faelligkeitsdatum
    invoiceNumber: string; // <th>RechnungsNr</th>
    invoiceIntendedUse: string; // Verwendungszweck
    invoiceKind: InvoiceKind;
    invoiceState: string; // <th>Status (Entwurf, bezahlt, ...)</th>
    items: Item[];
    recipient: string; // <th>Empfänger</th>
    salesTaxPercentage: number;
    timeSpan: string; // <th>Rechnungzeitraum</th>

    timespanBegin: Date;
    timespanEnd: Date;

    wholeCost: number; // <th>Gesamtpreis</th>
    //region IDs
    private invoiceId: string; // <th>Ändern</th>
    //endregion

    constructor(id: string, data: InvoiceType) {
        // IDs
        this.invoiceId = id; // New Commit after problems with merging

        // other properties
        /* this.newCreatedInvoice = true;
        this.invoiceDate = data.invoiceDate;
        this.invoiceDueDate = data.invoiceDueDate;
        this.invoiceIntendedUse = data.invoiceIntendedUse;
        this.invoiceKind = InvoiceKind.create(false, false, false);
        this.invoiceNumber = data.invoiceNumber;
        this.recipient = data.recipient;
        this.invoiceState = data.invoiceState;
        this.wholeCost = data.wholeCost;
        this.countReminders = data.countReminders;
        this.timeSpan = data.timeSpan;
        this.currency = data.currency || '€';
        this.salesTaxPercentage = data.salesTaxPercentage;
        this.items = [];
        this.customerTaxNumber = data.customerTaxNumber; */
        this.countReminders = data.countReminders; // <th>Anzahl der Mahnungen</th>
        this.newCreatedInvoice = data.newCreatedInvoice;
        //endregion
        this.currency = data.currency;

        this.customerIBAN = data.customerIBAN;

        this.customerTaxNumber =  data.customerTaxNumber;
        this.invoiceDate = data.invoiceDate; // <th>Rechnungsdatum</th>
        this.invoiceDueDate = data.invoiceDueDate; // Faelligkeitsdatum
        this.invoiceNumber = data.invoiceNumber; // <th>RechnungsNr</th>
        this.invoiceIntendedUse = data.invoiceIntendedUse; // Verwendungszweck
        this.invoiceKind = InvoiceKind.create01(data.invoiceKind);
        this.invoiceState = data.invoiceState; // <th>Status (Entwurf, bezahlt, ...)</th>
        this.items = data.items;

        this.mandateIdentification = data.mandateIdentification; // Mandatsreferenz fuer SEPA-Lastschriftverfahren

        this.recipient = data.recipient; // <th>Empfänger</th>
        this.salesTaxPercentage = data.salesTaxPercentage;
        this.timeSpan = `${data.timespanBegin} bis ${data.timespanEnd}`; // <th>Rechnungzeitraum</th>

        this.timespanBegin = data.timespanBegin;
        this.timespanEnd = data.timespanEnd;

        this.wholeCost = data.wholeCost; // <th>Gesamtpreis</th>
    }


    //region static methods
    public static createNewInvoiceId(): string {
        const methDate: Date = new Date();
        return 'Inv' + methDate.getTime();
    }

    public static createNewInvoice(): Invoice { // factory pattern, prime example
        let methInvoice: Invoice;
        methInvoice = new Invoice(this.createNewInvoiceId(), this.emptyData);
        return methInvoice;
    }

    public static firstLine(inString: string): string {
        const lines = inString.split('\n');
        return lines[0];
    }

    public static companyNames(invoices: Invoice[]): string[] {
        const companyNameList: string[] = [];
        invoices.forEach(function (value) {
            companyNameList.push(value.companyName());
        });
        return companyNameList;
    }

    public static compareInvoicesByCompanyName(invoice01: Invoice, invoice02: Invoice): number {
        if (invoice01.companyName().trim().toLowerCase() < invoice02.companyName().trim().toLowerCase()) {
            return -1;
        }
        return 1;
    }


    public static sortInvoices(sortBy: string, ascending: boolean, invoices: Invoice[]): Invoice[] {
        // sortBy: Groesse, nach der sortiert werden soll
        let ascendingFactor = -1;
        if (ascending) {
            ascendingFactor = +1;
        }

        if (sortBy == 'Date') {
            invoices.sort(function (a, b) {
                return ascendingFactor * a.invoiceDate.getTime() - ascendingFactor * b.invoiceDate.getTime();
            });
        }

        if (sortBy == 'DueDate') {
            invoices.sort(function (a, b) {
                return ascendingFactor * a.invoiceDueDate.getTime() - ascendingFactor * b.invoiceDueDate.getTime();
            });
        }

        if (sortBy == 'CompanyName') {
            invoices.sort(function (a, b) {
                return ascendingFactor * Invoice.compareInvoicesByCompanyName(a, b);
            });
        }
        return invoices;
    }



    //endregion


    //region getter
    public getID(): string {
        return this.invoiceId;
    }

    //region other methods
    public addNewItem(itemType: ItemType): number {
        // TODO add new Item
        const createdItem = new Item(this, itemType);
        this.items.push(createdItem);
        // return new Item(this, item);
        return createdItem.getItemId();
    }

    //endregion

    // setter


    public companyName(): string {
        return Invoice.firstLine(this.recipient);
    }

    public computeNextItemId(): number {
        return this.getMaxItemId() + 1;
    }

    public firstSave(): void {
        this.newCreatedInvoice = false;
    }

    public exportInvoiceData(): InvoiceType {
        console.log(`Method Invoice.exportInvoiceData() startrxd!!!  `);
        console.log(`invoice.timespanBegin ===${this.timespanBegin} !!!  `);
        console.log(`invoice.timespanEnd ===${this.timespanEnd} !!!  `);
        const invKind = this.invoiceKind.exportInvoiceKindData();
        return {
            countReminders: this.countReminders, // <th>Anzahl der Mahnungen</th>
            newCreatedInvoice: this.newCreatedInvoice,
            //endregion
            currency: this.currency,
            customerIBAN: this.customerIBAN,
            mandateIdentification: this.mandateIdentification, // Mandatsreferenz fuer SEPA-Lastschriftverfahren
            customerTaxNumber: this.customerTaxNumber,
            invoiceDate: this.invoiceDate, // <th>Rechnungsdatum</th>
            invoiceDueDate: this.invoiceDueDate, // Faelligkeitsdatum
            invoiceNumber: this.invoiceNumber, // <th>RechnungsNr</th>
            invoiceIntendedUse: this.invoiceIntendedUse, // Verwendungszweck
            invoiceKind: this.invoiceKind.exportInvoiceKindData(),
            invoiceState: this.invoiceState, // <th>Status (Entwurf, bezahlt, ...)</th>
            items: this.items,
            recipient: this.recipient, // <th>Empfänger</th>
            salesTaxPercentage: this.salesTaxPercentage,
            timeSpan: this.timeSpan, // <th>Rechnungzeitraum</th>
            timespanBegin: this.timespanBegin,
            timespanEnd: this.timespanEnd,
            wholeCost: this.wholeCost // <th>Gesamtpreis</th>
        }
    }

    private getMaxItemId(): number {
        if (this.items === undefined) {
            return -1;
        } else {
            return this.items.reduce<number>((a: number, x: Item) => {
                return Math.max(a, x.getItemId());
            }, -1); // lambda-expression
        }
    }

    //endregion



}
