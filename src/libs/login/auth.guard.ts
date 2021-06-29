import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Location } from "@angular/common";
import { LoginManager } from "./login.service";
import { of } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _loginManager: LoginManager,
    private _router: Router,
    private location: Location
  ) {}

  private getFullPath() {
    return this.location.path();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this._loginManager.isAuthenticated()) return of(true);

    const path = this.getFullPath();

    // extra check if user try to load login
    if (path && path !== "/login") this._loginManager.redirectUrl = path;

    this._router.navigateByUrl("/login");
    return of(false);
  }
}
