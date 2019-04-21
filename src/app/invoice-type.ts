import {InvoiceKind} from './invoice-kind';
import {InvoiceKindType} from './invoice-kind-type';
import {Item} from './item';
import {ItemType} from './item-type';

export interface InvoiceType {
  /* invoiceDate: Date;
  invoiceDueDate: Date; // Faelligkeitsdatum
  invoiceIntendedUse: string;
  invoiceNumber: string;
  recipient: string;
  invoiceState: string;
  wholeCost: number;
  countReminders: number;
  customerTaxNumber: string;
  timeSpan: string;
  currency?: string; // Fragezeichen ? heisst optional
  salesTaxPercentage: number; */

    countReminders: number; // <th>Anzahl der Mahnungen</th>
    newCreatedInvoice: boolean;
    //endregion
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
    items: ItemType[];
    recipient: string; // <th>Empfänger</th>
    salesTaxPercentage: number;
    timeSpan: string; // <th>Rechnungzeitraum</th>

    timespanBegin: Date;
    timespanEnd: Date;

    wholeCost: number; // <th>Gesamtpreis</th>
}
