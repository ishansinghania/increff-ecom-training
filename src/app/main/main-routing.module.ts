import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { MainComponent } from "./main.component";
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductDetailComponent } from "./product-detail/product-detail.component";

const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    children: [
      {
        path: "",
        component: ProductListComponent,
      },
      {
        path: ":id",
        component: ProductDetailComponent,
      },
      { path: "**", redirectTo: "" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}

export const ROUTING_COMPONENTS = [
  ProductListComponent,
  ProductDetailComponent,
];
