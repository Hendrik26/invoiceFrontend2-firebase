// responsible for connection to Firebase-DB

import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

import {Customer} from './customer';
import {map} from 'rxjs/operators';
import {Observable, combineLatest} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FbInvoiceService {

    private dbPath = '/customers';
    private customersList: Observable<any>;
    private carsByCustomersList: Observable<any>;

    carsRef: AngularFirestoreCollection<Customer> = null;
    customersRef: AngularFirestoreCollection<Customer> = null;


    constructor(private db: AngularFirestore) { }

    getCustomersList(country: string): Observable<any> {
        const sortDirStr = 'asc';
        console.log(sortDirStr);
        country = country.trim();
        console.log('Method fb-invoice.service.getCustomersList() started!!!');
        /* this.customersRef = this.db.collection(this.dbPath,
            ref => ref.orderBy('customerName', sortDirStr).where('age', '>=', dbMinage)
                .where('age', '<=', dbMaxage)); */
        this.customersRef = this.db.collection(this.dbPath,
            ref => ref.orderBy('customerName', sortDirStr));
        return this.customersRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({key: c.payload.doc.id, ...c.payload.doc.data()}))
            )
        );
         // console.log('Method fb-invoice.service.getCustomersList() done!!!');
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
            'creationTime': customer.creationTime
        }).catch(error => this.handleError(error));
    }

    createCustomer01(customerNumber: string, customerName: string, country: string,
                     postalCode: string, city: string, addressLine1: string, addressLine2: string,
                     addressLine3: string, customerSalesTaxNumber: string, creationTime: Date): void {
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
            'creationTime': creationTime
        }).catch(error => this.handleError(error));
    }

    private handleError(error) {
        console.log(error);
    }
}
