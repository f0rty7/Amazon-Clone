import { RestApiService } from './../rest-api.service';
import { DataService } from './../data.service';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent implements OnInit {

  orders: any;
  constructor(
    private dataService: DataService,
    private restApiService: RestApiService
  ) {}

  data = this.dataService;

  async ngOnInit() {}
}
