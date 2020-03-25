import { RestApiService } from "./../rest-api.service";
import { DataService } from "./../data.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-post-product",
  templateUrl: "./post-product.component.html",
  styleUrls: ["./post-product.component.scss"]
})
export class PostProductComponent implements OnInit {
  product = {
    title: "",
    price: 0,
    categoryId: "",
    description: "",
    product_picture: null
  };

  categories: any;
  btnDisabled = false;

  constructor(
    private router: Router,
    private dataService: DataService,
    private apiService: RestApiService
  ) {}

  data = this.dataService;

  async ngOnInit() {
    let categoriesUrl = "http://localhost:4000/api/categories";
    try {
      const data = await this.apiService.get(categoriesUrl);
      data["success"]
        ? (this.categories = data["categories"])
        : this.data.error(data["message"]);
    } catch (error) {
      this.data.error(error["message"]);
    }
  }

  validate(product) {
    if (product.title) {
      if (product.price) {
        if (product.categoryId) {
          if (product.description) {
            if (product.product_picture) {
              return true;
            } else {
              this.dataService.error("Please select product image");
            }
          } else {
            this.dataService.error("Please enter a product description");
          }
        } else {
          this.dataService.error("Please select a category");
        }
      } else {
        this.dataService.error("Please enter the price");
      }
    } else {
      this.dataService.error("Please enter the title");
    }
  }

  fileChange(event) {
    this.product.product_picture = event.target.files[0];
  }

  async postProduct() {
    this.btnDisabled = true;
    try {
      if (this.validate(this.product)) {
        const form = new FormData();
        for (const key in this.product) {
          if (this.product.hasOwnProperty(key)) {
            if (key === "product_picture") {
              form.append(
                "product_picture",
                this.product.product_picture,
                this.product.product_picture.name
              );
            } else {
              form.append(key, this.product[key]);
            }
          }
        }
        let postProductUrl = "http://localhost:4000/api/seller/products";
        const data = await this.apiService.post(postProductUrl, form);
        data["success"]
          ? this.router
              .navigate(["/profile/myproducts"])
              .then(() => this.data.success(data["message"]))
              .catch(() => this.data.error(data["message"]))
          : this.data.error(data["message"]);
      }
    } catch (error) {
      this.data.error(error["message"]);
    }
    this.btnDisabled = false;
  }
}
