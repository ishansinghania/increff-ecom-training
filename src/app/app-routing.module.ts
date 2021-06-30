import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "../libs/login/login.component";
import { AuthGuard, LoginGuard } from "../libs/login";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "login",
        component: LoginComponent,
        canActivate: [LoginGuard],
      },
      {
        path: "",
        loadChildren: () =>
          import("./main/main.module").then((m) => m.MainModule),
        canActivate: [AuthGuard],
      },
      { path: "**", redirectTo: "" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
