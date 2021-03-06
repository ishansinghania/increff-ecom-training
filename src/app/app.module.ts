import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { LoginModule } from "@libs/login/login.module";
import { MiscellaneousModule } from "@libs/miscellaneous/miscellaneous.module";
import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MiscellaneousModule,
    LoginModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
