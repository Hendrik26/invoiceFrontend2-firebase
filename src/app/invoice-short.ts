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

    /*
    public static normalizeInvoiceShort(inputInvoice: any): InvoiceShort {
        const returnInvoiceShort = new InvoiceShort();
        returnInvoiceShort.countReminders = inputInvoice.countReminders ? inputInvoice.countReminders : -1;
        returnInvoiceShort.currency = inputInvoice.currency ? inputInvoice.currency : 'Unknown currency! ';
        returnInvoiceShort.invoiceId = inputInvoice.key ? inputInvoice.key : 'InvoiceShort undefined!   ';
        returnInvoiceShort.invoiceDueDate = inputInvoice.invoiceDueDate ? inputInvoice.invoiceDueDate.toDate() : new Date();
        returnInvoiceShort.invoiceDate = inputInvoice.invoiceDate ? inputInvoice.invoiceDate.toDate() : new Date();
        returnInvoiceShort.invoiceNumber = inputInvoice.invoiceNumber ? inputInvoice.invoiceNumber : 'Unkown InvoiceNumber!  ';
        returnInvoiceShort.recipient = inputInvoice.recipient ? inputInvoice.recipient : 'Unknown inputInvoice.recipient!  ';
        // <th>Empfänger</th>
        returnInvoiceShort.invoiceState = inputInvoice.invoiceState ? inputInvoice.invoiceState : 'Unknown InvoiceState!  ';
        returnInvoiceShort.wholeCost = inputInvoice.wholeCost ? inputInvoice.wholeCost : -99;

        return returnInvoiceShort;
    }
    */

    public companyName(): string {
        return InvoiceShort.firstLine(this.recipient);
    }

    public getID(): string {
        return this.invoiceId ? this.invoiceId : 'InvoiceId undefined!  ';
    }
}
