import { DataService } from "./../data.service";
import { RestApiService } from "./../rest-api.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-address",
  templateUrl: "./address.component.html",
  styleUrls: ["./address.component.scss"]
})
export class AddressComponent implements OnInit {

  btnDisabled = false;
  currentAddress: any;

  constructor(
    private dataService: DataService,
    private apiService: RestApiService
  ) {}

  data = this.dataService;

  async ngOnInit(){
    let addressUrl = 'https://localhost:4000/api/accounts/address';
    try {
      const data = await this.apiService.get( addressUrl );
      if( JSON.stringify(data['address'] === '{}' && this.data.message === '')){
        this.data.warning('Please enter the shipping address');
      }
      this.currentAddress = data['address'];
    } catch (error){
      this.data.error(error['message']);
    }
  }

  async updateAddress() {
    this.btnDisabled = true;
    let addressUrl = 'https://localhost:4000/api/accounts/address';
    try{
      const data = await this.apiService.post(
        addressUrl,
        this.currentAddress
      );
      data['success'] ? (this.data.success(data['message']), await this.data.getProfile()) : (this.data.error(data['message']));
    } catch (error){
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }
}
