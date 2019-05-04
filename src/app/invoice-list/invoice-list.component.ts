import {Component, OnInit} from '@angular/core';
import {Invoice} from '../invoice';
import {InvoiceShort} from '../invoice-short';
import {InvoiceService} from '../invoice.service';
import {isNullOrUndefined} from 'util';
import {ThreeStateButton} from '../three-state-button';
import {INVOICES} from '../mock-invoice';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {FbInvoiceService} from '../fb-invoice.service';
import {Customer} from '../customer';
import {map} from 'rxjs/operators';


@Component({
    selector: 'app-invoice-list',
    templateUrl: './invoice-list.component.html',
    styleUrls: ['./invoice-list.component.css']
})


export class InvoiceListComponent implements OnInit {
    ////////////

    // invoicesNew: Invoice[] = [{...this.invoiceService.standardInvoice}]; // clones this.standardInvoice

    // region other properties
    invoices: Invoice[];
    invoicesShort: InvoiceShort[];
    maxDate = new Date(2100, 1, 1);
    minDate = new Date(1900, 1, 1);
    invoiceFilterDateOption = 0;

    filterStartDate: Date;
    filterEndDate: Date;
    invoiceFilterStateOption = 0;
    invoiceFilterState = 'Kein';
    // customers: object[];
    // companySelectOptions2: Customer[];
    invoiceFilterCompany = undefined;
    customers: Customer[];
    invoiceFilterCompanyOption = 0;
    invoiceFilterArchive = 'notArchive';
    invoiceFilterArchiveOption = 16;
    // endregion

    // region ThreeStateButtons
    sortStartDueDate: ThreeStateButton;
    sortEndDueDate: ThreeStateButton;
    sortStartDate: ThreeStateButton;
    sortEndDate: ThreeStateButton;
    sortCompanyName: ThreeStateButton;

    // endregion

    private static compareCustomersByName(customer1: Customer, customer2: Customer): number {
        if (customer1.customerName.trim().toLowerCase() < customer2.customerName.trim().toLowerCase()) {
            return -1;
        }
        return 1;
    }

    constructor(private fbInvoiceService: FbInvoiceService,
                private invoiceService: InvoiceService,
                private router: Router) {
    }

    ngOnInit() {
        this.testBool();
        this.sortStartDueDate = new ThreeStateButton('DueDate');
        this.sortStartDate = new ThreeStateButton('Date');
        this.sortCompanyName = new ThreeStateButton('CompanyName');
        this.receiveInvoices();
        this.receiveCustomers();
        // this.customers = this.calculateCompanySelectOptions(this.invoices);
        // this.companySelectOptions2 = this.calculateCompanySelectOptions2(this.invoices);
        // this.initialSaveInvoicesToDB02();
    }

    testBool() {
        let myTestBool: boolean;
        console.log('myTestBool ===' + myTestBool + '!!!    \r\n');
        myTestBool = null;
        console.log('myTestBool ===' + myTestBool + '!!!    \r\n');
        myTestBool = !myTestBool;
        console.log('myTestBool ===' + myTestBool + '!!!    \r\n');
        myTestBool = !myTestBool;
        console.log('myTestBool ===' + myTestBool + '!!!    \r\n');
    }

    receiveInvoices(): void {
        const refIndex: number = Number(this.invoiceFilterDateOption) + Number(this.invoiceFilterStateOption)
            + Number(this.invoiceFilterCompanyOption) + Number(this.invoiceFilterArchiveOption);
        const filterStartDate = this.filterStartDate ? this.filterStartDate : this.minDate;
        const filterEndDate = this.filterEndDate ? this.filterEndDate : this.maxDate;
        const invoiceFilterCompany = this.invoiceFilterCompany ? this.invoiceFilterCompany : '';
        const invoiceFilterArchive: boolean = (this.invoiceFilterArchive == 'showArchive');
        this.fbInvoiceService.getInvoiceList(refIndex, filterStartDate, filterEndDate, this.invoiceFilterState,
            invoiceFilterCompany, invoiceFilterArchive)
            .subscribe(invoices => {
                // this.invoices = invoices;
                // this.invoicesShort = invoices;
                this.invoicesShort = invoices.map(invoice => InvoiceShort.normalizeInvoiceShort(invoice));
                console.log('Next InvoiceShort received!', this.invoicesShort);
                this.invoices = invoices.map(invoice => Invoice.normalizeInvoice(invoice));
                // console.log('Next Invoice received!', this.invoices);
            });
        this.sortInvoice();
    }


    receiveCustomers(): void {
        this.fbInvoiceService.getCustomersList('notArchive')
            .subscribe(data => {
                this.customers = data.map(x => Customer.normalizeCustomer(x));
                this.customers.sort(function (a, b) {
                    return InvoiceListComponent.compareCustomersByName(a, b);
                });
            });
    }

    initialSaveInvoicesToDB() {
        let invoice: any;
        for (invoice in INVOICES) {
            this.fbInvoiceService.createInvoice(invoice.exportInvoiceData());
        }
    }

    initialSaveInvoicesToDB01() {
        INVOICES.forEach(function (invoice) {
            this.fbInvoiceService.createInvoice(invoice.exportInvoiceData());
        });
    }

    initialSaveInvoicesToDB02() {
        for (let i = 0; i < INVOICES.length; i++) {
            this.fbInvoiceService.createInvoice(INVOICES[i].exportInvoiceData());
        }
    }

    sortStartDueDateClick(): void {
        this.sortStartDate.reset();
        this.sortCompanyName.reset();
        this.sortStartDueDate.switch();
        this.sortInvoice();
    }

    sortStartDateClick(): void {
        this.sortStartDueDate.reset();
        this.sortCompanyName.reset();
        this.sortStartDate.switch();
        this.sortInvoice();
    }

    sortCompanyNameClick(): void {
        this.sortStartDueDate.reset();
        this.sortStartDate.reset();
        this.sortCompanyName.switch();
        this.sortInvoice();
    }


    // region other methods

    changeFilterStartDate(e: string) {
        this.filterStartDate = e ? new Date(e) : null;
        this.receiveInvoices();
    }

    changeFilterEndDate(e: string) {
        this.filterEndDate = e ? new Date(e) : null;
        this.receiveInvoices();
    }


    changeFilterDateOption() {
        this.receiveInvoices();
    }

    changeFilterState(e: string) {
        this.invoiceFilterStateOption = e == 'Kein'  ? 0 : 4;
        this.receiveInvoices();
    }

    changeFilterCompany(e: string) {
        this.invoiceFilterCompanyOption = e ? 8 : 0;
        this.receiveInvoices();
    }

    changeFilterArchive(e: string) {
        this.invoiceFilterArchiveOption = e == 'all'  ? 0 : 16;
        this.receiveInvoices();
    }

    public newInvoiceBtn(): void {
        const invoice = Invoice.createNewInvoice();
        INVOICES.push(invoice);
        const invoiceId = invoice.getID();
        this.router.navigateByUrl('invoice-detail/' + invoiceId);
    }


    // endregion


    public dateGreaterEqualThen(date1: Date, date2: Date): boolean {
        if (!date1) {
            return true;
        }
        if (!date2) {
            return true;
        }
        const ret: boolean = (date1.getTime() >= date2.getTime());
        return ret;
    }

    calculateCompanySelectOptions(invoices: Invoice[]): object[] {
        console.log('Method calculateCompanySelectOptions(...) started! ');
        const retList: object[] = [];
        invoices.forEach(function (fktInvoice) {
            retList.push({value: fktInvoice.companyName(), name: fktInvoice.companyName()});
        });
        console.log('Method calculateCompanySelectOptions(...) finished! ');
        return retList;
    }

    calculateCompanySelectOptions2(invoices: Invoice[]): string[] {
        const companyNames = Array.from(new Set(Invoice.companyNames(invoices))); // array unique
        // makes sure that all elements in array are unique
        companyNames.push('--alle--');
        return companyNames.sort();
    }


    sortInvoicesByButtons(sortButtons: ThreeStateButton[], invoices: Invoice[]): Invoice[] {
        // sortInvoicesByButtons(sortButtons: ThreeStateButton[], invoices: Invoice[]): Invoice[] {
        let retInvoices: Invoice[] = invoices;
        if (!sortButtons) {
            return invoices;
        }
        ;


        for (const sortButton of sortButtons) {
            if (sortButton.getSortingOrderId() != 0) {
                retInvoices = Invoice.sortInvoices(sortButton.getSortBy(), (sortButton.getSortingOrderId() == 1), invoices);
            }
        }
        ;
        return retInvoices;
    }


        sortInvoice(): void {
            // TODO filter
            let retInvoices = this.invoices;

            this.invoices = this.sortInvoicesByButtons([this.sortStartDueDate, this.sortStartDate, this.sortCompanyName],
                retInvoices);

        }


    // region getter
    private getGreatPastDate(): Date {
        return new Date('1871-01-18');
    }

    private checkInvoiceState(invoice: Invoice, filterState: string): boolean {
        if (filterState == undefined) {
            return true;
        }
        if (filterState == null) {
            return true;
        }
        if (filterState.trim() == '') {
            return true;
        }
        if (filterState.trim().toLowerCase() == 'none') {
            return true;
        }
        if (filterState.trim().toLocaleLowerCase() == 'kein') {
            return true;
        }

        if (filterState.trim() == invoice.invoiceState) {
            return true;
        } else {
            return false;
        }
    }

    private checkInvoiceCompanyName(invoice: Invoice, filterCompanyName: string): boolean {
        // Fragezeichen vor Doppelpunkt in ParamListe: Dieser Parameter kann Null werden
        if (isNullOrUndefined(filterCompanyName)) {
            return true;
        }
        if (filterCompanyName.trim().toLowerCase() == '') {
            return true;
        }

        if (filterCompanyName.trim().toLowerCase() == '--alle--') {
            return true;
        }
        if (filterCompanyName.trim() == invoice.companyName()) {
            return true;
        } else {
            return false;
        }
    }

    private checkInvoiveCompany(invoice: Invoice, companyNames: string[]): boolean {
        let ret = false;
        companyNames.forEach(function (value) {
            if (value.trim().toLowerCase() == invoice.companyName().trim().toLowerCase()) {
                ret = true;
            }
        });
        return ret;
    }

    // endregion

}
