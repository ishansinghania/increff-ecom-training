import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";

export interface ToastData {
  header: string;
  message: string;
  type: "success" | "error";
}

@Injectable()
export class ToastService {
  toast = new BehaviorSubject<any>(void 0);

  success(message: string, header: string = "Success") {
    this.toast.next({
      header,
      message,
      type: "success",
    });
  }

  error(message: string, header: string = "Error") {
    this.toast.next({
      header,
      message,
      type: "error",
    });
  }

  generateToasts(): Observable<ToastData> {
    return this.toast.asObservable();
  }
}
