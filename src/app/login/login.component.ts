import { Component, OnInit } from '@angular/core';
import {FbInvoiceService} from '../fb-invoice.service';
import {LoginUser} from '../loginuser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  loginUser: LoginUser;
  passReset1 = false;
  passReset2 = false;
  passResetEmail: string;


  constructor(
      public fbInvoiceService: FbInvoiceService
  ) {
    this.loginUser = new LoginUser();
  }

  signin(type: number) {
    this.fbInvoiceService.signin$(type, this.email, this.password)
        .subscribe(value => {
          this.loginUser.id = value[0].user.uid;
          this.loginUser.providerId = value[0].additionalUserInfo.providerId;
          this.passReset2 = (value[0].additionalUserInfo.providerId === 'password');
          if (value[1]) {
            this.loginUser.email = value[1].email;
            this.loginUser.authorityLevel = value[1].authorityLevel;
            this.loginUser.created = value[1].created.toDate();
          }
        });
    this.email = '';
    this.password = '';
  }

  logout() {
    this.loginUser.id = null;
    this.loginUser.email = null;
    this.fbInvoiceService.logout();
  }

  resetPassword() {
    this.fbInvoiceService.resetPassword(this.loginUser.email)
        .then(() => this.passReset1 = true);
  }

  ngOnInit() {
  }

}
