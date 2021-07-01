import * as Papa from "papaparse";

import { Component, OnDestroy, OnInit } from "@angular/core";
import { finalize, takeWhile, tap } from "rxjs/operators";

import { ApiService } from "@libs/reusable";
import { CartService } from "@libs/miscellaneous";
import { Product } from "../../../model";

@Component({
  selector: "checkout",
  templateUrl: "./checkout.component.html",
  styles: [
    `
      .fa-trash-alt {
        position: absolute;
        bottom: 0;
        right: 0;
        color: #6c7575;
      }
      .fa-trash-alt:hover {
        color: #dc3545 !important;
      }
    `,
  ],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private _alive: boolean = true;

  productList: Product[] = [];
  cartItems: {
    id: number;
    quantity: number;
  }[] = [];

  paymentInfo: {
    subtotal: number;
    gst: number;
    total: number;
  };

  isProductsFetched: boolean = false;

  constructor(
    private _apiService: ApiService,
    private _cartService: CartService
  ) {}

  getQuantity(productId: number) {
    const item = this.cartItems.find((item) => item.id === productId);
    return item ? item?.quantity : 0;
  }

  calculatePayment() {
    this.paymentInfo.gst = Number(
      (this.paymentInfo.subtotal * 0.14).toFixed(2)
    );
    this.paymentInfo.total = this.paymentInfo.gst + this.paymentInfo.subtotal;
  }

  initializeCart() {
    this.isProductsFetched = false;
    this.paymentInfo = {
      subtotal: 0,
      gst: 0,
      total: 0,
    };
    this.productList = [];

    this.cartItems = this._cartService.getCartItems();
    if (this.cartItems?.length) {
      this._apiService
        .getProducts()
        .pipe(
          tap((response) => {
            const products = response.body as Product[];

            for (let item of this.cartItems) {
              const product = products.find(
                (product) => product.id === item.id
              ) as Product;
              if (product?.id && item?.quantity) {
                this.paymentInfo.subtotal += product.mrp * item.quantity;
                this.productList.push(product);
              }
            }

            this.calculatePayment();
          }),
          takeWhile(() => this._alive),
          finalize(() => (this.isProductsFetched = true))
        )
        .subscribe();
    } else this.isProductsFetched = true;
  }

  deleteProduct(productId: number) {
    if (this._cartService.removeCartItem(productId)) this.initializeCart();
  }

  downloadOrder() {
    const fields = ["id", "brandName", "name", "clientSkuId", "size", "mrp"];

    const products = this.productList
      .map((product: any) => {
        const temp: { [key: string]: any } = {};
        fields.forEach((field) => {
          temp[field] = product[field];
        });

        const item = this.cartItems.find((item) => (item.id = product.id));
        temp["quantity"] = item?.quantity;
        temp["subtotal"] = temp?.quantity * product?.mrp;
        temp["gst"] = (temp?.subtotal * 0.14).toFixed(2);
        temp["total"] = temp?.subtotal + temp?.gst;

        return temp;
      })
      .sort((a, b) => a.id - b.id);

    const csv = Papa.unparse(products);

    // converting to a blob file

    const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    let csvURL = null;
    if (navigator.msSaveBlob) {
      csvURL = navigator.msSaveBlob(csvData, "order.csv");
    } else {
      csvURL = window.URL.createObjectURL(csvData);
    }

    // creating a temporary element to mock a click and download the file.
    const tempLink = document.createElement("a");
    tempLink.href = csvURL as string;
    tempLink.setAttribute("download", "order.csv");
    tempLink.click();

    window.alert("Order placed successfully");
  }

  ngOnInit() {
    this.initializeCart();
  }

  ngOnDestroy() {
    this._alive = false;
  }
}
