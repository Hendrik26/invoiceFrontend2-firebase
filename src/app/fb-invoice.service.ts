// responsible for connection to Firebase-DB

import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

import {Customer} from './customer';
import {CustomerType} from './customer-type';
import {map} from 'rxjs/operators';
import {Observable, combineLatest} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FbInvoiceService {

    private dbPath = '/customers';
    private customersList: Observable<any>;
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

    createCustomer(customer: Customer): void {
        this.db.collection(this.dbPath).add({
            'customerNumber': customer.customerNumber,
            'customerName': customer.customerName,
            'country': customer.country,
            'postalCode': customer.postalCode,
            'city': customer.city,
            'addressLine1': customer.addressLine1,
            'addressLine2': customer.addressLine2,
            'addressLine3': customer.addressLine3,
            'customerSalesTaxNumber': customer.customerSalesTaxNumber,
            'creationTime': customer.creationTime,
            'lastUpdateTime': new Date(),
            'archived': customer.archived
        }).catch(error => this.handleError(error));
    }

    createCustomer01_old(data: CustomerType): void {
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

    createCustomer01(data: CustomerType): void {
        data.lastUpdateTime =  new Date();
        this.db.collection(this.dbPath).add(data)
            .catch(error => this.handleError(error));
    }

    createCustomer02(customerNumber: string, customerName: string, country: string,
                     postalCode: string, city: string, addressLine1: string, addressLine2: string,
                     addressLine3: string, customerSalesTaxNumber: string, creationTime: Date,
                     archived: boolean): void {
        this.db.collection(this.dbPath).add({
            'customerNumber': customerNumber,
            'customerName': customerName,
            'country': country,
            'postalCode': postalCode,
            'city': city,
            'addressLine1': addressLine1,
            'addressLine2': addressLine2,
            'addressLine3': addressLine3,
            'customerSalesTaxNumber': customerSalesTaxNumber,
            'creationTime': creationTime,
            'lastUpdateTime': new Date(),
            'archived': archived
        }).catch(error => this.handleError(error));
    }

    updateCustomer(id: string, data: CustomerType): void {
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
    }

    private handleError(error) {
        console.log(error);
    }
}
