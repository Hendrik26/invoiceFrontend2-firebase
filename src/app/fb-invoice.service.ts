// responsible for connection to Firebase-DB

import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

import {Customer} from './customer';
import {CustomerType} from './customer-type';
import {Invoice} from './invoice';
import {InvoiceType} from './invoice-type';
import {map} from 'rxjs/operators';
import {Observable, combineLatest} from 'rxjs';
import {InvoiceKind} from './invoice-kind';
import {Item} from './item';

@Injectable({
    providedIn: 'root'
})
export class FbInvoiceService {

    private dbPath = '/customers';
    private dbInvoicePath = '/invoices';
    customersRef: AngularFirestoreCollection<Customer> = null;


    constructor(private db: AngularFirestore) {
    }

    getCustomersList(archive: string): Observable<any> {
        console.log('Archiv', archive);
        console.log('Method fb-invoice.service.getCustomersList() started!!!');
        let customersRef: AngularFirestoreCollection<Customer> = null;
        if (archive === 'all') {
            customersRef = this.db.collection(this.dbPath);
        } else {
            if (archive === 'showArchive') {
               customersRef = this.db.collection(this.dbPath,
                    ref => ref.where('archived', '==', true));
            } else {
                customersRef = this.db.collection(this.dbPath,
                    ref => ref.where('archived', '==', false));
            }
        }
        return customersRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({key: c.payload.doc.id, ...c.payload.doc.data()}))
            )
        );
    }

    getCustomerById(customerId: string, historyId: string): Observable<any> {
        let path = '';
        if (!historyId) {
            path = `${this.dbPath}/${customerId}`;
        } else {
            path = `${this.dbPath}/${customerId}/history/${historyId}`;
        }
        return this.db.doc(path).valueChanges();
    }

    getCustomerHistoryById(customerId: string): Observable<any> {
        this.customersRef = this.db.collection(`${this.dbPath}/${customerId}/history`);
        return this.customersRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({
                    historyKey: c.payload.doc.id,
                    historyLabel: c.payload.doc.id.slice(12, 14)
                        + '.' + c.payload.doc.id.slice(9, 11)
                        + '.' + c.payload.doc.id.slice(4, 8)
                        + ' ' + c.payload.doc.id.slice(15, 17)
                        + ':' + c.payload.doc.id.slice(18, 20)
                        + ':' + c.payload.doc.id.slice(21, 23)
                }))
            )
        );
    }

    testCustomerHistoryById(customerId: string): Observable<any> {
        const customersRef = this.db.collection(`${this.dbPath}/${customerId}/history`,
                ref => ref.limit(2));
        return customersRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({historyId: c.payload.doc.id }))));
    }

    createCustomer(data: CustomerType): void {
        this.db.collection(this.dbPath).add({
            'customerNumber': data.customerNumber,
            'customerName': data.customerName,
            'country': data.country,
            'postalCode': data.postalCode,
            'city': data.city,
            'addressLine1': data.addressLine1,
            'addressLine2': data.addressLine2,
            'addressLine3': data.addressLine3,
            'customerSalesTaxNumber': data.customerSalesTaxNumber,
            'creationTime': data.creationTime,
            'lastUpdateTime': new Date(),
            'archived': data.archived
        }).catch(error => this.handleError(error));
    }

    updateCustomer(id: string, data: CustomerType): void {
        console.log('Method FbInvoiceService.updateCustomer() started!');
        const logStr = 'customerNumber: ' + data.customerNumber
                     + '\r\n customerName' + data.customerName
                     + '\r\n country' + data.country
                     + '\r\n postalCode' + data.postalCode
                      + '\r\n city' + data.city
                        + '\r\n addressLine1' +  data.addressLine1
                        + '\r\n addressLine2' + data.addressLine2
                        + '\r\n addressLine3' + data.addressLine3
                        + '\r\n customerSalesTaxNumber' + data.customerSalesTaxNumber
                         + '\r\n creationTime' + data.creationTime
                         + '\r\n lastUpdateTime' + new Date()
                         + '\r\n archived' + data.archived;
        console.log(logStr);
        console.log('Method FbInvoiceService.updateCustomer() continued!');
        this.db.doc(`${this.dbPath}/${id}`).update({
            'customerNumber': data.customerNumber,
            'customerName': data.customerName,
            'country': data.country,
            'postalCode': data.postalCode,
            'city': data.city,
            'addressLine1': data.addressLine1,
            'addressLine2': data.addressLine2,
            'addressLine3': data.addressLine3,
            'customerSalesTaxNumber': data.customerSalesTaxNumber,
            'creationTime': data.creationTime,
            'lastUpdateTime': new Date(),
            'archived': data.archived
        }).catch(error => this.handleError(error));
        console.log('Method FbInvoiceService.updateCustomer() finished!');
    }

    updateSetCustomer(id: string, data: CustomerType): void {
        console.log('Method FbInvoiceService.updateSetCustomer() started!');
        const logStr = 'customerNumber: ' + data.customerNumber
            + '\r\n customerName' + data.customerName
            + '\r\n country' + data.country
            + '\r\n postalCode' + data.postalCode
            + '\r\n city' + data.city
            + '\r\n addressLine1' +  data.addressLine1
            + '\r\n addressLine2' + data.addressLine2
            + '\r\n addressLine3' + data.addressLine3
            + '\r\n customerSalesTaxNumber' + data.customerSalesTaxNumber
            + '\r\n creationTime' + data.creationTime
            + '\r\n lastUpdateTime' + new Date()
            + '\r\n archived' + data.archived;
        console.log(logStr);
        console.log('Method FbInvoiceService.updateSetCustomer() continued!');
        this.db.doc(`${this.dbPath}/${id}`).update({
            'customerNumber': data.customerNumber,
            'customerName': data.customerName,
            'country': data.country,
            'postalCode': data.postalCode,
            'city': data.city,
            'addressLine1': data.addressLine1,
            'addressLine2': data.addressLine2,
            'addressLine3': data.addressLine3,
            'customerSalesTaxNumber': data.customerSalesTaxNumber,
            'creationTime': data.creationTime,
            'lastUpdateTime': new Date(),
            'archived': data.archived
        }).catch(error => this.handleError(error));
        console.log('Method FbInvoiceService.updateSetCustomer() finished!');
    }

   createInvoice(data: InvoiceType): void {
        console.log('Method FbInvoiceService.createInvoice(...) started!');
        console.log(`data.timespanBegin ===${data.timespanBegin} !!!    `);
       console.log(`data.timespanEnd ===${data.timespanEnd}  !!!   `); /////
        this.db.collection(this.dbInvoicePath).add({
            /* 'customerNumber': data.customerNumber,
            'customerName': data.customerName,
            'country': data.country,
            'postalCode': data.postalCode,
            'city': data.city,
            'addressLine1': data.addressLine1,
            'addressLine2': data.addressLine2,
            'addressLine3': data.addressLine3,
            'customerSalesTaxNumber': data.customerSalesTaxNumber,
            'creationTime': data.creationTime,
            'lastUpdateTime': new Date(),
            'archived': data.archived */
                'countReminders': data.countReminders, // <th>Anzahl der Mahnungen</th>
               // newCreatedInvoice: boolean
               'currency': data.currency,
               'customerIBAN': data.customerIBAN,
               'mandateIdentification': data.mandateIdentification, // Mandatsreferenz fuer SEPA-Lastschriftverfahren
               'customerTaxNumber': data.customerTaxNumber,
               'invoiceDate': data.invoiceDate, // <th>Rechnungsdatum</th>
               'invoiceDueDate': data.invoiceDueDate, // Faelligkeitsdatum
               'invoiceNumber': data.invoiceNumber, // <th>RechnungsNr</th>
                'invoiceIntendedUse': data.invoiceIntendedUse, // Verwendungszweck
               'invoiceKind': data.invoiceKind,
               'invoiceState': data.invoiceState, // <th>Status (Entwurf, bezahlt, ...)</th>
               // items: Item[];
               'recipient': data.recipient, // <th>Empfänger</th>
               'salesTaxPercentage': data.salesTaxPercentage,
               // 'timeSpan': data.timeSpan // <th>Rechnungzeitraum</th>
               'timespanBegin': data.timespanBegin,
               'timespanEnd': data.timespanEnd,
               'wholeCost': data.wholeCost // <th>Gesamtpreis</th>
        }).catch(error => this.handleError(error));
    }

    private handleError(error) {
        console.log(error);
        // console.log('ErRor1223');
    }
}
