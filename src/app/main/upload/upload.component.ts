import * as Papa from "papaparse";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { ApiService } from "@libs/reusable";
import { LoginManager } from "@libs/login";

interface Upload {
  id: number;
  brandName: string;
  name: string;
  clientSku: string;
  size: string;
  mrp: number;
  subtotal: number;
  gst: number;
  total: number;
}

@Component({
  selector: "order-upload",
  templateUrl: "./upload.component.html",
})
export class UploadComponent {
  products: Upload[];
  fields: [] = [];

  @ViewChild("fileUpload") fileUpload: ElementRef;

  constructor(
    private _apiService: ApiService,
    private _loginService: LoginManager
  ) {}

  handleFileInput(event: any) {
    if (!this._loginService.checkSession()) return;
    const file: File = event.target.files[0];

    if (file) {
      this._apiService.showLoader();

      Papa.parse(file, {
        complete: (results, file) => {
          const data = results.data as [];
          this.fields = results.data[0] as [];
          this.products = data.slice(1);

          this._apiService.hideLoader();

          // Resetting the file input
          this.fileUpload.nativeElement.value = null;
        },
        error: (err) => {
          this._apiService.hideLoader();
        },
      });
    }
  }
}
