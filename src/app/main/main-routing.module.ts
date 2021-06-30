import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
// import { AuthGuard, LoginGuard } from '../libs/login';
import { MainComponent } from "./main.component";

const routes: Routes = [
  {
    path: "",
    component: MainComponent,
  },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
