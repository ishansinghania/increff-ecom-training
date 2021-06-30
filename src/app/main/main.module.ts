import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MiscellaneousModule } from "@libs/miscellaneous/miscellaneous.module";
import { ReusableModule } from "@libs/reusable/reusable.module";

import { MainRoutingModule, ROUTING_COMPONENTS } from "./main-routing.module";
import { MainComponent } from "./main.component";
import { ProductComponent } from "./product-list/product/product.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    ReusableModule,
    MiscellaneousModule,
    MainRoutingModule,
  ],
  declarations: [MainComponent, ...ROUTING_COMPONENTS, ProductComponent],
})
export class MainModule {}
