import {Invoice} from './invoice';
import {InvoiceKind} from './invoice-kind';

const invoice01 = Invoice.createInvoiceFromExistingId('In001', {
  invoiceDate: new Date('2016-02-04'), invoiceNumber: '2018abcd', recipient: 'DumpfbackeGmbH',
  invoiceDueDate: new Date('2016-02-24'),
  invoiceState: 'Entwurf', wholeCost: 1111.11, countReminders: 0, timeSpan: '2017-01-01 bis 2017-12-31',
  currency: '€', salesTaxPercentage: 19, invoiceIntendedUse: 'die Rechnungsnummer 2018abcd',
  customerTaxNumber: 'mockCustomerTaxNumber',

  itemTypes:[], newCreatedInvoice: true, customerIBAN: 'bspCustomerIBAN', mandateIdentification: 'bspMandateIdentification',
  invoiceKind: InvoiceKind.create(false, false, false), timespanBegin: new Date('2017-01-01'),
  timespanEnd: new Date('2017-12-31'),
  customerId: 'mockCustomerId',
  customerData: {
    customerNumber: '2018', // Kundennummer
    customerName: 'mockCustomer',  // Kundenname
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
});
invoice01.addNewItem({
  itemDate: '2016-04-01', itemName: 'Programmieren',
  partialCost: 60.00, count: 5, hourPayment: false, currency: '€'
});
invoice01.addNewItem({
  itemDate: '2016-04-30', itemName: 'Datenbank-Design',
  partialCost: 60.00, count: 5, hourPayment: false, currency: '€'
});


const invoice02 = Invoice.createInvoiceFromExistingId('In002', {
  invoiceDate: new Date('2017-04-01'), invoiceNumber: '2018efgh', recipient: 'Goldbroiler',
  invoiceDueDate: new Date('2016-02-21'),
  invoiceState: 'Entwurf', wholeCost: 2222.221, countReminders: 0, timeSpan: '2016-01-01 bis 2016-12-31',
  currency: '€', salesTaxPercentage: 19, invoiceIntendedUse: 'die Rechnungsnummer 2018efgh',
  customerTaxNumber: 'mockCustomerTaxNumber',

    itemTypes:[], newCreatedInvoice: true, customerIBAN: 'bspCustomerIBAN', mandateIdentification: 'bspMandateIdentification',
    invoiceKind: InvoiceKind.create(false, false, false), timespanBegin: new Date('2017-01-01'),
    timespanEnd: new Date('2017-12-31'),
  customerId: 'mockCustomerId',
  customerData: {
    customerNumber: '2018', // Kundennummer
    customerName: 'mockCustomer',  // Kundenname
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
});

invoice02.addNewItem({
  itemDate: '2016-04-01', itemName: 'Programmieren',
  partialCost: 60.00, count: 5, hourPayment: false, currency: '€'
});
invoice02.addNewItem({
  itemDate: '2016-04-30', itemName: 'Datenbank-Design',
  partialCost: 60.00, count: 5, hourPayment: false, currency: '€'
});

const invoice03 = Invoice.createInvoiceFromExistingId('In003', {
  invoiceDate: new Date('2018-02-06'), invoiceNumber: '2018ijkl', recipient: 'Schweizer Käse&Socken GmbH',
  invoiceDueDate: new Date('2016-03-04'),
  invoiceState: 'Entwurf', wholeCost: 333.3321, countReminders: 0, timeSpan: '2015-01-01 bis 2015-12-31',
  currency: '€', salesTaxPercentage: 19, invoiceIntendedUse: 'die rechnungsnummer 2018ijkl',
  customerTaxNumber: 'mockCustomerTaxNumber',

    itemTypes:[], newCreatedInvoice: true, customerIBAN: 'bspCustomerIBAN', mandateIdentification: 'bspMandateIdentification',
    invoiceKind: InvoiceKind.create(false, false, false), timespanBegin: new Date('2017-01-01'),
    timespanEnd: new Date('2017-12-31'),
  customerId: 'mockCustomerId',
  customerData: {
    customerNumber: '2018', // Kundennummer
    customerName: 'mockCustomer',  // Kundenname
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
});

invoice03.addNewItem({
  itemDate: '2016-04-01', itemName: 'Programmieren',
  partialCost: 60.00, count: 5, hourPayment: false, currency: '€'
});
invoice03.addNewItem({
  itemDate: '2016-04-30', itemName: 'Datenbank-Design',
  partialCost: 60.00, count: 5, hourPayment: false, currency: '€'
});

export const INVOICES: Invoice[] = [invoice01, invoice02, invoice03];
