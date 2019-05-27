import { Injectable } from '@angular/core';
import {LoginUser} from './loginuser';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  loginUser: LoginUser;
  email: string;
  password: string;
  passReset1 = false;
  passReset2 = false;
  readonly: boolean;

  constructor() {this.loginUser = new LoginUser(null, null, null, null, null); }

  handleDbError(text: string, textEn: string): void {
    console.log(textEn);
    alert(text);
  }
}
