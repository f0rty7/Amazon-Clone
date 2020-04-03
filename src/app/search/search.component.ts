import { RestApiService } from './../rest-api.service';
import { DataService } from './../data.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {

  query: string;
  page: number = 1;
  content: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private restApiService: RestApiService
  ) {}

  data = this.dataService;

  ngOnInit() {
    this.activatedRoute.params.subscribe( result => {
      this.query = result['query'];
      this.page = 1;
      this.getProducts();
    })
  }

  // get lower() {
  //   return 1 + this.content.hitsPerPage * this.content.page;
  // }

  // get upper() {
  //   return Math.min(
  //     this.content.hitsPerPage * ( this.content.page * 1),
  //     this.content.nbHits
  //   );
  // }

  async getProducts() {
    this.content = null;
    let searchUrl = `http://localhost:4000/api/search?searchProduct=${this.query}&page=${this.page - 1}`;
    try {
      const data = await this.restApiService.get(searchUrl);
      console.log("SEARCH DATA", data);
      data['success']
      // ? ( this.content = data['product'])
      ? ( this.content = data)
      : ( this.data.error(data['error']));
    } catch (error) {
      this.data.error(error["message"]);
    }
  }
}
