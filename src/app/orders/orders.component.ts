import { RestApiService } from "./../rest-api.service";
import { DataService } from "./../data.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent implements OnInit {
  orders: any;
  products: any;
  owner: any;
  address: any;
  constructor(
    private dataService: DataService,
    private restApiService: RestApiService
  ) {}

  data = this.dataService;

  async ngOnInit() {
    let ordersUrl = "http://localhost:4000/api/accounts/orders";
    try {
      const data = await this.restApiService.get(ordersUrl);
      data["success"]
        ? (this.orders = data["orders"])
        : this.data.error(data["message"]);
        this.products = this.orders['0'].products;
        this.owner = [this.orders['0'].owner];
        this.address = [this.orders['0'].owner.address];
        console.log("ORDERS", this.orders);
        console.log("ORDERS Products", this.products);
        console.log("ORDERS Owner", this.owner);
        console.log("ORDERS Address", this.address);
    } catch (error) {
      this.dataService.error(error["message"]);
    }
  }
}
