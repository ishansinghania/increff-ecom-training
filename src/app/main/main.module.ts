import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { MiscellaneousModule } from "@libs/miscellaneous/miscellaneous.module";
import { MainRoutingModule, ROUTING_COMPONENTS } from "./main-routing.module";

import { MainComponent } from "./main.component";
import { ProductComponent } from "./product-list/product/product.component";

@NgModule({
  declarations: [MainComponent, ...ROUTING_COMPONENTS, ProductComponent],
  imports: [CommonModule, MiscellaneousModule, MainRoutingModule],
})
export class MainModule {}
