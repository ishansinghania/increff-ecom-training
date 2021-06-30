import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { CartService } from "@libs/miscellaneous";
import { Product } from "../../../../model";

@Component({
  selector: "product",
  templateUrl: "product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent {
  @Input() product: Product;

  quantity: number = 1;

  constructor(
    private _cartService: CartService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  addToCart(event: Event) {
    this.stopPropagation(event);
    this._cartService.addToCart(this.product.id, this.quantity);
  }

  navigateToDetail() {
    this._router.navigate([this.product.id], {
      relativeTo: this._route,
    });
  }
}
