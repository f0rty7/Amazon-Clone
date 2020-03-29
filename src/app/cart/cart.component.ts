import { RestApiService } from "./../rest-api.service";
import { Router } from "@angular/router";
import { DataService } from "./../data.service";
import { Component, OnInit } from "@angular/core";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"]
})
export class CartComponent implements OnInit {
  btnDisabled = false;
  handler: any;
  quantities = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private restApiService: RestApiService
  ) {}

  data = this.dataService;

  ngOnInit() {
    this.cartItems.forEach(data => {
      this.quantities.push(1);
    });
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: "assets/Images/forty7.png",
      locale: "auto",
      token: async stripeToken => {
        let products;
        products = [];
        this.cartItems.forEach((d, index) => {
          products.push({
            product: d["_id"],
            quantity: this.quantities[index]
          });
        });

        try {
          let paymentUrl = "http://localhost:4000/api/payment";
          const data = await this.restApiService.post(paymentUrl, {
            totalPrice: this.cartTotal,
            products,
            stripeToken
          });
          data["success"]
            ? (this.data.clearCart(), this.data.success("Purchase Successful"))
            : this.data.error(data["message"]);
        } catch (error) {
          this.data.error(error["message"]);
        }
      }
    });
  }

  trackByCartItems(index: number, item: any) {
    return item._id;
  }

  get cartItems() {
    return this.data.getCart();
  }

  get cartTotal() {
    let total = 0;
    this.cartItems.forEach((data, index) => {
      total += data["price"] * this.quantities[index];
    });

    return total;
  }

  removeProduct(index, product) {
    this.quantities.splice(index, 1);
    this.data.removeFromCart(product);
  }

  validate() {
    if (!this.quantities.every(data => data > 0)) {
      this.data.warning("Quantity cannot be less than one");
    } else if (!localStorage.getItem("token")) {
      this.router.navigate(["/login"]).then(() => {
        this.data.warning("You need to login before making a purchase!");
      });
    } else if (!this.data.user["address"]) {
      this.router.navigate(["/profile/address"]).then(() => {
        this.data.warning("You need ot login before making a purchase!");
      });
    } else {
      this.data.message = "";
      return true;
    }
  }

  checkout() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        this.handler.open({
          name: "Amazon Clone",
          description: "Payment Checkout",
          amount: this.cartTotal * 100,
          closed: () => {
            this.btnDisabled = false;
          }
        });
      } else {
        this.btnDisabled = false;
      }
    } catch (error) {
      this.data.error(error);
    }
  }
}
