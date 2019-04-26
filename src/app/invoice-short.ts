export class InvoiceShort { // used to show invoice in invoice-list.component.html
    countReminders: number
    currency: string;
    invoiceId: string = 'InvoiceShort';
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

    public companyName(): string {
        return InvoiceShort.firstLine(this.recipient);
    }

    public getID(): string {
        return this.invoiceId;
    }
}
