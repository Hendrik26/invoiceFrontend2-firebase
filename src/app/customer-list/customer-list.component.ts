import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
// import {isNullOrUndefined} from 'util';
import {Customer} from '../customer';
import {FbInvoiceService} from '../fb-invoice.service';
import {INVOICES} from '../mock-invoice';


@Component({
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

    // Branch dev ///////////////

    // region other properties
    customers: Customer[];
    showArchived = false;

    // endregion

    constructor(private fbInvoiceService: FbInvoiceService,
                private router: Router) {
    }

    ngOnInit() {
        this.receiveCustomers();
    }

    private toggleShowArchived(): void {
        this.showArchived = !this.showArchived;
    }

    private toShow(customerArchived): boolean {
        return (this.showArchived === customerArchived);
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
