import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Customer} from '../customer';
import {CustomerType} from '../customer-type';
import {FbInvoiceService} from '../fb-invoice.service';
import {Location} from '@angular/common';
import {SettingsService} from '../settings.service';


@Component({
    selector: 'app-customer-detail',
    templateUrl: './customer-detail.component.html',
    styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {

    // region IDs
    customerId: string;
    // endregion

    // region other properties
    customer: CustomerType = Customer.getEmptyCustomer();
    historyDateList: [{ historyKey: string, historyLabel: string }];
    historyId: string;
    newCustomer: boolean;
    receivedCustomerIdError: boolean;
    archived = false;
    historyTest: boolean;

    // endregion

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private fbInvoiceService: FbInvoiceService,
        private settingsService: SettingsService) {
    }

    ngOnInit() {
        this.newCustomer = false;
        this.receivedCustomerIdError = !this.hasReceivedCustomerId();
        console.log('receivedCustomerIdError ===' + this.receivedCustomerIdError + '!!!     ');
        if (!this.receivedCustomerIdError) {
            this.receiveFbCustomerById(this.customerId, null);
        }
    }

    hasReceivedCustomerId(): // can NOT be deleted
        boolean {
        if (this.route.snapshot.paramMap.has('customerId') && this.route.snapshot.paramMap.has('newCustomer')) {
            this.customerId = this.route.snapshot.paramMap.get('customerId');  // get customerID???? customerId from URL
            console.log('<<<<< CustomerID ===' + this.customerId + ' >>>>>    ');
            this.newCustomer = (this.route.snapshot.paramMap.get('newCustomer') === 'true');
            return true;
        } else {
            this.customerId = null; // stands for the creation of a new customer
            return false;
        }
    }

    receiveFbCustomerById(id: string, historyId: string): void {
        if (!this.newCustomer) {
            this.fbInvoiceService.getCustomerById(id, historyId).subscribe(customerType => {
                this.customer = new Customer(id, customerType);
            });
            this.fbInvoiceService.testCustomerHistoryById(id).subscribe(customerTest => {
                this.historyTest = customerTest[1];
            });
        } else {
            this.customer = Customer.createNewCustomer();
        }
    }

    saveCustomer(archived: boolean): void {
        const customerType: CustomerType = {
            customerNumber: this.customer.customerNumber ? this.customer.customerNumber : '', // Kundennummer
            customerName: this.customer.customerName ? this.customer.customerName : '',  // Kundenname
            country: this.customer.country ? this.customer.country : '',
            postalCode: this.customer.postalCode ? this.customer.postalCode : '',
            city: this.customer.city ? this.customer.city : '',
            addressLine1: this.customer.addressLine1 ? this.customer.addressLine1 : '',
            addressLine2: this.customer.addressLine2 ? this.customer.addressLine2 : '',
            addressLine3: this.customer.addressLine3 ? this.customer.addressLine3 : '',
            customerSalesTaxNumber: this.customer.customerSalesTaxNumber ? this.customer.customerSalesTaxNumber : '',
            customerBIC: this.customer.customerBIC ? this.customer.customerBIC : '',
            customerIBAN: this.customer.customerIBAN ? this.customer.customerIBAN : '',
            mandateIdentification: this.customer.mandateIdentification ? this.customer.mandateIdentification : '',
            creationTime: this.customer.creationTime ? this.customer.creationTime : new Date(),
            lastUpdateTime: new Date(),
            archived: archived
        };
        if (this.newCustomer) {
            this.newCustomer = false;
            this.createCustomer(customerType);
        } else {
            this.updateCustomer(this.customerId, customerType);
        }
        this.router.navigateByUrl('/customer-list');
    }

    createCustomer(customerType: CustomerType): void {
        this.fbInvoiceService.createCustomer(customerType).subscribe(
            () => {
            }
            , () => {
                this.settingsService.handleDbError('Datenbankfehler', 'Error during creation of a new customer');
            }
        );
    }

    updateCustomer(id: string, customerType: CustomerType): void {
        this.fbInvoiceService.updateCustomer(id, customerType).subscribe(
            () => {
            }
            , () => {
                this.settingsService.handleDbError('Datenbankfehler', 'Error during updating of a customer');
            }
        );
    }

    backToCustomerList(): void {
        this.newCustomer = false;
        this.router.navigateByUrl('/customer-list');
    }

    receiveCustomerHistoryById(id: string): void {
        this.fbInvoiceService.getCustomerHistoryById(id)
            .subscribe(data => {
                this.historyDateList = data;
            });
    }

}
