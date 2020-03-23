import { DataService } from "./../data.service";
import { RestApiService } from "./../rest-api.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"]
})
export class CategoriesComponent implements OnInit {
  categories: any;
  newCategory = "";
  btnDisabled = false;

  constructor(
    private dataService: DataService,
    private apiService: RestApiService
  ) {}

  data = this.dataService;

  async ngOnInit() {
    let categoriesUrl = "http://localhost:4000/api/categories";
    try {
      const data = await this.apiService.get(categoriesUrl);
      console.log("CATEGORIES", data);
      data["success"]
        ? (this.categories = data["categories"])
        : this.data.error(data["message"]);
    } catch (error) {
      this.data.error(error["message"]);
    }
  }

  async addCategory() {
    this.btnDisabled = true;
    let categoriesUrl = "http://localhost:4000/api/categories";
    try {
      const data = await this.apiService.post(categoriesUrl, {
        category: this.newCategory
      });
      data["success"]
        ? this.data.success(data["message"])
        : this.data.error(data["message"]);
    } catch (error) {
      this.data.error(error["message"]);
    }
    this.btnDisabled = false;
  }
}
