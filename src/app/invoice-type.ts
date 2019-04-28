import {InvoiceKindType} from './invoice-kind-type';
import {CustomerType} from './customer-type';
import {ItemType} from './item-type';

export interface InvoiceType {
    countReminders: number; // <th>Anzahl der Mahnungen</th>
    newCreatedInvoice: boolean;
    currency: string;

    customerIBAN: string;
    mandateIdentification: string; // Mandatsreferenz fuer SEPA-Lastschriftverfahren

    customerTaxNumber: string;
    invoiceDate: Date; // <th>Rechnungsdatum</th>
    invoiceDueDate: Date; // Faelligkeitsdatum
    invoiceNumber: string; // <th>RechnungsNr</th>
    invoiceIntendedUse: string; // Verwendungszweck
    invoiceKind: InvoiceKindType;
    invoiceState: string; // <th>Status (Entwurf, bezahlt, ...)</th>
    itemTypes: ItemType[];
    recipient: string; // <th>Empfänger</th>
    salesTaxPercentage: number;
    timeSpan: string; // <th>Rechnungzeitraum</th>

    timespanBegin: Date;
    timespanEnd: Date;

    wholeCost: number; // <th>Gesamtpreis</th>
}
