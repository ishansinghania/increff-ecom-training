import * as Papa from "papaparse";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { ApiService } from "@libs/reusable";

interface UploadProduct {
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
  products: UploadProduct[];
  fields: [] = [];

  @ViewChild("fileUpload") fileUpload: ElementRef;

  file: File | null = null;

  constructor(private _apiService: ApiService) {}

  handleFileInput(event: any) {
    this.file = event.target.files[0];

    if (this.file) {
      this._apiService.showLoader();

      Papa.parse(this.file, {
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
