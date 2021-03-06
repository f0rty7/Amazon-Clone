import { Router } from "@angular/router";
import { DataService } from "./data.service";
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  searchTerm = "";
  isCollapsed = true;

  constructor(private router: Router, private dataService: DataService) {
    this.dataService.getProfile();
    this.dataService.cartItems = this.dataService.getCart().length;
  }

  data = this.dataService;

  get token() {
    return localStorage.getItem("token");
  }

  collapse() {
    this.isCollapsed = true;
  }

  closeDropdown(dropdown) {
    dropdown.close();
  }

  logout() {
    this.dataService.user = {};
    this.dataService.cartItems = 0;
    localStorage.clear();
    this.router.navigate(["/"]);
  }

  search() {
    console.log("Search button clicked");
    if (this.searchTerm) {
      this.collapse();
      this.router.navigate(["search", { query: this.searchTerm }]);
    }
  }
}
