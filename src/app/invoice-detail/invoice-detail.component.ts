import {Component, OnInit} from '@angular/core';
import {InvoiceService} from '../invoice.service';
// new imports added
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {Invoice} from '../invoice';
import {Item} from '../item';
import {InvoiceKind} from '../invoice-kind';

@Component({
    selector: 'app-invoice-detail',
    templateUrl: './invoice-detail.component.html',
    styleUrls: ['./invoice-detail.component.css']
})
export class InvoiceDetailComponent implements OnInit {


    //region IDs
    invoiceId: string;
    //endregion


    //region other properties
    bruttoSum: number;
    countReminders: number;
    creatingInvoice: boolean;
    creatingInvoiceBtn: boolean;
    creditorIdentificationNunber = 'DE55ZZZ00001275596';

    customerAdress: string;

    customerBIC = 'Invoice-Bsp-BIC';
    customerIBAN = 'Invoice-Bsp-IBAN';
    customerTaxNumber = 'murx';
    mandateIdentification = 'Invoice-Bsp-Mandat'; // Mandatsreferenz fuer SEPA-Lastschriftverfahren


    invoice: Invoice;
    invoiceCurrency = '€';
    invoiceNumber = '201800xx';
    invoiceIntendedUse = 'die Rechnungsnummer 201800xx';
    invoiceDate: Date;
    invoiceDueDate: Date;
    invoiceTimeSpan = '2018-01-01 bis 2018-12-31';
    invoiceState = 'Entwurf'; // <th>Status (Entwurf, bezahlt, ...)</th>

    invoiceKind: InvoiceKind;

    items: Item[];

    nettoSum: number;
    percentageString = '19%';
    receivedInvoiceIdError: boolean;
    salesTax: number;
    salesTaxPercentage = 19;

  timespanBegin: Date = null;
  timespanEnd: Date = null;

  public international = false; // Inlandsrechnung, Bit0
  public timeSpanBased = false; // UZeitraumbasierter Rechnung, Bit1
  public isSEPA = false; // ist SEPA-Lastschrift, Bit2



    //endregion

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private invoiceService: InvoiceService
    ) {
        this.invoiceDate = new Date();
        this.invoiceKind = new InvoiceKind();
    }

    ngOnInit() {
        console.log('ngOnInit ');
        this.creatingInvoice = false;
        this.receivedInvoiceIdError = !this.hasReceivedInvoiceId();
        if (!this.receivedInvoiceIdError) {
            console.log('receivedInvoiceId==' + this.invoiceId + ';;;', 'color:Blue');
            this.receiveInvoiceById(this.invoiceId);
        }

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
    }


    //region other methods

  private calculateInitialDataLoad() {
        console.log('method calculateInitialDataLoad() {...}');
        this.percentageString = this.invoiceService.getSalesTaxPercentageString(this.invoiceId);
        this.calculateSums();
    }

  private calculateInitialDataCreate() {
        console.log('method calculateInitialDataCreate() {...}');
        this.invoiceDate = new Date();
        this.invoiceDueDate = new Date(this.invoiceDate.getFullYear(), this.invoiceDate.getMonth(),
            this.invoiceDate.getDate() + 14, 12);

    }

  private calculateSums(): void {
        this.nettoSum = this.calculateNettoSum(this.invoiceId);
        this.salesTax = this.calculateSalesTax(this.invoiceId); // hier
        this.bruttoSum = this.calculateBruttoSum(this.invoiceId);
    }

  private calculateSavingData() {
        this.calculateSums();
        // this.invoiceDueDate = new Date(this.invoiceDate.getFullYear(), this.invoiceDate.getMonth(),
        //  this.invoiceDate.getDate() + 14, 12);
    }

  private calculateBruttoSum(methId: string): number {
      return !this.international ? (this.calculateNettoSum(methId) + this.calculateSalesTax(methId)) : this.calculateNettoSum(methId);
    }

  private calculateNettoSum(methId: string): number {
        let methSum = 0;
        if (this.items !== undefined) {
            for (let i = 0; i < this.items.length; i++) {
                methSum += this.items[i].wholeCost;
            }
        }
        return methSum;
    }

  private calculateSalesTax(methId: string): number {
        // var methInvoice: Invoice;
        // methInvoice = this.invoice;
        return this.calculateNettoSum(methId) * this.salesTaxPercentage / 100;
    }

    private changeInternational(): void {
      this.international = !this.international;
      console.log('invoice-detail.component.ts.changeInternational()');
      this.calculateSums();
    }


  public changeTimeSpanBased(): void {
    console.log('invoice-detail.component.ts.changeTimeSpanBased(), T1');
    this.timeSpanBased = !this.timeSpanBased;
    console.log('invoice-detail.component.ts.changeTimeSpanBased(), T2');

  }

  public changeIsSEPA(): void {
    this.isSEPA = !this.isSEPA;
    console.log('invoice-detail.component.ts.changeISSEPAs()');

  }

    private hasReceivedInvoiceId(): // can NOT be deleted
        boolean {
        if (this.route.snapshot.paramMap.has('invoiceId')) {
            this.invoiceId = this.route.snapshot.paramMap.get('invoiceId');  // get itemID???? invoiceId from URL
            return true;
        } else {
            this.invoiceId = null; // stands for the creation of a new item???? invoice
            return false;
        }
    }

    private invoiceDateChange(methEvent: string) {
        this.invoiceDate = new Date(methEvent);
        this.invoiceDueDate = new Date(this.invoiceDate.getFullYear(), this.invoiceDate.getMonth(),
            this.invoiceDate.getDate() + 14, 12);
    }

    private invoiceTimespanBeginChange(methEvent: string) {
        this.timespanBegin = new Date(methEvent);
        // this.invoiceDueDate = new Date(this.invoiceDate.getFullYear(), this.invoiceDate.getMonth(),
        //   this.invoiceDate.getDate() + 14, 12);
    }

    private invoiceTimespanEndChange(methEvent: string) {
        this.timespanEnd = new Date(methEvent);
    }


    private invoiceNumberChange(e: string) {
        this.invoiceNumber = e;
        this.invoiceIntendedUse = 'die Rechnungsnummer. ' + this.invoiceNumber;
    }

    private receiveInvoiceById(methId: string): void {
        this.invoiceService.getInvoiceObservableById(methId)
            .subscribe(invoice => {
                // TODO remove this.invoice.....
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
            });
        // Empfängt Daten aus einem Datenstream, d.h. wenn sich invoice ändert übernimmt this.invoice die Daten von invoice

    }

    private saveInvoice(): void {
        console.log('invoice-detail.component.ts: method saveInvoice');
        this.creatingInvoiceBtn = false;
        this.calculateSavingData();
      this.invoiceKind = InvoiceKind.create(this.international, this.timeSpanBased, this.isSEPA);
        this.invoiceService.saveInvoiceGlobalsByInvoiceId(
            this.invoiceId,
            this.countReminders,
            this.invoiceCurrency,
            this.invoiceDate,
            this.invoiceDueDate,
            this.invoiceNumber,
            this.invoiceIntendedUse,
            this.invoiceState,
            this.customerAdress,
            this.salesTaxPercentage,
            'unknown',
            this.bruttoSum,
            this.invoiceKind,
            this.customerTaxNumber,
            this.timespanBegin,
            this.timespanEnd
        );
    }

    private backToInvoiceList(): void {
        if (this.creatingInvoice || this.creatingInvoiceBtn) {
            this.creatingInvoice = false;
            this.creatingInvoiceBtn = false;
            this.invoiceService.removeInvoiceById(this.invoiceId);
        }
        this.router.navigateByUrl('/invoice-list');
    }

    private timespan(): string {
      if (!this.timespanEnd || !this.timespanBegin) {
        return 'Ungueltiges Datum';
      }
      const diffMonth: number = Math.round((this.timespanEnd.getTime() - this.timespanBegin.getTime()) / 1000 / 3600 / 24 / 30);
      return '(' + diffMonth + ' Monate)';
    }

    //endregion


}
