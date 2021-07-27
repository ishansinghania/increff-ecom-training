import * as Papa from "papaparse";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { ApiService } from "@libs/reusable";
import { LoginManager } from "@libs/login";

const Upload: {
  [key: string]: string | number;
} = {
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
  styles: [
    `
      @media (min-width: 992px) {
        th {
          position: sticky;
          top: 3.7rem;
          z-index: 99999;
          background-color: #343a40;
          color: #fff;
          text-transform: capitalize;
        }
      }

      @media (max-width: 992px) {
        .overflow {
          overflow: auto;
        }
      }
    `,
  ],
})
export class UploadComponent {
  products: typeof Upload[];
  errors: string[];
  fields = Object.keys(Upload);

  @ViewChild("fileUpload") fileUpload: ElementRef;

  constructor(
    private _apiService: ApiService,
    private _loginService: LoginManager
  ) {}

  stopParsing() {
    // Resetting the file input

    this.fileUpload.nativeElement.value = null;
    this._apiService.hideLoader();
  }

  handleFileInput(event: any) {
    if (!this._loginService.checkSession()) return;
    const file: File = event.target.files[0];

    if (file) {
      this._apiService.showLoader();
      this.products = [];
      this.errors = [];

      Papa.parse(file, {
        dynamicTyping: true,
        skipEmptyLines: true,
        header: true,
        complete: (results, file) => {
          const uploadData = results.data as typeof Upload[];

          // Checking for extra columns in the uploaded file
          let hasAllKeys = true;
          results.meta.fields?.forEach((field) => {
            if (!Upload.hasOwnProperty(field)) {
              this.errors.push(`Extra column ${field} in the table`);
              hasAllKeys = false;
            }
          });

          // If extra columns are found, stop the parsing and show the errors
          if (!hasAllKeys) {
            this.stopParsing();
            return;
          }

          uploadData.forEach((entry, index) => this.sanitizeRow(entry, index));
          this.stopParsing();
        },
        error: () => this.stopParsing(),
      });
    }
  }

  sanitizeRow(row: typeof Upload, index: number) {
    let hasError = false;

    // Checking for negative id field
    if (!row?.id || row?.id <= 0) {
      hasError = true;
      this.errors.push(`ID should be greater than 0 at row index ${index + 1}`);
    }

    // Checking for negative quantity field
    if (!row?.quantity || row?.quantity <= 0) {
      hasError = true;
      this.errors.push(
        `Quantity should be atleast 1 at row index ${index + 1}`
      );
    }
    const rowValues: any = {};
    for (const [key, value] of Object.entries(row)) {
      // Checking for empty fields
      if (value === null || value === void 0) {
        hasError = true;
        this.errors.push(`${key} value missing at row index ${index + 1}`);
      }

      // Type checking each field and value. Ex, if string is provided in number field.
      if (typeof value !== typeof Upload[key]) {
        hasError = true;
        this.errors.push(
          `Expected ${typeof Upload[
            key
          ]} for ${key} but got ${typeof value} at row index ${index + 1}`
        );
      }
      rowValues[key] = value;
    }

    // Displaying only those rows which do not contain any error
    if (!hasError) this.products.push(rowValues);
  }
}
