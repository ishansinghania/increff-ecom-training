import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpResponse,
} from "@angular/common/http";
import { catchError, finalize, tap } from "rxjs/operators";
import { Observable, of } from "rxjs";

// const RETRY_COUNT = new HttpContextToken(() => 3);
const USER_URL = "assets/users.json";
const PRODUCT_URL = "assets/available-inventory.json";

@Injectable()
export class ApiService {
  constructor(private _httpClient: HttpClient) {}

  showLoader() {
    jQuery('#loader').removeClass('d-none');
  }

  hideLoader() {
    jQuery('#loader').addClass('d-none');
  }

  getUsers(): Observable<HttpResponse<any>> {
    this.showLoader();
    return this._httpClient
      .get(USER_URL, {
        observe: "response",
        // We can read this count in the http handler for having a retry(count).
        // Setting a default value here for this request.
        // context: new HttpContext().set(RETRY_COUNT, 5),
        responseType: "json",
      })
      .pipe(
        tap((response) => console.log(response)),
        catchError((err) => {
          console.error(err);
          return of(err);
        }),
        finalize(() => this.hideLoader()),
      );
  }

  getProducts() {
    this.showLoader();
    return this._httpClient
      .get(PRODUCT_URL, {
        observe: "response",
        responseType: "json",
      })
      .pipe(
        tap((response) => console.log(response)),
        catchError((err) => {
          console.error(err);
          return of(err);
        }),
        finalize(() => this.hideLoader()),
      );
  }
}
