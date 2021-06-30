import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { ReusableModule } from "@libs/reusable/reusable.module";
import { CartService } from "./cart-service.component";

@NgModule({
  imports: [CommonModule, RouterModule, ReusableModule],
  providers: [CartService],
})
export class MiscellaneousModule {}
