import {Component, OnInit} from '@angular/core';
// new imports added
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {Invoice} from '../invoice';
import {Item} from '../item';
import {InvoiceKind} from '../invoice-kind';
import {FbInvoiceService} from '../fb-invoice.service';
import {Customer} from '../customer';

@Component({
    selector: 'app-invoice-detail',
    templateUrl: './invoice-detail.component.html',
    styleUrls: ['./invoice-detail.component.css']
})
export class InvoiceDetailComponent implements OnInit {
    ////

    // region IDs
    invoiceId: string;
    // endregion


    // region other properties
    invoice: Invoice = Invoice.getEmptyInvoice();
    customers: Customer[];
    invoiceSelectCustomer = '----------';
    invoiceSelectCustomerDef1 = '----------';
    customerAdress: string;
    bruttoSum: number;
    salesTax: number;

    private changedItemNumber = -1;
    private changedItem: Item;
    private oldItem: Item;



    // nettoSum: number;
    // countReminders: number;
    creatingInvoice: boolean;
    creatingInvoiceBtn: boolean;
    creditorIdentificationNumber = 'DE55ZZZ00001275596';

    customerBIC = 'Invoice-Bsp-BIC';
    customerIBAN = 'Invoice-Bsp-IBAN';
    customerTaxNumber = 'murx';
    mandateIdentification = 'Invoice-Bsp-Mandat'; // Mandatsreferenz fuer SEPA-Lastschriftverfahren


    invoiceCurrency = '€';
    invoiceNumber = '201800xx';
    invoiceIntendedUse = 'die Rechnungsnummer 201800xx';
    invoiceDate: Date;
    invoiceDueDate: Date;
    invoiceTimeSpan = '2018-01-01 bis 2018-12-31';
    invoiceState = 'Entwurf'; // <th>Status (Entwurf, bezahlt, ...)</th>

    invoiceKind: InvoiceKind;

    items: Item[];


    percentageString = '19%';
    receivedInvoiceIdError: boolean;
    salesTaxPercentage = 19;

    timespanBegin: Date = null;
    timespanEnd: Date = null;

    public international = false; // Inlandsrechnung, Bit0
    public timeSpanBased = false; // UZeitraumbasierter Rechnung, Bit1
    public isSEPA = false; // ist SEPA-Lastschrift, Bit2


    // endregion
    private static compareCustomersByName(customer1: Customer, customer2: Customer): number {
        if (customer1.customerName.trim().toLowerCase() < customer2.customerName.trim().toLowerCase()) {
            return -1;
        }
        return 1;
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private fbInvoiceService: FbInvoiceService
    ) {
        this.invoiceDate = new Date();
        this.invoiceKind = InvoiceKind.create(false, false, false);
    }

    ngOnInit() {
        this.creatingInvoice = false;
        this.receivedInvoiceIdError = !this.hasReceivedInvoiceId();
        console.log(`\r\n\r\nInvoiceDetailComponent.ngOnInit() step 002,\r\n creatingInvoice ===${this.creatingInvoice}! \r\n\r\n`);
        if (!this.receivedInvoiceIdError) {
            console.log('receivedInvoiceId==' + this.invoiceId + ';;;', 'color:Blue');
            this.receiveInvoiceById(this.invoiceId, null);
        }
        this.receiveCustomers();
 /*
        console.log('this.creatingInvoiceBtn==' + this.creatingInvoiceBtn);


        if (!this.creatingInvoiceBtn) {
            console.log('this.creatingInvoiceBtn==' + this.creatingInvoiceBtn + '  ifZweig');
            // this.receiveInvoiceById(this.invoiceId);
            this.calculateInitialDataLoad();
            console.log('this.creatingInvoiceBtn==' + this.creatingInvoiceBtn + '  ifZweig');
        } else {
            console.log('this.creatingInvoiceBtn==' + this.creatingInvoiceBtn + '  elseZweig');
            // this.invoiceId = this.invoiceService.createNewInvoiceId();
            this.calculateInitialDataCreate();
        }
        this.calculateSums();
        */
    }

    private editItemNumber(row: number): void {
        this.changedItemNumber = row;
        this.oldItem =  new Item(this.invoice, this.invoice.items[row]);
        this.changedItem =  this.invoice.items[row];
        console.log(`this.changedItemNumber === ${row}`);
    }

    private deleteItemNumber(row: number): void {
        if (confirm(`Posten "${this.invoice.items[row].itemName}" löschen?`)) {
            this.invoice.items = this.invoice.items.filter((item, index) => index !== row);
            this.calculateSums();
        }
    }

    private changeChangedItemCost(): void {
        this.changedItem.wholeCost = this.changedItem.count * this.changedItem.partialCost;
        this.calculateSums();
    }

    private saveItem(): void {
        this.invoice.items[this.changedItemNumber] = Item.normalizeItem(this.invoice, this.invoice.items[this.changedItemNumber]);
        this.changedItemNumber = -1;
        this.calculateSums();
    }

    private notSaveItem(): void {
        this.invoice.items[this.changedItemNumber] = this.oldItem;
        this.changedItemNumber = -1;
        this.calculateSums();
    }

    private addNewItem(): void {
        // this.invoice.items.push(Item.normalizeItem(this.invoice, {}));
        this.invoice.items.push(Item.normalizeItem(this.invoice, {}));
        this.changedItemNumber = this.invoice.items.length - 1;
        this.oldItem =  new Item(this.invoice, this.invoice.items[this.changedItemNumber]);
        this.changedItem =  this.invoice.items[this.changedItemNumber];
    }

    private receiveInvoiceById(methId: string, historyId: string): void {
        if (!this.creatingInvoice) { this.fbInvoiceService.getInvoiceById(methId, historyId).subscribe(invoiceType => {
            this.invoice =  Invoice.normalizeInvoice(invoiceType);

            this.calculateSums();
            this.calculateAddress();
            // console.log('III: ', this.invoice);
        }); } else {
            this.invoice = Invoice.createNewInvoice();
        }

        // TODO receive invoice from firebase-DB
        /* this.invoiceService.getInvoiceObservableById(methId)
            .subscribe(invoice => {
                // TODO receive invoice from firebase-DB
                this.countReminders = invoice.countReminders;
                this.creatingInvoiceBtn = invoice.newCreatedInvoice;
                this.invoiceCurrency = invoice.currency;
                this.invoiceDate = invoice.invoiceDate;
                this.invoiceDueDate = invoice.invoiceDueDate;
                this.invoiceNumber = invoice.invoiceNumber;
                this.invoiceIntendedUse = invoice.invoiceIntendedUse;
                this.invoiceState = invoice.invoiceState;
                this.customerAdress = invoice.recipient;
                this.salesTaxPercentage = invoice.salesTaxPercentage;
                // this.timespan = invoice.timeSpan;
                // -----------------------------
                this.invoiceKind = invoice.invoiceKind;
                this.customerTaxNumber = invoice.customerTaxNumber;

                this.timespanBegin = invoice.timespanBegin;
                this.timespanEnd = invoice.timespanEnd;

              this.international = invoice.invoiceKind.international;
              this.timeSpanBased = invoice.invoiceKind.timeSpanBased;
              this.isSEPA = invoice.invoiceKind.isSEPA;


              // this.items = [];
                // this.invoice.items.forEach((item) => {this.items.push({...item})});
                this.items = invoice.items;
            }); */
        // Empfängt Daten aus einem Datenstream, d.h. wenn sich invoice ändert übernimmt this.invoice die Daten von invoice

    }

    private saveInvoice(): void {
        // TODO: reload new-created invoices to get their Id, reload them by invoiceDate and invoiceCustomerName
        console.log('invoice-detail.component.ts: method saveInvoice');
        // this.creatingInvoiceBtn = false;
        this.calculateSums();
        if (this.creatingInvoice) {
            this.fbInvoiceService.createInvoice(this.invoice.exportInvoiceToAny(false));
            this.creatingInvoice = false;
            this.creatingInvoiceBtn = false;
        } else {
            this.fbInvoiceService.updateInvoice(this.invoiceId, this.invoice.exportInvoiceToAny(false));
        }
        this.router.navigateByUrl('/invoice-list');
    }



    receiveCustomers(): void {
        this.fbInvoiceService.getCustomersList('notArchive')
            .subscribe(data => {
                this.customers = data.map(x => Customer.normalizeCustomer(x));
                this.customers.sort(function (a, b) {
                    return InvoiceDetailComponent.compareCustomersByName(a, b);
                });
            });
    }

    // region other methods

    private calculateInitialDataLoad() {
        // TODO: calculate out-commented data from firebase-DB
        console.log('method calculateInitialDataLoad() {...}');
        // this.percentageString = this.invoiceService.getSalesTaxPercentageString(this.invoiceId);
        this.calculateSums();
    }

    private calculateInitialDataCreate() {
        console.log('method calculateInitialDataCreate() {...}');
        this.invoiceDate = new Date();
        this.invoiceDueDate = new Date(this.invoiceDate.getFullYear(), this.invoiceDate.getMonth(),
            this.invoiceDate.getDate() + 14, 12);

    }

    private calculateAddress(): void {
        this.customerAdress = this.invoice.customer.addressLine1 + '\r\n'
            + this.invoice.customer.addressLine2 + '\r\n' + this.invoice.customer.addressLine3 + '\r\n'
            + this.invoice.customer.postalCode + '\r\n' + this.invoice.customer.city + '\r\n'
            + this.invoice.customer.country ;
    }

    private calculateSums(): void {
        this.invoice.wholeCost = this.invoice.items
            ? this.invoice.items.reduce((sum, current) => sum + current.count * current.partialCost, 0) : 0;
        this.salesTax =  !this.invoice.invoiceKind.international ? this.invoice.wholeCost * this.invoice.salesTaxPercentage / 100 : 0;
        this.bruttoSum = this.salesTax + this.invoice.wholeCost;
    }
    private calculateSavingData() {
        this.calculateSums();
        // this.invoiceDueDate = new Date(this.invoiceDate.getFullYear(), this.invoiceDate.getMonth(),
        //  this.invoiceDate.getDate() + 14, 12);
    }

    public changeFilterCompany(e: string): void {
        // let x: Customer = this.customers.filter(c => c.getCustomerId() == e)[0];
        if (e != this.invoiceSelectCustomerDef1) {
            this.invoice.customer = this.customers.filter(c => c.getCustomerId() == e)[0];
            this.calculateAddress();
        }
        console.log('PPP', this.invoiceSelectCustomer);
        this.invoiceSelectCustomer = this.invoiceSelectCustomerDef1;
        console.log('III', this.invoiceSelectCustomer);
    }

    private changeInternational(): void {
        this.invoice.invoiceKind.international = !this.invoice.invoiceKind.international;
        console.log('invoice-detail.component.ts.changeInternational()');
        this.calculateSums();
    }


    public changeTimeSpanBased(): void {
        console.log('invoice-detail.component.ts.changeTimeSpanBased(), T1');
        this.invoice.invoiceKind.timeSpanBased = !this.invoice.invoiceKind.timeSpanBased;
        console.log('invoice-detail.component.ts.changeTimeSpanBased(), T2');

    }

    public changeIsSEPA(): void {
        this.invoice.invoiceKind.isSEPA = !this.invoice.invoiceKind.isSEPA;
        console.log('invoice-detail.component.ts.changeISSEPAs()');

    }

    private hasReceivedInvoiceId(): // can NOT be deleted
        boolean {
        if (this.route.snapshot.paramMap.has('invoiceId')) {
            this.invoiceId = this.route.snapshot.paramMap.get('invoiceId');  // get itemID???? invoiceId from URL
            this.creatingInvoice = (this.route.snapshot.paramMap.get('newInvoice') === 'true');
            return true;
        } else {
            this.invoiceId = null; // stands for the creation of a new item???? invoice
            return false;
        }
    }

    private invoiceDueDateChange(methEvent: string) {
        this.invoice.invoiceDate = new Date(methEvent);
    }

    private invoiceDateChange(methEvent: string) {
        this.invoice.invoiceDate = new Date(methEvent);
        this.invoice.invoiceDueDate = new Date(this.invoice.invoiceDate.getFullYear(), this.invoice.invoiceDate.getMonth(),
            this.invoice.invoiceDate.getDate() + 14, 12);
    }

    private invoiceTimespanBeginChange(methEvent: string) {
        this.invoice.timespanBegin = new Date(methEvent);
        // this.invoiceDueDate = new Date(this.invoiceDate.getFullYear(), this.invoiceDate.getMonth(),
        //   this.invoiceDate.getDate() + 14, 12);
    }

    private invoiceTimespanEndChange(methEvent: string) {
        this.invoice.timespanEnd = new Date(methEvent);
    }


    private invoiceNumberChange(e: string) {
        this.invoice.invoiceNumber = e;
        this.invoice.invoiceIntendedUse = 'die Rechnungsnummer ' + this.invoice.invoiceNumber;
    }

    private backToInvoiceList(): void {
        // TODO: back to InvoiceList without saving
        if (this.creatingInvoice || this.creatingInvoiceBtn) {
            this.creatingInvoice = false;
            this.creatingInvoiceBtn = false;
        }
        this.router.navigateByUrl('/invoice-list');
    }

    private timespan(): string {
        if (!this.invoice.timespanEnd || !this.invoice.timespanBegin) {
            return 'Ungueltiges Datum';
        }
        const diffMonth: number
            = Math.round((this.invoice.timespanEnd.getTime() - this.invoice.timespanBegin.getTime()) / 1000 / 3600 / 24 / 30);
        return '(' + diffMonth + ' Monate)';
    }

    // endregion


}
