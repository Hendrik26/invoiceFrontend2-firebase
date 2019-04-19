import {InvoiceKind} from './invoice-kind';
import {Item} from './item';

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
    invoiceKind: InvoiceKind;
    invoiceState: string; // <th>Status (Entwurf, bezahlt, ...)</th>
    items: Item[];
    recipient: string; // <th>Empfänger</th>
    salesTaxPercentage: number;
    timeSpan: string; // <th>Rechnungzeitraum</th>

    timespanBegin: Date;
    timespanEnd: Date;

    wholeCost: number; // <th>Gesamtpreis</th>
}
