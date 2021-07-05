import { Component, OnInit } from "@angular/core";
import { tap } from "rxjs/operators";
import { ToastService, ToastData } from "@libs/reusable";

@Component({
  selector: "toast",
  templateUrl: "./toast.component.html",
  styleUrls: ["./toast.component.scss"],
})
export class ToastComponent implements OnInit {
  toastData: ToastData;
  timeoutID: any;

  constructor(private _toastService: ToastService) {}

  getClass() {
    const toastClass =
      this.toastData.type + " " + (this.timeoutID ? "show" : "hide");
    return toastClass;
  }

  dismiss(this: any) {
    clearTimeout(this.timeoutID);
    this.timeoutID = null;
  }

  ngOnInit() {
    this._toastService
      .generateToasts()
      .pipe(
        tap((res) => {
          res;
        })
      )
      .subscribe((response) => {
        if (this.timeoutID) this.dismiss.call(this);

        this.timeoutID = setTimeout(this.dismiss.bind(this), 5000);
        this.toastData = response;
      });
  }
}
