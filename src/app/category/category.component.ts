import { RestApiService } from './../rest-api.service';
import { DataService } from './../data.service';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"]
})
export class CategoryComponent implements OnInit {

  categoryId: any;
  category: any;
  page = 1;

  constructor(
    private dataService: DataService,
    private restApiService: RestApiService,
    private activatedRoute: ActivatedRoute
  ) {}

  data = this.dataService;

  ngOnInit() {
    this.activatedRoute.params.subscribe( result =>{
      this.categoryId = result['id'];
      this.getProducts();
    });
  }

  get upper() {
    return Math.min( 10 * this.page, this.category.totalProducts);
  }

  get lower() {
    return 10 * (this.page - 1) + 1;
  }

  async getProducts(event ?: any) {
    if(event) {
      this.category = null;
    }
    try {
      const data = await this.restApiService.get(
        `http://localhost:4000/api/categories/${this.categoryId}?page=${this.page - 1}`
      );
      data['success']
      ? (this.category = data)
      : ( this.data.error(data["message"]));
    } catch (error) {
      this.data.error(error["message"]);
    }
  }
}
