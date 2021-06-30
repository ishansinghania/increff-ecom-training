import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";

import { LoginModule } from "@libs/login/login.module";
import { MiscellaneousModule } from "@libs/miscellaneous/miscellaneous.module";

import { MainRoutingModule } from "./main-routing.module";
import { MainComponent } from "./main.component";

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    MiscellaneousModule,
  ],
  bootstrap: [MainComponent],
})
export class MainModule {}
