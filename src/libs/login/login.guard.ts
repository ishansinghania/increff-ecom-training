import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";

import { LoginManager } from "./login.service";

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private _loginManager: LoginManager, private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this._loginManager.isAuthenticated()) return true;

    this._router.navigateByUrl("/");
    return false;
  }
}
