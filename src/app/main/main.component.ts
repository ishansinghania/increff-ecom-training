import { Component, OnInit } from "@angular/core";
import { CartService } from "@libs/miscellaneous";

@Component({
  selector: "main-comp",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  quantity: number;
  constructor(private _cartService: CartService) {}

  ngOnInit() {
    this._cartService
      .getQuantity()
      .subscribe((cartQuantity: number) => (this.quantity = cartQuantity));
  }
}
