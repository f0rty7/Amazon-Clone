import { RestApiService } from "./../rest-api.service";
import { DataService } from "./../data.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"]
})
export class ProductComponent implements OnInit {
  product: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private apiService: RestApiService
  ) {}

  data = this.dataService;

  ngOnInit() {
    this.activatedRoute.params.subscribe(result => {
      const productUrl = `http://localhost:4000/api/product/${result["id"]}` ;
      this.apiService
        .get(productUrl)
        .then(data => {
          data["success"]
            ? (this.product = data["product"])
            : this.router.navigate["/"];
        })
        .catch(error => this.data.error(error["message"]));
    });
  }
}
