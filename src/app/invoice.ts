import {CustomerType} from './customer-type';
import {Customer} from './customer';
import {Item} from './item';
import {InvoiceType} from './invoice-type';
import {InvoiceKind} from './invoice-kind';
import {InvoiceKindType} from './invoice-kind-type';
import {ItemType} from './item-type';

export class Invoice implements InvoiceType {

    // region static properties
    private static emptyData: InvoiceType = {
        archived: false,
        countReminders: 0, // <th>Anzahl der Mahnungen</th>
        currency: '€',
        customerId: 'emptyCustomerId',
        customerData: Customer.getEmptyCustomer(),
        invoiceDate: new Date(), // <th>Rechnungsdatum</th>
        invoiceDueDate: new Date(), // Faelligkeitsdatum
        invoiceNumber: '2018xy', // <th>RechnungsNr</th>
        invoiceIntendedUse: 'bspInvoiceIntendedUse', // Verwendungszweck
        invoiceKind: InvoiceKind.create(false, false, false),
        invoiceState: 'Entwurf', // <th>Status (Entwurf, bezahlt, ...)</th>
        itemTypes: [],
        newCreatedInvoice: true,
        salesTaxPercentage: 19,
        timeSpan: 'bspTimeSpan', // <th>Rechnungzeitraum</th>
        timespanBegin: new Date(),
        timespanEnd: new Date(),
        wholeCost: -111, // <th>Gesamtpreis</th>
    };
    // endregion

    // region other properties
    archived: boolean;
    countReminders: number; // <th>Anzahl der Mahnungen</th>
    currency = '€';
    customer: Customer;
    customerId: string;
    invoiceDate: Date; // <th>Rechnungsdatum</th>
    invoiceDueDate: Date; // Faelligkeitsdatum
    invoiceNumber: string; // <th>RechnungsNr</th>
    invoiceIntendedUse: string; // Verwendungszweck
    invoiceKind: InvoiceKind;
    invoiceState: string; // <th>Status (Entwurf, bezahlt, ...)</th>
    items: Item[];
    itemTypes: ItemType[];
    newCreatedInvoice: boolean;
    salesTaxPercentage: number;
    timeSpan: string; // <th>Rechnungzeitraum</th>
    timespanBegin: Date;
    timespanEnd: Date;
    wholeCost: number; // <th>Gesamtpreis</th>

    customerData: CustomerType;
    // endregion

    private invoiceId: string; // <th>Ändern</th>


    private constructor(id: string, data: InvoiceType) {
        // IDs
        this.invoiceId = id; // New Commit after problems with merging
        // other properties
        this.archived = data.archived;
        this.countReminders = data.countReminders; // <th>Anzahl der Mahnungen</th>
        this.currency = data.currency;
        this.customer = new Customer(data.customerId, data.customerData);
        this.invoiceDate = data.invoiceDate; // <th>Rechnungsdatum</th>
        this.invoiceDueDate = data.invoiceDueDate; // Faelligkeitsdatum
        this.invoiceIntendedUse = data.invoiceIntendedUse; // Verwendungszweck
        this.invoiceKind = InvoiceKind.create01(data.invoiceKind);
        this.invoiceNumber = data.invoiceNumber; // <th>RechnungsNr</th>
        this.invoiceState = data.invoiceState; // <th>Status (Entwurf, bezahlt, ...)</th>
        this.items = [];
        this.itemTypes = [];
        this.newCreatedInvoice = data.newCreatedInvoice;
        this.salesTaxPercentage = data.salesTaxPercentage;
        this.timeSpan = `${data.timespanBegin} bis ${data.timespanEnd}`; // <th>Rechnungzeitraum</th>
        this.timespanBegin = data.timespanBegin;
        this.timespanEnd = data.timespanEnd;
        this.wholeCost = data.wholeCost; // <th>Gesamtpreis</th>
    }

    public static getEmptyInvoice(): Invoice {
        return new Invoice('newInvoice', Invoice.emptyData);
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
        data.itemTypes.forEach(iT => {
            invoice.addNewItem(iT);
        });
        return invoice;
    }

    public static normalizeInvoice(inputInvoice: any): Invoice {
        const invoiceData: InvoiceType = {
            archived: !!inputInvoice.archived,
            countReminders: inputInvoice.countReminders ? inputInvoice.countReminders : -1, // <th>Anzahl der Mahnungen</th>
            currency: inputInvoice.currency ? inputInvoice.currency : 'bspCurrency',
            customerData: inputInvoice.customer ? Customer.normalizeCustomer(inputInvoice.customer) : Customer.getEmptyCustomer(),
            customerId: inputInvoice.customerId ? inputInvoice.customerId : 'emptyCustomerId',
            invoiceDate: inputInvoice.invoiceDate ? inputInvoice.invoiceDate.toDate() : new Date(), // <th>Rechnungsdatum</th>
            invoiceDueDate: inputInvoice.invoiceDueDate ? inputInvoice.invoiceDueDate.toDate() : new Date(), // Faelligkeitsdatum
            invoiceIntendedUse: inputInvoice.invoiceIntendedUse ? inputInvoice.invoiceIntendedUse : 'bspInvoiceIntendedUse',
            invoiceKind: inputInvoice.invoiceKind ? InvoiceKind.create(inputInvoice.invoiceKind.international,
                inputInvoice.invoiceKind.timeSpanBased, inputInvoice.invoiceKind.isSEPA) : InvoiceKind.create(false,
                false, false),
            invoiceNumber: inputInvoice.invoiceNumber ? inputInvoice.invoiceNumber : '2018xy', // <th>RechnungsNr</th>
            invoiceState: inputInvoice.invoiceState ? inputInvoice.invoiceState : 'Entwurf', // <th>Status (Entwurf, bezahlt, ...)</th>
            itemTypes: [],
            newCreatedInvoice: !!inputInvoice.newCreatedInvoice,
            salesTaxPercentage: inputInvoice.salesTaxPercentage ? inputInvoice.salesTaxPercentage : 19,
            timeSpan: 'bspTimeSpan', // <th>Rechnungzeitraum</th>
            timespanBegin: inputInvoice.timespanBegin ? inputInvoice.timespanBegin.toDate() : new Date(),
            timespanEnd: inputInvoice.timespanEnd ? inputInvoice.timespanEnd.toDate() : new Date(),
            wholeCost: inputInvoice.wholeCost ? inputInvoice.wholeCost : -111 // <th>Gesamtpreis</th>
        };
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
        if (invoice01.getCustomerName().trim().toLowerCase() < invoice02.getCustomerName().trim().toLowerCase()) {
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
        // TODO add new Item to firebase-DB
        const createdItem = new Item(this, itemType);
        this.items.push(createdItem);
        // return new Item(this, item);
        return createdItem.getItemId();
    }

    // endregion

    // setter


    public companyName(): string {
        return Invoice.firstLine(this.customer.customerName);
    }

    public computeNextItemId(): number {
        return this.getMaxItemId() + 1;
    }

    private createItemArray(itemTypes: ItemType[]): Item[] {
        return itemTypes.map(itemType => {
            return new Item(this, itemType);
        });
    }

    public firstSave(): void {
        this.newCreatedInvoice = false;
    }


        public exportInvoiceToAny(archived: boolean): any { // InvoiceType {
            console.log(`Method Invoice.exportInvoiceData() startrxd!!!  `);
            console.log(`invoice.timespanBegin ===${this.timespanBegin} !!!  `);
            console.log(`invoice.timespanEnd ===${this.timespanEnd} !!!  `);
            // const invKind = this.invoiceKind.exportInvoiceKindData();
            return {
                archived: archived,
                countReminders: this.countReminders, // <th>Anzahl der Mahnungen</th>
                currency: this.currency,
                customerId: this.customer.getCustomerId(),
                customer: this.customer.exportCustomerData(),
                invoiceDate: this.invoiceDate, // <th>Rechnungsdatum</th>
                invoiceDueDate: this.invoiceDueDate, // Faelligkeitsdatum
                invoiceIntendedUse: this.invoiceIntendedUse, // Verwendungszweck
                invoiceKind: this.invoiceKind.exportInvoiceKindData(),
                invoiceNumber: this.invoiceNumber, // <th>RechnungsNr</th>
                invoiceState: this.invoiceState, // <th>Status (Entwurf, bezahlt, ...)</th>
                itemTypes: Invoice.createItemTypeArray(this.items),
                newCreatedInvoice: this.newCreatedInvoice,
                salesTaxPercentage: this.salesTaxPercentage,
                timeSpan: this.timeSpan, // <th>Rechnungzeitraum</th>
                timespanBegin: this.timespanBegin,
                timespanEnd: this.timespanEnd,
                // wholeCost: this.wholeCost // <th>Gesamtpreis</th>
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
