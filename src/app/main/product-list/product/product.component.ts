import { Component, Input } from "@angular/core";

import { CartService } from "@libs/miscellaneous";
import { Product } from "../../../../model";

@Component({
  selector: "product",
  templateUrl: "product.component.html",
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  @Input() product: Product;

  quantity: number = 1;

  constructor(private _cartService: CartService) {}

  addToCart() {
    this._cartService.addToCart(this.product.id, this.quantity);
  }
}
