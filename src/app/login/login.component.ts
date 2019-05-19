import { Component, OnInit } from '@angular/core';
import {FbInvoiceService} from '../fb-invoice.service';
import {SettingsService} from '../settings.service';
import {LoginUser} from '../loginuser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
      public fbInvoiceService: FbInvoiceService,
      public settingsService: SettingsService
  ) {}

  signin(type: number) {
    this.fbInvoiceService.signin$(type, this.settingsService.email, this.settingsService.password)
        .subscribe(value => {
          this.settingsService.loginUser.id = value[0].user.uid;
          this.settingsService.loginUser.providerId = value[0].additionalUserInfo.providerId;
          this.settingsService.passReset2 = (value[0].additionalUserInfo.providerId === 'password');
          if (value[1]) {
            this.settingsService.loginUser.email = value[1].email;
            this.settingsService.loginUser.authorityLevel = value[1].authorityLevel;
            this.settingsService.loginUser.created = value[1].created.toDate();
            this.settingsService.readonly = value[1].authorityLevel <= 1;
          }
        });
    this.settingsService.email = '';
    this.settingsService.password = '';
  }

  logout() {
    this.settingsService.loginUser.id = null;
    this.settingsService.loginUser.email = null;
    this.fbInvoiceService.logout();
  }

  resetPassword() {
    this.fbInvoiceService.resetPassword(this.settingsService.loginUser.email)
        .then(() => this.settingsService.passReset1 = true);
  }

  ngOnInit() {
  }

}
