// import {InvoicerType} from './invoice-type';

export class InvoiceShort { // used to show invoice in invoice-list.component.html
    countReminders: number;
    currency: string;
    invoiceId = 'InvoiceShort';
    invoiceDueDate: Date;
    invoiceDate: Date;
    invoiceNumber: string;
    recipient: string; // <th>Empfänger</th>
    invoiceState: string;
    wholeCost: number;

    public static firstLine(inString: string): string {
        const lines = inString.split('\n');
        return lines[0];
    }

    public static normalizeInvoiceShort(inputInvoice: any): InvoiceShort {
        const returnInvoiceShort = new InvoiceShort();
        returnInvoiceShort.countReminders = inputInvoice.countReminders;
        returnInvoiceShort.currency = inputInvoice.currency;
        returnInvoiceShort.invoiceId = inputInvoice.key ? inputInvoice.key : 'InvoiceShort undefined!   ';
        returnInvoiceShort.invoiceDueDate = inputInvoice.invoiceDueDate;
        returnInvoiceShort.invoiceDate = inputInvoice.invoiceDate;
        returnInvoiceShort.invoiceNumber = inputInvoice.invoiceNumber;
        returnInvoiceShort.recipient = inputInvoice.recipient; // <th>Empfänger</th>
        returnInvoiceShort.invoiceState = inputInvoice.invoiceState;
        returnInvoiceShort.wholeCost = inputInvoice.wholeCost;

        return returnInvoiceShort;
    }

    public companyName(): string {
        return InvoiceShort.firstLine(this.recipient);
    }

    public getID(): string {
        return this.invoiceId ? this.invoiceId : 'InvoiceId undefined!  ';
    }
}
