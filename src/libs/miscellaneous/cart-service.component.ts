import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { LoginManager } from "@libs/login";
import { StorageService, ToastService } from "@libs/reusable";
import { Product, CART_KEY } from "../../model";

@Injectable()
export class CartService {
  private quantity = new BehaviorSubject<number>(this.getQuantity());

  constructor(
    private _storageService: StorageService,
    private _loginService: LoginManager,
    private _toastService: ToastService,
  ) {}

  getQuantitySubscription(): Observable<number> {
    return this.quantity.asObservable();
  }

  getQuantity(): number {
    const cartItemMap = this.getCartItems();
    const totalQuantity = cartItemMap.reduce(
      (accr: number, curr: Product) => (accr += curr.quantity),
      0
    );
    return totalQuantity;
  }

  updateQuantity() {
    this.quantity.next(this.getQuantity());
  }

  getLoggedInUserCartMap() {
      return this._storageService.getLocal(CART_KEY) ?? {};
  }

  getCartItems(): Product[] {
    const cartItemMap = this.getLoggedInUserCartMap();
    const user = this._loginService.user;
    return cartItemMap.hasOwnProperty(user.id) ? cartItemMap[user.id] : [];
  }

  setCartItems(values: Product[]): void {
    const cartMap = this.getLoggedInUserCartMap();
    const user = this._loginService.user;

    cartMap[user.id] = values;
    this._storageService.saveLocal(CART_KEY, cartMap);
  }

  addToCart(id: number, quantity: number) {
      if(!this._loginService.checkSession()) return;

    if (quantity < 1) {
        this._toastService.error("Quantity should be atleast one!");
    //   window.alert("Quantity should be atleast one!");
      return;
    }

    const cartItems = this.getCartItems();
    if (cartItems.length) {
      const index = cartItems.findIndex((item) => item.id === id);
      if (index !== -1) {
        cartItems[index].quantity += quantity;

        this.setCartItems(cartItems);
        this.updateQuantity();
        this._toastService.success("Product added successfully!");
        
        // window.alert("Product added successfully");
        return;
      }
    }
    // Adding in the cart if the product is not found in the cart
    cartItems.push({
      id,
      quantity,
    } as Product);

    this.setCartItems(cartItems);
    this.updateQuantity();
    this._toastService.success("Product added successfully!");

    // window.alert("Product added successfully");
  }

  removeCartItem(productId: number) {
    if(!this._loginService.checkSession()) return;

      let cartItems = this.getCartItems();
      cartItems = cartItems.filter((item) => item.id !== productId);

      this.setCartItems(cartItems);
      this.updateQuantity();

      this._toastService.success("Product deleted successfully!");
    //   window.alert('Product deleted successfully!');
      return true;
  }
}
