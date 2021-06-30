import { Component, OnDestroy, OnInit } from "@angular/core";
import { takeUntil, takeWhile } from "rxjs/operators";

import { ApiService } from "@libs/reusable/api-service.component";
import { Product } from "../../../model";

@Component({
  selector: "product-list",
  templateUrl: "./product-list.component.html",
})
export class ProductListComponent implements OnInit, OnDestroy {
  private _alive: boolean = true;
  productList: Product[];

  constructor(private _apiService: ApiService) {}

  ngOnInit() {
    this._apiService
      .getProducts()
      .pipe(takeWhile(() => this._alive))
      .subscribe((response) => (this.productList = response.body));
  }
  ngOnDestroy() {}
}
