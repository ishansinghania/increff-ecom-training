import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

import { CartService } from "@libs/miscellaneous";

@Component({
  selector: "main-comp",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  quantity: number;
  constructor(private _cartService: CartService, private _location: Location) {}

  canShow(path: string) {
    return this._location.path() !== path;
  }

  ngOnInit() {
    this._cartService
      .getQuantitySubscription()
      .subscribe((cartQuantity: number) => (this.quantity = cartQuantity));
  }
}
