import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { User, USER_KEY } from "../../model";
import { ApiService, StorageService } from "@libs/reusable";

@Injectable()
export class LoginManager {
  private _user: User;
  redirectUrl: string;

  constructor(
    private _apiService: ApiService,
    private _storageService: StorageService,
    private _router: Router
  ) {}

  get userName() {
    return this._user?.name || "";
  }

  get user(): User {
    // Will fetch the user from the local storage for the first time otherwise will return the in memory stored user.
    // if (!this._user) {}
    this._user = this._storageService.getLocal(USER_KEY);
    return this._user;
  }

  private _setUser(user: User) {
    this._user = { ...user } as User;
    this._storageService.saveLocal(USER_KEY, user);
  }

  redirectToLogin() {
    this._router.navigateByUrl("/login");
  }

  isAuthenticated() {
    const loggedInUser = this.user;
    return loggedInUser && loggedInUser.id;
  }

  resetUser() {
    this._user = void 0 as any;
  }

  login(email: string, password: string): Observable<any> {
    return this._apiService.getUsers().pipe(
      map((response) => {
        if (response.status === 200) {
          const loggedInUser = response.body.filter(
            (user: User) => user.email === email && user.password === password
          );
          if (loggedInUser?.length) {
            this._setUser(loggedInUser[0]);
            return loggedInUser[0];
          } else return false;
        }
        return response;
      }),
      catchError((err) => err)
    );
  }

  logout() {
    this._storageService.clearLocal(USER_KEY);
    this.resetUser();
    this.redirectToLogin();
  }
}
