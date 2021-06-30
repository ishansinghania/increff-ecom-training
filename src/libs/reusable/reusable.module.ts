import { NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { StorageService } from "./storage-service.component";
import { ApiService } from "./api-service.component";

@NgModule({
  imports: [CommonModule, HttpClientModule, RouterModule],
  providers: [StorageService, ApiService],
})
export class ReusableModule {}