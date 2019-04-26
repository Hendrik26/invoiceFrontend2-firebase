import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InvoiceListComponent_old} from './invoice-list.component';

describe('InvoiceListComponent', () => {
  let component: InvoiceListComponent_old;
  let fixture: ComponentFixture<InvoiceListComponent_old>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceListComponent_old]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceListComponent_old);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
