import {Invoice} from './invoice';

let invoice01 = new Invoice('In001', {
  invoiceDate: new Date('2016-02-04'), invoiceNumber: '2018abcd', recipient: 'DumpfbackeGmbH',
  invoiceDueDate: new Date('2016-02-24'),
  invoiceState: 'Entwurf', wholeCost: 1111.11, countReminders: 0, timeSpan: '2017-01-01 bis 2017-12-31',
  currency: '€', salesTaxPercentage: 19, invoiceIntendedUse: 'die Rechnungsnummer 2018abcd',
  customerTaxNumber: 'mockCcustomerTaxNumber'
});
invoice01.addNewItem({
  itemDate: '2016-04-01', itemName: 'Programmieren',
  partialCost: 60.00, count: 5, hourPayment: false, currency: '€'
});
invoice01.addNewItem({
  itemDate: '2016-04-30', itemName: 'Datenbank-Design',
  partialCost: 60.00, count: 5, hourPayment: false, currency: '€'
});


let invoice02 = new Invoice('In002', {
  invoiceDate: new Date('2017-04-01'), invoiceNumber: '2018efgh', recipient: 'Schweizer Käse&Socken GmbH', //'Goldbroiler',
  invoiceDueDate: new Date('2016-02-21'),
  invoiceState: 'Entwurf', wholeCost: 2222.221, countReminders: 0, timeSpan: '2016-01-01 bis 2016-12-31',
  currency: '€', salesTaxPercentage: 19, invoiceIntendedUse: 'die Rechnungsnummer 2018efgh',
  customerTaxNumber: 'mockCustomerTaxNumber'
});

invoice02.addNewItem({
  itemDate: '2016-04-01', itemName: 'Programmieren',
  partialCost: 60.00, count: 5, hourPayment: false, currency: '€'
});
invoice02.addNewItem({
  itemDate: '2016-04-30', itemName: 'Datenbank-Design',
  partialCost: 60.00, count: 5, hourPayment: false, currency: '€'
});

let invoice03 = new Invoice('In003', {
  invoiceDate: new Date('2018-02-06'), invoiceNumber: '2018ijkl', recipient: 'Schweizer Käse&Socken GmbH',
  invoiceDueDate: new Date('2016-03-04'),
  invoiceState: 'Entwurf', wholeCost: 333.3321, countReminders: 0, timeSpan: '2015-01-01 bis 2015-12-31',
  currency: '€', salesTaxPercentage: 19, invoiceIntendedUse: 'die rechnungsnummer 2018ijkl',
  customerTaxNumber: 'mockCustomerTaxNumber'
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
