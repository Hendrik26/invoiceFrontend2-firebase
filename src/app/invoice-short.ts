export class InvoiceShort { // used to show invoice in invoice-list.component.html
    countReminders: number
    currency: string;
    invoiceId: string = 'InvoiceShort';
    invoiceDueDate: Date;
    invoiceDate: Date;
    invoiceNumber: string;
    recipien: string;
    invoiceState: string;
    wholeCost: number;
}
