import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { tap, takeWhile, finalize } from "rxjs/operators";

import { Product } from "../../../model";
import { ApiService, ToastService } from "@libs/reusable";
import { CartService } from "@libs/miscellaneous";

@Component({
  selector: "product-detail",
  templateUrl: "./product-detail.component.html",
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private _alive: boolean = true;

  productId: number;
  product: Product;
  quantity: number = 1;
  isProductFetched: boolean = false;

  constructor(
    private _apiService: ApiService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _cartService: CartService,
    private _toastService: ToastService
  ) {}

  addToCart() {
    this._cartService.addToCart(this.productId, this.quantity);
    this.quantity = 1;
  }

  ngOnInit() {
    this.productId = +this._route.snapshot.params?.id;

    if (!this.productId) {
      this._toastService.error(
        "Product not found. Redirecting to list!"
      );
      this._router.navigateByUrl("/");
      return;
    }

    this._apiService
      .getProducts()
      .pipe(
        tap((response) => {
          const products = response.body as Product[];
          const index = products.findIndex(
            (product) => product.id === this.productId
          );

          if (index >= 0) this.product = products[index];
        }),
        finalize(() => (this.isProductFetched = true)),
        takeWhile(() => this._alive)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this._alive = false;
  }
}
