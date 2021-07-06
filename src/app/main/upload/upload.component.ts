import * as Papa from "papaparse";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { ApiService, ToastService } from "@libs/reusable";
import { LoginManager } from "@libs/login";

const Upload = {
  id: 0,
  brandName: "",
  name: "",
  clientSkuId: 0,
  size: "",
  quantity: 0,
  mrp: 0,
  subtotal: 0,
  gst: 0,
  total: 0,
};

@Component({
  selector: "order-upload",
  templateUrl: "./upload.component.html",
})
export class UploadComponent {
  products: typeof Upload[];
  fields = Object.keys(Upload);

  @ViewChild("fileUpload") fileUpload: ElementRef;

  constructor(
    private _apiService: ApiService,
    private _loginService: LoginManager,
    private _toastService: ToastService
  ) {}

  handleFileInput(event: any) {
    if (!this._loginService.checkSession()) return;
    const file: File = event.target.files[0];

    if (file) {
      this._apiService.showLoader();

      this.products = [];

      Papa.parse(file, {
        dynamicTyping: true,
        skipEmptyLines: true,
        header: true,
        complete: (results, file) => {
          const uploadData = results.data as typeof Upload[];
          uploadData.every((entry, index) => {
            return this.sanitizeRow(entry, index);
          });

          // Resetting the file input
          this.fileUpload.nativeElement.value = null;

          this._apiService.hideLoader();
        },
        error: (err) => {
          this._apiService.hideLoader();
        },
      });
    }
  }

  sanitizeRow(row: typeof Upload, index: number): boolean {
    if (this.fields.length !== Object.keys(row).length) {
      this._toastService.error(`Some columns missing`);
      return false;
    } else if (!row.id || row.id < 0) {
      this._toastService.error(
        `ID should be greater than 0 at row index ${index + 1}`
      );
      return false;
    } else if (!row.quantity) {
      this._toastService.error(
        `Quantity should be atleast 1 at row index ${index + 1}`
      );
      return false;
    } else {
      const rowValues: any = {};
      for (const [key, value] of Object.entries(row)) {
        if (value === null || value === void 0) {
          this._toastService.error(
            `Some columns values missing at row index ${index + 1}`
          );
          return false;
        }
        rowValues[key] = value;
      }
      this.products.push(rowValues);
      return true;
    }
  }
}
