import { NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { LoginComponent } from "./login.component";
import { LoginManager } from "./login.service";
import { LoginGuard } from "./login.guard";
import { AuthGuard } from "./auth.guard";
import { ReusableModule } from "@libs/reusable/reusable.module";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ReusableModule
  ],
  declarations: [LoginComponent],
  providers: [LoginManager, LoginGuard, AuthGuard],
})
export class LoginModule {}
