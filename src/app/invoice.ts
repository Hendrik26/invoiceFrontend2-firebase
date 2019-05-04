import {CustomerType} from './customer-type';
import {Customer} from './customer';
import {Item} from './item';
import {InvoiceType} from './invoice-type';
import {InvoiceKind} from './invoice-kind';
import {InvoiceKindType} from './invoice-kind-type';
import {ItemType} from './item-type';
import {INVOICES} from './mock-invoice';

export class Invoice implements InvoiceType {
    // //////////////////////
    ////////////////

    // region static properties
    private static emptyData: InvoiceType = {

        archived: false,
        countReminders: 0, // <th>Anzahl der Mahnungen</th>
        newCreatedInvoice: true,
        // endregion
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
        itemTypes: [],
        recipient: 'bspRecipient', // <th>Empfänger</th>
        salesTaxPercentage: 19,
        timeSpan: 'bspTimeSpan', // <th>Rechnungzeitraum</th>

        timespanBegin: new Date(),
        timespanEnd: new Date(),

        wholeCost: -111, // <th>Gesamtpreis</th>

        customerId: 'emptyCustomerId',
        customerData: {
            customerNumber: '2018', // Kundennummer
            customerName: 'emptyCustomer',  // Kundenname
            country: 'Deutschland',
            postalCode: '',
            city: '',
            addressLine1: '',
            addressLine2: '',
            addressLine3: '',
            customerSalesTaxNumber: '000000',
            customerIBAN: '',
            mandateIdentification: '', // Mandatsreferenz fuer SEPA-Lastschriftverfahren
            creationTime: new Date(),
            lastUpdateTime: new Date(),
            archived: false
        }
    };
    // endregion
    // region other properties
    public archived: boolean;
    countReminders: number; // <th>Anzahl der Mahnungen</th>
    newCreatedInvoice: boolean;
    // endregion
    customer: Customer;
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
    itemTypes: ItemType[];
    recipient: string; // <th>Empfänger</th>
    salesTaxPercentage: number;
    timeSpan: string; // <th>Rechnungzeitraum</th>

    timespanBegin: Date;
    timespanEnd: Date;

    wholeCost: number; // <th>Gesamtpreis</th>

    customerId: string;
    customerData: CustomerType;
    // region IDs
    private invoiceId: string; // <th>Ändern</th>
    // endregion

    private constructor(id: string, data: InvoiceType) {
        // IDs
        this.invoiceId = id; // New Commit after problems with merging

        // other properties
        this.archived = data.archived;
        this.countReminders = data.countReminders; // <th>Anzahl der Mahnungen</th>
        this.newCreatedInvoice = data.newCreatedInvoice;
        // endregion
        this.currency = data.currency;

        this.customerIBAN = data.customerIBAN;

        this.customerTaxNumber =  data.customerTaxNumber;
        this.invoiceDate = data.invoiceDate; // <th>Rechnungsdatum</th>
        this.invoiceDueDate = data.invoiceDueDate; // Faelligkeitsdatum
        this.invoiceNumber = data.invoiceNumber; // <th>RechnungsNr</th>
        this.invoiceIntendedUse = data.invoiceIntendedUse; // Verwendungszweck
        this.invoiceKind = InvoiceKind.create01(data.invoiceKind);
        this.invoiceState = data.invoiceState; // <th>Status (Entwurf, bezahlt, ...)</th>
        this.items = [];
        this.itemTypes = [];

        this.mandateIdentification = data.mandateIdentification; // Mandatsreferenz fuer SEPA-Lastschriftverfahren

        this.recipient = data.recipient; // <th>Empfänger</th>
        this.salesTaxPercentage = data.salesTaxPercentage;
        this.timeSpan = `${data.timespanBegin} bis ${data.timespanEnd}`; // <th>Rechnungzeitraum</th>

        this.timespanBegin = data.timespanBegin;
        this.timespanEnd = data.timespanEnd;

        this.wholeCost = data.wholeCost; // <th>Gesamtpreis</th>

        this.customer = new Customer(data.customerId, data.customerData);
    }


    // region static methods
    private static createItemTypeArray(items: Item[]): ItemType[] {
        // let itemTypes: ItemType[] = [];
        return items.map(item => {
            return item.exportItemData();
        });
    }

    public static createNewInvoiceId(): string {
        const methDate: Date = new Date();
        return 'Inv' + methDate.getTime();
    }

    public static createNewInvoice(): Invoice { // factory pattern, prime example
        let methInvoice: Invoice;
        methInvoice = this.createInvoiceFromExistingId(this.createNewInvoiceId(), this.emptyData);
        return methInvoice;
    }

     public static createInvoiceFromExistingId(invId: string, data: InvoiceType): Invoice { // factory pattern, prime example
        let invoice: Invoice;
        invoice = new Invoice(invId, data);
        data.itemTypes.forEach( iT => {
            invoice.addNewItem(iT);
        });
        return invoice;
    }

    public static normalizeInvoice(inputInvoice: any): Invoice {
        const invoiceData: InvoiceType = {
            archived: !!inputInvoice.archived,
            countReminders: inputInvoice.countReminders ? inputInvoice.countReminders : -1, // <th>Anzahl der Mahnungen</th>
            newCreatedInvoice: !!inputInvoice.newCreatedInvoice,
            // endregion
            currency: inputInvoice.currency ? inputInvoice.currency : 'bspCurrency',

            customerIBAN: inputInvoice.customerIBAN ? inputInvoice.customerIBAN : 'bspCustomerIBAN',
            mandateIdentification: inputInvoice.mandateIdentification ? inputInvoice.mandateIdentification : 'bspMandateIdentification',
            // Mandatsreferenz fuer SEPA-Lastschriftverfahren
            customerTaxNumber: inputInvoice.customerTaxNumber ? inputInvoice.customerTaxNumber : 'bspCustomerTaxNumber',
            invoiceDate: inputInvoice.invoiceDate ? inputInvoice.invoiceDate.toDate() : new Date(), // <th>Rechnungsdatum</th>
            invoiceDueDate: inputInvoice.invoiceDueDate ? inputInvoice.invoiceDueDate.toDate() : new Date(), // Faelligkeitsdatum
            invoiceNumber: inputInvoice.invoiceNumber ? inputInvoice.invoiceNumber : '2018xy', // <th>RechnungsNr</th>
            invoiceIntendedUse: inputInvoice.invoiceIntendedUse ? inputInvoice.invoiceIntendedUse : 'bspInvoiceIntendedUse',
            // Verwendungszweck
            /* invoiceKind: InvoiceKind.create(inputInvoice.invoiceKind.international,
                inputInvoice.invoiceKind.timeSpanBased, inputInvoice.invoiceKind.isSEPA), */
            invoiceKind: inputInvoice.invoiceKind ? InvoiceKind.create(inputInvoice.invoiceKind.international,
                inputInvoice.invoiceKind.timeSpanBased, inputInvoice.invoiceKind.isSEPA) : InvoiceKind.create(false,
                false, false),
            invoiceState: inputInvoice.invoiceState ? inputInvoice.invoiceState : 'Entwurf', // <th>Status (Entwurf, bezahlt, ...)</th>
            itemTypes: [],
            recipient: inputInvoice.recipient ? inputInvoice.recipient : 'bspRecipient', // <th>Empfänger</th>
            salesTaxPercentage: inputInvoice.salesTaxPercentage ? inputInvoice.salesTaxPercentage : 19,
            timeSpan: 'bspTimeSpan', // <th>Rechnungzeitraum</th>

            timespanBegin: inputInvoice.timespanBegin ? inputInvoice.timespanBegin.toDate() :  new Date(),
            timespanEnd: inputInvoice.timespanEnd ? inputInvoice.timespanEnd.toDate() : new Date(),

            wholeCost: inputInvoice.wholeCost ? inputInvoice.wholeCost : -111, // <th>Gesamtpreis</th>

            customerId: inputInvoice.customerId ? inputInvoice.customerId : 'emptyCustomerId',
            customerData: inputInvoice.customer ? {
                customerNumber: inputInvoice.customer.customerNumber ? inputInvoice.customer.customerNumber : '2018', // Kundennummer
                customerName: inputInvoice.customer.customerName ? inputInvoice.customer.customerName : 'emptyCustomer',  // Kundenname
                country: inputInvoice.customer.country ? inputInvoice.customer.country : 'Deutschland',
                postalCode: inputInvoice.customer.postalCode ? inputInvoice.customer.postalCode : '',
                city: inputInvoice.customer.city ? inputInvoice.customer.city : '',
                addressLine1: inputInvoice.customer.addressLine1 ? inputInvoice.customer.addressLine1 : '',
                addressLine2: inputInvoice.customer.addressLine2 ? inputInvoice.customer.addressLine2 : '',
                addressLine3: inputInvoice.customer.addressLine3 ? inputInvoice.customer.addressLine3 : '',
                customerSalesTaxNumber: inputInvoice.customer.customerSalesTaxNumber ? inputInvoice.customer.customerSalesTaxNumber
                    : '000000',
                customerIBAN: inputInvoice.customer.customerIBAN ? inputInvoice.customer.customerIBAN : '',
                mandateIdentification: inputInvoice.customer.mandateIdentification ? inputInvoice.customer.mandateIdentification : '',
                // Mandatsreferenz fuer SEPA-Lastschriftverfahren
                creationTime: inputInvoice.customer.creationTime ? inputInvoice.customer.creationTime.toDate() : new Date(),
                lastUpdateTime: inputInvoice.customer.lastUpdateTimey ? inputInvoice.customer.lastUpdateTime.toDate() : new Date(),
                archived: inputInvoice.customer.country ? inputInvoice.customer.country : false
            } : Customer.getEmptyCustomer()
        };
        // return new Customer(inputInvoice.key, invoiceData);
        const retInvoice: Invoice = Invoice.createInvoiceFromExistingId(inputInvoice.key, invoiceData);
        if (inputInvoice.itemTypes) {
                inputInvoice.itemTypes.forEach(function (itemType) {
                    retInvoice.addNewItem(Item.normalizeItem(retInvoice, itemType));
                });
        }

        return retInvoice;
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



    // endregion


    // region getter
    public getID(): string {
        return this.invoiceId;
    }

    public getCustomerName(): string {
        return this.customer.customerName;
    }

    // region other methods
    public addNewItem(itemType: ItemType): number {
        // TODO add new Item
        const createdItem = new Item(this, itemType);
        this.items.push(createdItem);
        // return new Item(this, item);
        return createdItem.getItemId();
    }

    // endregion

    // setter


    public companyName(): string {
        return Invoice.firstLine(this.recipient);
    }

    public computeNextItemId(): number {
        return this.getMaxItemId() + 1;
    }

    private  createItemArray(itemTypes: ItemType[]): Item[] {
        return itemTypes.map(itemType => {
            return new Item(this, itemType);
        });
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
            archived: this.archived,
            countReminders: this.countReminders, // <th>Anzahl der Mahnungen</th>
            newCreatedInvoice: this.newCreatedInvoice,
            // endregion
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
            itemTypes: Invoice.createItemTypeArray(this.items),
            recipient: this.recipient, // <th>Empfänger</th>
            salesTaxPercentage: this.salesTaxPercentage,
            timeSpan: this.timeSpan, // <th>Rechnungzeitraum</th>
            timespanBegin: this.timespanBegin,
            timespanEnd: this.timespanEnd,
            wholeCost: this.wholeCost, // <th>Gesamtpreis</th>
            customerId: this.customer.getCustomerId(),
            customerData: this.customer.exportCustomerData()
        };
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

    // endregion



}
