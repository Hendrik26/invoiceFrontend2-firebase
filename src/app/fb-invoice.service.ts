// responsible for connection to Firebase-DB

import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Customer} from './customer';
import {CustomerType} from './customer-type';
import {Invoice} from './invoice';
import {InvoiceType} from './invoice-type';
// import {map} from 'rxjs/operators';
import {Observable, from, combineLatest} from 'rxjs';
import {AngularFireAuth} from '@angular/fire//auth';
import * as firebase from 'firebase';
import {switchMap, map} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class FbInvoiceService {

    private dbCustomerPath = '/customers';
    private dbInvoicePath = '/invoices';

    constructor(private firebaseAuth: AngularFireAuth,
                private db: AngularFirestore) {
    }

    private static historyKeyToLabel(key: string): string{
        return key.slice(12, 14) + '.' + key.slice(9, 11) + '.' + key.slice(4, 8) + ' ' + key.slice(15, 17) + ':' + key.slice(18, 20)
            + ':' + key.slice(21, 23);
    }

    private static getHistoryKey(): string {
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

    signin$(type: number, email: string, password: string): Observable<any> {
        let user$: Observable<any>;
        if (type === 0) {
            user$ = from(this.firebaseAuth.auth.signInWithEmailAndPassword(email, password));
        }
        if (type === 1) {
            user$ = from(this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password));
        }
        if (type === 2) {
            user$ = from(this.firebaseAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()));
        }
        const userProfile$: Observable<any> = user$.pipe(switchMap(value => {
            return this.db.collection('/userProfile').doc(value.user.uid).valueChanges();
        }));
        return combineLatest(user$, userProfile$);
    }

    logout() {
        this.firebaseAuth
            .auth
            .signOut();
    }

    resetPassword(email: string) {
        const auth = firebase.auth();

        return auth.sendPasswordResetEmail(email)
            .then(() => console.log('email sent'))
            .catch((error) => console.log(error));
    }

    // receives the list of the customers with archive or not
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
                    historyLabel: FbInvoiceService.historyKeyToLabel(c.payload.doc.id)
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
        this.db.doc(`${this.dbCustomerPath}/${id}`).set(data).catch(error => this.handleError(error));
    }

    // receives one specific invoice document
    getInvoiceById(invoiceId: string, historyId: string): Observable<any> {
        // create the database path witch depends from the value of the "historyId" parameter
        let path = '';
        if (!historyId) {
            path = `${this.dbInvoicePath}/${invoiceId}`;
        } else {
            path = `${this.dbInvoicePath}/${invoiceId}/History/${historyId}`;
        }
        // return of the observable
        return this.db.doc(path).valueChanges();
    }

    // receives the invoice query with several filter options
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

    // receives te first two documents of the history - necessary to test the existence of the invoice history
    testInvoiceHistoryById(invoiceId: string): Observable<any> {
        // create the database reference
        const invoiceRef = this.db.collection(`${this.dbInvoicePath}/${invoiceId}/History`,
            ref => ref.limit(2));
        // return of the observable
        return invoiceRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({historyId: c.payload.doc.id}))));
    }

    // receives the history list of one specific invoice - used in the select element
    getInvoiceHistoryById(invoicerId: string): Observable<any> {
        // create the database reference
        const invoicerRef = this.db.collection(`${this.dbInvoicePath}/${invoicerId}/History`);
        // return of the observable
        return invoicerRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({
                    historyKey: c.payload.doc.id,
                    historyLabel: FbInvoiceService.historyKeyToLabel(c.payload.doc.id)
                }))
            )
        );
    }

    // update or create a invoice document together with a history document in one batc
    updateInvoice(id: string, data: InvoiceType): void {
        const batch = this.db.firestore.batch();
        if (!id) {
            id = this.db.firestore.collection(this.dbInvoicePath).doc().id;
        }
        const invoiceRef = this.db.firestore.collection(this.dbInvoicePath).doc(id);
        const invoiceHistoryRef = this.db.firestore.collection(this.dbInvoicePath)
            .doc(id).collection('History').doc(FbInvoiceService.getHistoryKey());
        batch.set(invoiceRef, data);
        console.log(`\r\n\r\nDB-Update with BatchWrite invoiceRef!!! \r\n\r\n`);
        batch.set(invoiceHistoryRef, data);
        console.log(`\r\n\r\nDB-Update with BatchWrite invoiceHistoryRef!!! \r\n\r\n`);
        batch.commit().then(() => {
            console.log(`\r\n\r\nDB-Update with BatchWrite completed!!! \r\n\r\n`);
        }).catch(error => this.handleError(error));
    }

    private handleError(error) {
        console.log(error);
    }
}
