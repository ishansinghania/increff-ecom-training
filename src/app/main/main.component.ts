import * as $ from "jquery";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Location } from "@angular/common";

import { CartService } from "@libs/miscellaneous";
import { LoginManager } from "@libs/login";

@Component({
  selector: "main-comp",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit, OnDestroy {
  quantity: number;
  userName: string;

  date: string;
  dateIntervalId: any;

  constructor(
    private _cartService: CartService,
    private _location: Location,
    private _loginService: LoginManager
  ) {}

  canShow(path: string) {
    return this._location.path() !== path;
  }

  getDateTime() {
    return new Date().toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      year: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  logout() {
    this._loginService.logout();
  }

  ngOnInit() {
    const tooltip = jQuery('[data-toggle="tooltip"]') as any;
    tooltip.tooltip();

    this.userName = this._loginService.userName;

    this.dateIntervalId = setInterval(() => {
      this.date = this.getDateTime();
    }, 1000);

    jQuery("#myTooltip").on("hidden.bs.tooltip", function () {
      // do something...
      console.log("tooltip");
    });

    this._cartService
      .getQuantitySubscription()
      .subscribe((cartQuantity: number) => (this.quantity = cartQuantity));
  }

  ngOnDestroy() {
    clearInterval(this.dateIntervalId);
  }
}
