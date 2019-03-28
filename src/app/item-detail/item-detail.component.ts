import {Component, OnInit} from '@angular/core';
import {Item} from '../item';
import {ItemService} from '../item.service';
import {InvoiceService} from '../invoice.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {

  //region IDs
  invoiceId: string;
  itemId: number;
  //endregion

  //region other properties
  backUrl: string;
  count: number;
  creatingItem: boolean;
  currency: string;
  currentItem: Item;
  hourPayment = true;
  item: Item;
  itemDate: string;
  itemName: string;
  partialCost: number;
  salesTax: number;
  wholeCost: number;

  //endregion


  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private invoiceService: InvoiceService,
    private itemService: ItemService
  ) {
  }

  ngOnInit() {
    this.receiveInvoiceId();
    this.creatingItem = !this.hasReceivedItemId();
    if (!this.creatingItem) {
      this.receiveItemByIds(this.invoiceId, this.itemId);
    }
    this.backUrl = '/invoice-detail/' + this.invoiceId;
  }

  //region other methods
  private cancelItem(): void {
    this.receiveItemByIds(this.invoiceId, this.itemId);
  }

  private hasReceivedItemId():
    boolean {
    if (this.route.snapshot.paramMap.has('itemId')) {
      this.itemId = +this.route.snapshot.paramMap.get('itemId');  // get itemID from URL
      // this.itemId = +this.route.snapshot.paramMap.get('itemId');  // + converts string to number here
      return true;
    } else {
      this.itemId = null; // stands for the creation of a new item
      return false;
    }
  }

  private receiveInvoiceId():
    void {
    this.invoiceId = this.route.snapshot.paramMap.get('invoiceId');  // get invoiceID from URL
  }


  private receiveItemByIds(methInvoiceId: string, methItemId: number): void {
    this.itemService.getItemByItemId(methInvoiceId, methItemId)
      .subscribe((itemReceived: Item) => { // Lambda-Expression
        this.currentItem = itemReceived;
        this.itemName = itemReceived.itemName;
        this.itemDate = itemReceived.itemDate;
        this.hourPayment = itemReceived.hourPayment;
        this.partialCost = itemReceived.partialCost;
        this.count = itemReceived.count;
        this.currency = itemReceived.currency;
        this.wholeCost = itemReceived.wholeCost;
      });
    // Empfängt Daten aus einem Datenstream, d.h. wenn sich invoice ändert übernimmt this.invoice die Daten von invoice
  }

  private saveItem(): void {
    // TODO Error if pressing saveButton in item-detail.component.html more then one time
    this.wholeCost = this.count * this.partialCost;
    if (this.creatingItem) {
      this.itemId = this.itemService.saveNewItemByInvoiceId(this.invoiceId, this.count, this.currency,
        this.hourPayment, this.itemDate, this.itemName, this.partialCost);
      this.creatingItem = false;
    } else {
      this.itemService.saveItemByIds(this.invoiceId, this.itemId, this.count, this.currency,
        this.hourPayment, this.itemDate, this.itemName, this.partialCost);
    }
  }


  private togglePayment() {
    this.hourPayment = !this.hourPayment;
  }

  //endregion
}
