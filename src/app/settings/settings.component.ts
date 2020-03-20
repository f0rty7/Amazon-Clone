import { DataService } from "./../data.service";
import { RestApiService } from "./../rest-api.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  btnDisabled = false;
  currentSettings: any;

  constructor(
    private dataService: DataService,
    private apiService: RestApiService
  ) {}

  data = this.dataService;

  async ngOnInit() {
    try {
      if (!this.data.user) {
        await this.data.getProfile();
      }
      this.currentSettings = Object.assign(
        {
          newPwd: "",
          pwdConfirm: ""
        },
        this.data.user
      );
    } catch (error) {
      this.data.error(error);
    }
  }

  validate(settings) {
    if (settings["name"]) {
      if (settings["email"]) {
        if (settings["newPwd"]) {
          if (settings["pwdConfirm"]) {
            if (settings["newPwd"] === settings["pwdConfirm"]) {
              return true;
            } else {
              this.data.error("Password does not match");
            }
          } else {
            this.data.error("Please enter confirm password");
          }
        } else {
          if (!settings["pwdConfirm"]) {
            return true;
          } else {
            this.data.error("Please enter your new password");
          }
        }
      } else {
        this.data.error("Please enter your email");
      }
    } else {
      this.data.error("Please enter your name");
    }
  }

  async update() {
    this.btnDisabled = true;
    let profileUrl = "http://localhost:4000/api/accounts/profile";
    try {
      if (this.validate(this.currentSettings)) {
        const data = await this.apiService.post(profileUrl, {
          name: this.currentSettings["name"],
          email: this.currentSettings["email"],
          newPwd: this.currentSettings["newPwd"],
          isSeller: this.currentSettings["isSeller"]
        });
        data["success"]
          ? (this.data.getProfile(), this.data.success(data["message"]))
          : this.data.error(data["message"]);
      }
    } catch (error) {
      this.data.error(error["message"]);
    }
    this.btnDisabled = false;
  }
}
