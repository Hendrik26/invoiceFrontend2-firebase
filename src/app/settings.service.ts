import { Injectable } from '@angular/core';
import {LoginUser} from './loginuser';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  email: string;
  password: string;
  loginUser: LoginUser;
  passReset1 = false;
  passReset2 = false;

  constructor() {this.loginUser = new LoginUser(); }
}
