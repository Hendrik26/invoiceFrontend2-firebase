// responsible for connection to Firebase-DB

import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Customer} from './customer';
import {CustomerType} from './customer-type';
import {Invoice} from './invoice';
import {InvoiceType} from './invoice-type';
import {map} from 'rxjs/operators';
import {Observable, combineLatest} from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class FbInvoiceService {
    ///////////////////////////////

    private dbCustomerPath = '/customers';
    private dbInvoicePath = '/invoices';

    constructor(private db: AngularFirestore) {
    }

    // receives the of the customers with archive or not
    getCustomersList(archive: string): Observable<any> {
        // create the database reference/query witch depends on the value of the "archive" parameter
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
        // return of the observable
        return customersRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({key: c.payload.doc.id, ...c.payload.doc.data()}))
            )
        );
    }

    // receives one specific customers document
    getCustomerById(customerId: string, historyId: string): Observable<any> {
        // create the database path witch depends from the value of the "historyId" parameter
        let path = '';
        if (!historyId) {
            path = `${this.dbCustomerPath}/${customerId}`;
        } else {
            path = `${this.dbCustomerPath}/${customerId}/history/${historyId}`;
        }
        // return of the observable
        return this.db.doc(path).valueChanges();
    }

    // receives the history list of one specific customers - used in the select element
    getCustomerHistoryById(customerId: string): Observable<any> {
        // create the database reference
        const customersRef = this.db.collection(`${this.dbCustomerPath}/${customerId}/history`);
        // return of the observable
        return customersRef.snapshotChanges().pipe(
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

    // receives te first two documents of the history - necessary to test the existence of the customer history
    testCustomerHistoryById(customerId: string): Observable<any> {
        // create the database reference
        const customersRef = this.db.collection(`${this.dbCustomerPath}/${customerId}/history`,
            ref => ref.limit(2));
        // return of the observable
        return customersRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({historyId: c.payload.doc.id}))));
    }

    // creates a new customer document
    createCustomer(data: CustomerType): void {
        this.db.collection(this.dbCustomerPath).add(data)
            .catch(error => this.handleError(error));
    }

    // updates an existing customer document
    updateCustomer(id: string, data: CustomerType): void {
        this.db.doc(`${this.dbCustomerPath}/${id}`).update(data).catch(error => this.handleError(error));
    }

    getInvoiceById(invoiceId: string, historyId: string): Observable<any> {
        // create the database path witch depends from the value of the "historyId" parameter
        let path = '';
        if (!historyId) {
            path = `${this.dbInvoicePath}/${invoiceId}`;
        } else {
            path = `${this.dbInvoicePath}/${invoiceId}/history/${historyId}`;
        }
        // return of the observable
        return this.db.doc(path).valueChanges();
    }

    getInvoiceList(refIndex: number, filterStartDate: Date, filterEndDate: Date, filterState: string,
                   filterCustomer: string, filterArchive: boolean): Observable<any> {
        // let invoiceRef: AngularFirestoreCollection<Invoice> = null;
        const invoiceRefs: AngularFirestoreCollection<Invoice>[] = [
            this.db.collection(this.dbInvoicePath),
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceDate', '>=', filterStartDate)
                    .where('invoiceDate', '<=', filterEndDate)),
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceDueDate', '>=', filterStartDate)
                    .where('invoiceDueDate', '<=', filterEndDate)),
            null,
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceState', '==', filterState)),
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceDate', '>=', filterStartDate)
                    .where('invoiceDate', '<=', filterEndDate).where('invoiceState', '==', filterState)),
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceDueDate', '>=', filterStartDate)
                    .where('invoiceDueDate', '<=', filterEndDate).where('invoiceState', '==', filterState)),
            null,
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('customerId', '==', filterCustomer)),
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceDate', '>=', filterStartDate)
                    .where('invoiceDate', '<=', filterEndDate).where('customerId', '==', filterCustomer)),
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceDueDate', '>=', filterStartDate)
                    .where('invoiceDueDate', '<=', filterEndDate).where('customerId', '==', filterCustomer)),
            null,
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceState', '==', filterState)
                    .where('customerId', '==', filterCustomer)),
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceDate', '>=', filterStartDate)
                    .where('invoiceDate', '<=', filterEndDate).where('invoiceState', '==', filterState)
                    .where('customerId', '==', filterCustomer)),
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceDueDate', '>=', filterStartDate)
                    .where('invoiceDueDate', '<=', filterEndDate).where('invoiceState', '==', filterState)
                    .where('customerId', '==', filterCustomer)),
            null,
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('archived', '==', filterArchive)),
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceDate', '>=', filterStartDate)
                    .where('invoiceDate', '<=', filterEndDate)),
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceDueDate', '>=', filterStartDate)
                    .where('invoiceDueDate', '<=', filterEndDate)),
            null,
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceState', '==', filterState)),
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceDate', '>=', filterStartDate)
                    .where('invoiceDate', '<=', filterEndDate).where('invoiceState', '==', filterState)),
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceDueDate', '>=', filterStartDate)
                    .where('invoiceDueDate', '<=', filterEndDate).where('invoiceState', '==', filterState)),
            null,
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('customerId', '==', filterCustomer)),
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceDate', '>=', filterStartDate)
                    .where('invoiceDate', '<=', filterEndDate).where('customerId', '==', filterCustomer)),
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceDueDate', '>=', filterStartDate)
                    .where('invoiceDueDate', '<=', filterEndDate).where('customerId', '==', filterCustomer)),
            null,
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceState', '==', filterState)
                    .where('customerId', '==', filterCustomer)),
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceDate', '>=', filterStartDate)
                    .where('invoiceDate', '<=', filterEndDate).where('invoiceState', '==', filterState)
                    .where('customerId', '==', filterCustomer)),
            this.db.collection(this.dbInvoicePath,
                ref => ref.where('invoiceDueDate', '>=', filterStartDate)
                    .where('invoiceDueDate', '<=', filterEndDate).where('invoiceState', '==', filterState)
                    .where('customerId', '==', filterCustomer)),
            null
        ];
        return invoiceRefs[refIndex].snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({
                    key: c.payload.doc.id,
                    ...c.payload.doc.data(),
                    wholeCost: (c.payload.doc.data().itemTypes
                        ? c.payload.doc.data().itemTypes.reduce((sum, current) =>
                             isNaN(current.count) || isNaN(current.partialCost) ? 0 : sum + current.count * current.partialCost,
                            0) : 0)
                }))
            ));
    }

    /* updateInvoiceOld(id: string, data: InvoiceType): void {
        // this.db.doc(`${this.dbInvoicePath}/${id}`).update(data).catch(error => this.handleError(error));
        this.db.runTransaction(transaction => {
            return transaction.get(this.db.doc(`${this.dbInvoicePath}/${id}`)).then(invoiceDoc => {
                if (!invoiceDoc.exists) {
                    console.log('\r\n\r\nInvoiceDocument does not exist!\r\n\r\n');
                } else {
                    transaction.update(data)
                }

            });
        });
    } */

    updateInvoice(id: string, data: InvoiceType): void {
        // this.db.doc(`${this.dbInvoicePath}/${id}`).update(data).catch(error => this.handleError(error));
        const batch = this.db.firestore.batch();
        const invoicefRef = this.db.firestore.collection('invoices').doc(id);
        const invoicefHistoryRef = this.db.firestore.collection('invoices')
            .doc(id).collection('History').doc(this.getHistoryKey());
        batch.update(invoicefRef, data);
        console.log(`\r\n\r\nDB-Update with BatchWrite invoiceRef!!! \r\n\r\n`);
        batch.set(invoicefHistoryRef, data);
        console.log(`\r\n\r\nDB-Update with BatchWrite invoiceHistoryRef!!! \r\n\r\n`);
        batch.commit().then(() => {
            console.log(`\r\n\r\nDB-Update with BatchWrite completed!!! \r\n\r\n`);
        }).catch(error => this.handleError(error));
    }

    createInvoiceOld(data: any): void {
        let invId: string = '-111';
        console.log('Method FbInvoiceService.createInvoice(...) started!');
        // console.log(data.invoiceKind.printToString()); ///
        this.db.collection(this.dbInvoicePath).add(data).then(docRef => {
            console.log(`\r\n\r\ndocRef.id ===${docRef.id}!!! \r\n\r\n`);
            invId = docRef.id;
            console.log(`\r\n\r\ninvId01 ===${invId}!!! \r\n\r\n`);
        }).catch(error => this.handleError(error));
        console.log(`\r\n\r\ninvId02 ===${invId}!!! \r\n\r\n`);
    }

    createInvoice(data: any): void {
        let invId: string = '-111';
        console.log('Method FbInvoiceService.createInvoice(...) started!');
        // console.log(data.invoiceKind.printToString()); ///
        this.db.collection(this.dbInvoicePath).add(data).then(docRef => {
            console.log(`\r\n\r\ndocRef.id ===${docRef.id}!!! \r\n\r\n`);
            invId = docRef.id;
            console.log(`\r\n\r\ninvId01 ===${invId}!!! \r\n\r\n`);
        }).catch(error => this.handleError(error));
        console.log(`\r\n\r\ninvId02 ===${invId}!!! \r\n\r\n`);
    }

    private handleError(error) {
        console.log(error);
    }

    private getHistoryKey(): string {
        const date = new Date();
        const key = 'Key-' + date.getFullYear() + '-'
            + ('0' + (date.getMonth() + 1).toString()).slice(-2) + '-'
            + ('0' + date.getDate().toString()).slice(-2) + '-'
            + ('0' + date.getHours().toString()).slice(-2) + '-'
            + ('0' + date.getMinutes().toString()).slice(-2) + '-'
            + ('0' + date.getSeconds().toString()).slice(-2) + '-'
            + ('00' + date.getMilliseconds().toString()).slice(-3);
        return key;
    }

}
