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

    private handleError(error) {
        console.log(error);
    }
}
