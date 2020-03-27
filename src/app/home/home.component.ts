import { RestApiService } from "./../rest-api.service";
import { DataService } from "./../data.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  products: any;

  constructor(
    private dataService: DataService,
    private apiService: RestApiService
  ) {}

  data = this.dataService;

  async ngOnInit() {
    let productsUrl = "http://localhost:4000/api/products";
    try {
      const data = await this.apiService.get(productsUrl);
      data["success"]
        ? (this.products = data["products"])
        : this.data.error("Could not fetch products");
    } catch (error) {
      this.data.error(error["message"]);
    }
  }
}
