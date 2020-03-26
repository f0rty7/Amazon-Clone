import { DataService } from "./../data.service";
import { RestApiService } from "./../rest-api.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-my-products",
  templateUrl: "./my-products.component.html",
  styleUrls: ["./my-products.component.scss"]
})
export class MyProductsComponent implements OnInit {
  products: any;

  constructor(
    private apiService: RestApiService,
    private dataService: DataService
  ) {}

  data = this.dataService;

  async ngOnInit() {
    let productsUrl = "http://localhost:4000/api/seller/products";
    try {
      const data = await this.apiService.get(productsUrl);
      console.log("Products", data);
      data["message"]
        ? (this.products = data["products"])
        : this.data.error(data["message"]);
    } catch (error) {
      this.dataService.error(error["message"]);
    }
  }
}
