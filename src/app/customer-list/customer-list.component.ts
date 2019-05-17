import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
// import {isNullOrUndefined} from 'util';
import {Customer} from '../customer';
import {FbInvoiceService} from '../fb-invoice.service';

@Component({
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

    // Branch dev ////////

    // region other properties
    customerParentId: string;
    customers: Customer[];
    newParentCustomer = false;
    hasReceivedCustomerParentIdError = false;
    history = false;
    showArchived = false;
    showArchive = 'notArchive';
    // endregion


    constructor(private fbInvoiceService: FbInvoiceService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.hasReceivedCustomerParentIdError = !this.hasReceivedCustomerParentId();
        this.receiveCustomers();
    }

    hasReceivedCustomerParentId(): // can NOT be deleted
        boolean {
        // let tempStr: string = 'tempStr';
        console.log('<<< Start method hasReceivedCustomerParentId()! >>>');
        if (this.route.snapshot.paramMap.has('customerId') && this.route.snapshot.paramMap.has('newCustomer')) {
            console.log('<<< Method hasReceivedCustomerParentId() if-branch! >>>');
            this.customerParentId = this.route.snapshot.paramMap.get('customerId');  // get customerID???? customerId from URL
            console.log('<<<<< this.customerParentId ===' + this.customerParentId + ' >>>>>    ');
            this.newParentCustomer = (this.route.snapshot.paramMap.get('newCustomer') === 'true');

            const has: boolean = this.route.snapshot.paramMap.has('customer-history');
            console.log('<<< has ==' + has + ' >>>');
            const get: string = this.route.snapshot.paramMap.get('customer-history');
            console.log('<<< get ===' + get + ' >>>');

            console.log('TemplateStringTest ===${ 1 + 1 }')

            const urlToString: string = this.route.snapshot.toString();
            console.log('<<< urlToString ===' + urlToString + ' >>>');
            this.history = (urlToString.indexOf('customer-history') != -1);
            console.log('<<< this.history ===' + this.history + ' >>>');

            return true;
        } else {
            console.log('<<< Method hasReceivedCustomerParentId() else-branch! >>>');
            this.customerParentId = null; // stands for the creation of a new customer
            return false;
        }
    }

    /*
    private toShow(customerArchived): boolean {
        return ((this.showArchived === customerArchived) || this.history);
    }
    */

    receiveCustomers(): void {
            this.fbInvoiceService.getCustomersList(this.showArchive)
                .subscribe(data => {this.customers = Customer.sortCustomers(data.map(x => Customer.normalizeCustomer(x))) ;
                /*

                    this.customers.sort(function (a, b) {
                        return CustomerListComponent.compareCustomersByName(a, b);
                    });
                */
                });
    }

    public newCustomereBtn(): void {
        // const methCustomer = Customer.createNewCustomer();
        // const customerId = methCustomer.getCustomerId();
        const customerId = 'nK';
        this.router.navigateByUrl('customer-detail/' + customerId + '/true'  );
    }
}
