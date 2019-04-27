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

    private dbCustomerPath = '/customers';
    private dbInvoicePath = '/invoices';
    customersRef: AngularFirestoreCollection<Customer> = null;


    constructor(private db: AngularFirestore) {
    }

    getCustomersList(archive: string): Observable<any> {
        console.log('Method fb-invoice.service.getCustomersList() started!!!');
        console.log('Archiv', archive);
        let customersRef: AngularFirestoreCollection<Customer> = null;
        if (archive === 'all') {
            customersRef = this.db.collection(this.dbCustomerPath);
        } else {
            if (archive === 'showArchive') {
                customersRef = this.db.collection(this.dbCustomerPath,
                    ref => ref.where('archived', '==', true));
            } else {
                customersRef = this.db.collection(this.dbCustomerPath,
                    ref => ref.where('archived', '==', false));
            }
        }
        return customersRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({key: c.payload.doc.id, ...c.payload.doc.data()}))
            )
        );
    }

    getInvoiceList(archive: string): Observable<any> {
        console.log('Method fb-invoice.service.getInvoiceList() started!!!');
        console.log('Archiv', archive);
        let invoiceRef: AngularFirestoreCollection<Invoice> = null;
        if (archive === 'all') {
            console.log('Pfad all!   ');
            invoiceRef = this.db.collection(this.dbInvoicePath);
            console.log('Local propoerty invoiceRef set!   ')
        } else {
            if (archive === 'showArchive') {
                console.log('Pfad showArchive!   ');
                invoiceRef = this.db.collection(this.dbInvoicePath,
                    ref => ref.where('archived', '==', true));
            } else {
                console.log('Pfad else!   ');
                invoiceRef = this.db.collection(this.dbInvoicePath,
                    ref => ref.where('archived', '==', false));
            }
        }
        console.log('Method fb-invoice.service.getInvoiceList() ends!!!');
        return invoiceRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({key: c.payload.doc.id, ...c.payload.doc.data()}))
            )
        );
    }

    getInvoiceList_mod(archive: string): Observable<any> {
        console.log('Method fb-invoice.service.getInvoiceList() started!!!');
        console.log('Archiv', archive);
        let invoiceRef: AngularFirestoreCollection<Invoice> = null;
        if (archive === 'all') {
            console.log('Pfad all!   ');
            invoiceRef = this.db.collection(this.dbInvoicePath);
            console.log('Local propoerty invoiceRef set!   ');
        } else {
            if (archive === 'showArchive') {
                console.log('Pfad showArchive!   ');
                invoiceRef = this.db.collection(this.dbInvoicePath,
                    ref => ref.where('archived', '==', true));
            } else {
                console.log('Pfad else!   ');
                invoiceRef = this.db.collection(this.dbInvoicePath,
                    ref => ref.where('archived', '==', false));
            }
        }
        console.log('Method fb-invoice.service.getInvoiceList() ends!!!');
        return invoiceRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({
                    key: c.payload.doc.id,
                    invoiceNumber: c.payload.doc.data().invoiceNumber,
                    countReminders: c.payload.doc.data().countReminders,
                    currency: c.payload.doc.data().currency,
                    invoiceDate: c.payload.doc.data().invoiceDate,
                    invoiceDueDate: c.payload.doc.data().invoiceDueDate,
                    invoiceIntendedUse: c.payload.doc.data().invoiceIntendedUse,
                    invoiceKind: c.payload.doc.data().invoiceKind,
                    invoiceState: c.payload.doc.data().invoiceState,
                    salesTaxPercentage: c.payload.doc.data().salesTaxPercentage,
                    timespanBegin: c.payload.doc.data().timespanBegin,
                    timespanEnd: c.payload.doc.data().timespanEnd,
                    wholeCost: (c.payload.doc.data().itemTypes
                        ? c.payload.doc.data().itemTypes.reduce((sum, current) => sum + current.partialCost, 0 ) : 0)
                }))
            )
            // map(changes =>
            // changes.map(c => ({key: c.payload.doc.id, ...c.payload.doc.data()}))
            // );
        )
            ;
    }

    getCustomerById(customerId: string, historyId: string): Observable<any> {
        let path = '';
        if (!historyId) {
            path = `${this.dbCustomerPath}/${customerId}`;
        } else {
            path = `${this.dbCustomerPath}/${customerId}/history/${historyId}`;
        }
        return this.db.doc(path).valueChanges();
    }

    getCustomerHistoryById(customerId: string): Observable<any> {
        this.customersRef = this.db.collection(`${this.dbCustomerPath}/${customerId}/history`);
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
        const customersRef = this.db.collection(`${this.dbCustomerPath}/${customerId}/history`,
            ref => ref.limit(2));
        return customersRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({historyId: c.payload.doc.id}))));
    }

    createCustomer_old(data: CustomerType): void {
        this.db.collection(this.dbCustomerPath).add({
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

    createCustomer(data: CustomerType): void {
        this.db.collection(this.dbCustomerPath).add(data)
            .catch(error => this.handleError(error));
    }

    updateCustomer_old(id: string, data: CustomerType): void {
        console.log('Method FbInvoiceService.updateCustomer() started!');
        const logStr = 'customerNumber: ' + data.customerNumber
            + '\r\n customerName' + data.customerName
            + '\r\n country' + data.country
            + '\r\n postalCode' + data.postalCode
            + '\r\n city' + data.city
            + '\r\n addressLine1' + data.addressLine1
            + '\r\n addressLine2' + data.addressLine2
            + '\r\n addressLine3' + data.addressLine3
            + '\r\n customerSalesTaxNumber' + data.customerSalesTaxNumber
            + '\r\n creationTime' + data.creationTime
            + '\r\n lastUpdateTime' + new Date()
            + '\r\n archived' + data.archived;
        console.log(logStr);
        console.log('Method FbInvoiceService.updateCustomer() continued!');
        this.db.doc(`${this.dbCustomerPath}/${id}`).update({
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

    updateCustomer(id: string, data: CustomerType): void {
        console.log('Method FbInvoiceService.updateCustomer() started!');
        const logStr = 'customerNumber: ' + data.customerNumber
            + '\r\n customerName' + data.customerName
            + '\r\n country' + data.country
            + '\r\n postalCode' + data.postalCode
            + '\r\n city' + data.city
            + '\r\n addressLine1' + data.addressLine1
            + '\r\n addressLine2' + data.addressLine2
            + '\r\n addressLine3' + data.addressLine3
            + '\r\n customerSalesTaxNumber' + data.customerSalesTaxNumber
            + '\r\n creationTime' + data.creationTime
            + '\r\n lastUpdateTime' + new Date()
            + '\r\n archived' + data.archived;
        console.log(logStr);
        console.log('Method FbInvoiceService.updateCustomer() continued!');
        this.db.doc(`${this.dbCustomerPath}/${id}`).update(data).catch(error => this.handleError(error));
        console.log('Method FbInvoiceService.updateCustomer() finished!');
    }

    updateSetCustomer(id: string, data: CustomerType): void {
        console.log('Method FbInvoiceService.updateSetCustomer() started!');
        const logStr = 'customerNumber: ' + data.customerNumber
            + '\r\n customerName' + data.customerName
            + '\r\n country' + data.country
            + '\r\n postalCode' + data.postalCode
            + '\r\n city' + data.city
            + '\r\n addressLine1' + data.addressLine1
            + '\r\n addressLine2' + data.addressLine2
            + '\r\n addressLine3' + data.addressLine3
            + '\r\n customerSalesTaxNumber' + data.customerSalesTaxNumber
            + '\r\n creationTime' + data.creationTime
            + '\r\n lastUpdateTime' + new Date()
            + '\r\n archived' + data.archived;
        console.log(logStr);
        console.log('Method FbInvoiceService.updateSetCustomer() continued!');
        this.db.doc(`${this.dbCustomerPath}/${id}`).update(data).catch(error => this.handleError(error));
        console.log('Method FbInvoiceService.updateSetCustomer() finished!');
    }

    createInvoice(data: InvoiceType): void {
        console.log('Method FbInvoiceService.createInvoice(...) started!');
        // console.log(data.invoiceKind.printToString()); ///
        this.db.collection(this.dbInvoicePath).add(data).catch(error => this.handleError(error));
    }

    private handleError(error) {
        console.log(error);
    }
}
