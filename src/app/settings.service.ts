import { Injectable } from '@angular/core';
import {LoginUser} from './loginuser';
import {Setting} from './setting';
import {FbInvoiceService} from './fb-invoice.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  loginUser: LoginUser;
  setting: Setting;
  settingId: string;
  email: string;
  password: string;
  passReset1 = false;
  passReset2 = false;
  readonly: boolean;
  logoUrl: string;

  constructor( private fbInvoiceService: FbInvoiceService) {
    this.loginUser = new LoginUser(null, null, null, null, null);
    this.setting = new Setting();
  }

  handleDbError(text: string, textEn: string): void {
    console.log(textEn);
    alert(text);
  }

  getDownloadUrl(id: string): void {
    this.fbInvoiceService.getDownloadUrl(id).subscribe(
        r => {
          this.logoUrl = r;
          console.log('============', this.logoUrl);
        }
        , () => {
          this.handleDbError('Speicherfehler', 'Error during downloading a file');
        }
    );
  }
}
