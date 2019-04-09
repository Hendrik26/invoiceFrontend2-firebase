import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
// import {isNullOrUndefined} from 'util';
import {Customer} from '../customer';
import {FbInvoiceService} from '../fb-invoice.service';
import {INVOICES} from '../mock-invoice';
import {of} from 'rxjs';


@Component({
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

    // Branch dev-getCustomersHistory2019-04-08

    // region other properties
    customers: Customer[];

    // endregion

    constructor(private fbInvoiceService: FbInvoiceService,
                private router: Router) {
    }

    ngOnInit() {
        this.receiveCustomers();
    }

    getCustomerById(cId: string): Customer {
        let customer: Customer;
        for (let i = 0; i < this.customers.length; i++) {
            if (this.customers[i].getCustomerId() === cId) {
                customer = this.customers[i];
            }
        }
        return customer;
    }

    receiveCustomers(): void {
        this.fbInvoiceService.getCustomersList('xxx')
            .subscribe(data => {this.customers = data.map(x => Customer.normalizeCustomer(x)); });
    }

    public newCustomereBtn(): void {
        const methCustomer = Customer.createNewCustomer();
        // const customerId = methCustomer.getCustomerId();
        const customerId = 'nK';
        this.router.navigateByUrl('customer-detail/' + customerId + '/true'  );
    }

    deleteCustomer(customerId): void {
        const i = -11;
    }


}
