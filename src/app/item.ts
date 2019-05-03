import {Invoice} from './invoice';
import {ItemType} from './item-type';
import {InvoiceType} from './invoice-type';

export class Item implements ItemType {

  //region other properties
  itemDate: string; /// <th>Leistungsdatum</th>
  itemName: string;  // <th>Leistungsbeschreibung</th>
  //endregion
  partialCost: number; // <th>Stückpreis</th>
  count: number; // <th>Anzahl</th>
  wholeCost: number; // <th>Gesamtpreis</th>
  hourPayment = false;
  currency = '€';
  //region IDs
  private itemId: number; // <th>Ändern</th>
  private invoiceId: string;

  //endregion

  public constructor(invoice: Invoice, data: ItemType) {
    this.itemId = invoice.computeNextItemId(); // item needs itemId and invoiceId to be unique.
    this.invoiceId = invoice.getID(); // item needs itemId and invoiceId to be unique.
    this.itemDate = data.itemDate;
    this.itemName = data.itemName;
    this.partialCost = data.partialCost;
    this.count = data.count;
    this.wholeCost = data.count * data.partialCost;
    this.hourPayment = data.hourPayment;
    this.currency = data.currency || '€';
  }

  public static normalizeItem(motherInvoice: Invoice, inputItem: any): Item {
    const itemData: ItemType = {
        itemDate: inputItem.itemDate ? inputItem.itemDate : new Date(), /// <th>Leistungsdatum</th>
        itemName: inputItem.itemName ? inputItem.itemName : 'bspItemName',  // <th>Leistungsbeschreibung</th>
        partialCost: inputItem.partialCost ? inputItem.partialCost : -99, // <th>Stückpreis</th>
        count: inputItem.count ? inputItem.count : -11, // <th>Anzahl</th>
        hourPayment: !!inputItem.hourPayment,
        currency: inputItem.currency ? inputItem.currency : 'bspCurrency'
    };
    return new Item(motherInvoice, itemData);
  }

  //region getter
  public getData(): ItemType {
    let data: ItemType;
    data = {
      itemDate: this.itemDate,
      itemName: this.itemName,
      partialCost: this.partialCost,
      count: this.count,
      hourPayment: this.hourPayment,
      currency: this.currency
    };
    return data;
  }

  public getItemId(): number {
    return this.itemId;
  }

  public getInvoiceId(): string {
    return this.invoiceId;
  }

    public countString(): string {
        return this.hourPayment ? (this.count.toString() + 'h') : (this.count.toString() + ' Stück');
    }

    public partialCostString(currency: string): string {
      return this.hourPayment ? (this.partialCost.toString() + currency + '/h') : (this.partialCost.toString() + currency);
  }
    public exportItemData(): ItemType {
      return {
          itemDate: this.itemDate, /// <th>Leistungsdatum</th>
          itemName: this.itemName,  // <th>Leistungsbeschreibung</th>
          partialCost: this.partialCost, // <th>Stückpreis</th>
          count: this.count, // <th>Anzahl</th>
          hourPayment: this.hourPayment,
          currency: this.currency
      };
    }

  //endregion

  // other methods


}

