import { Router } from "@angular/router";
import { DataService } from "./../data.service";
import { RestApiService } from "./../rest-api.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  name = "";
  email = "";
  password = "";
  passwordConfirm = "";
  isSeller = false;
  btnDisabled = false;

  constructor(
    private apiService: RestApiService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  validate() {
    if (this.name) {
      if (this.email) {
        if (this.password) {
          if (this.passwordConfirm) {
            if (this.password === this.passwordConfirm) {
              return true;
            } else {
              this.dataService.error("Password does not match");
            }
          } else {
            this.dataService.error("Confirm password not entered");
          }
        } else {
          this.dataService.error("Password not entered");
        }
      } else {
        this.dataService.error("Email not entered");
      }
    } else {
      this.dataService.error("Name not entered");
    }
  }

  async register() {
    this.btnDisabled = true;
    let signUpUrl = "http://localhost:4000/api/accounts/signup";
    try {
      if (this.validate()) {
        const data = await this.apiService.post(signUpUrl, {
          name: this.name,
          email: this.email,
          password: this.password,
          isSeller: this.isSeller
        });
        if (data["success"]) {
          localStorage.setItem("token", JSON.stringify(data["token"]));
          this.dataService.success("Registeration Successful");
        } else {
          this.dataService.error(data["message"]);
        }
      }
    } catch (error) {
      this.dataService.error(error["message"]);
    }
    this.btnDisabled = false;
  }
}
