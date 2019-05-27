import {InvoiceKindType} from './invoice-kind-type';
import {CustomerType} from './customer-type';
import {ItemType} from './item-type';

export interface InvoiceType {
    archived: boolean;
    countReminders: number; // <th>Anzahl der Mahnungen</th>
    newCreatedInvoice: boolean;
    currency: string;
    invoiceDate: Date; // <th>Rechnungsdatum</th>
    invoiceDueDate: Date; // Faelligkeitsdatum
    invoiceNumber: string; // <th>RechnungsNr</th>
    invoiceIntendedUse: string; // Verwendungszweck
    invoiceKind: InvoiceKindType;
    invoiceState: string; // <th>Status (Entwurf, bezahlt, ...)</th>
    itemTypes: ItemType[];
    salesTaxPercentage: number;
    settingId: string;
    timeSpan: string; // <th>Rechnungzeitraum</th>
    timespanBegin: Date;
    timespanEnd: Date;
    wholeCost: number; // <th>Gesamtpreis</th>
    customerId: string;
    customerData: CustomerType;
    // customer: CustomerTypePlus;
}
