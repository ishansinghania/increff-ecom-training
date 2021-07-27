import * as Papa from "papaparse";

import { Component, OnDestroy, OnInit } from "@angular/core";
import { finalize, takeWhile, tap } from "rxjs/operators";

import { ApiService, ToastService } from "@libs/reusable";
import { CartService } from "@libs/miscellaneous";
import { LoginManager } from "@libs/login";
import { Product } from "../../../model";

interface CartItem {
  id: number;
  quantity: number;
}

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
      .circle {
        border-radius: 50% !important;
        height: 22px;
        width: 22px;
        background-color: #ebeff4;
        box-shadow: 0 0.1rem 0.1rem rgb(0 0 0 / 10%);
      }
    `,
  ],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private _alive: boolean = true;

  productList: Product[] = [];
  cartItems: CartItem[] = [];

  paymentInfo: {
    subtotal: number;
    gst: number;
    total: number;
  };

  isProductsFetched: boolean = false;
  totalCount = 0;

  constructor(
    private _apiService: ApiService,
    private _cartService: CartService,
    private _loginService: LoginManager,
    private _toastService: ToastService
  ) {}

  getCartItem(productId: number) {
    return this.cartItems.find((item) => item.id === productId);
  }

  getQuantity(productId: number) {
    const item = this.getCartItem(productId);
    return item ? item?.quantity : 0;
  }

  updateQuantity(quantity: number, index: number) {
    const product = this.productList[index];
    let item = this.getCartItem(product.id) as CartItem;
    item.quantity += quantity;

    if (item.quantity <= 0) {
      this.deleteProduct(product.id);
      return;
    }

    this.paymentInfo.subtotal += product.mrp * quantity;
    this.calculatePayment();
    this._cartService.updateCartItemQuantity(product.id, quantity);
  }

  calculatePayment() {
    this.paymentInfo.gst = Number(
      (this.paymentInfo.subtotal * 0.14).toFixed(2)
    );
    this.paymentInfo.total = Number(
      (this.paymentInfo.gst + this.paymentInfo.subtotal).toFixed(2)
    );
  }

  initializeCart() {
    this.isProductsFetched = false;
    this.totalCount = 0;
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
              if (product?.id > 0 && item?.quantity > 0) {
                this.paymentInfo.subtotal += product.mrp * item.quantity;
                this.productList.push(product);
                ++this.totalCount;
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
    if (!this._loginService.checkSession()) return;
    const fields = ["id", "brandName", "name", "clientSkuId", "size", "mrp"];
    let products: { [key: string]: any }[] = [];

    this.productList.forEach((product: any) => {
      const temp: { [key: string]: any } = {};
      fields.forEach((field) => {
        temp[field] = product[field];
      });

      const item = this.getCartItem(product.id) as CartItem;
      if (item && item.quantity > 0) {
        temp["quantity"] = item?.quantity;
        temp["subtotal"] = item?.quantity * product?.mrp;
        temp["gst"] = Number((temp?.subtotal * 0.14).toFixed(2));
        temp["total"] = Number((temp?.subtotal + temp?.gst).toFixed(2));
        products.push(temp);
      }
    });
    products = products.sort((a, b) => a.id - b.id);

    const csv = Papa.unparse(products, {
      skipEmptyLines: true,
    });

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

    this._toastService.success("Order placed successfully!");
  }

  ngOnInit() {
    this.initializeCart();
  }

  ngOnDestroy() {
    this._alive = false;
  }
}
