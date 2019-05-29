import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {FbInvoiceService} from '../fb-invoice.service';
import {SettingsService} from '../settings.service';
import {} from '../setting';

@Component({
    selector: 'app-settings-detail',
    templateUrl: './settings-detail.component.html',
    styleUrls: ['./settings-detail.component.css']
})
export class SettingsDetailComponent implements OnInit {

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        // private location: Location,
        private fbInvoiceService: FbInvoiceService,
        public settingsService: SettingsService) {
    }

    ngOnInit() {
    }

    saveSetting(): void {
        this.fbInvoiceService.saveSetting(this.settingsService.setting.exportSettingData()).subscribe(
            r => {
                console.log('new id:', r.id);
                this.settingsService.settingId = r.id;
            }
            , () => {
                this.settingsService.handleDbError('Datenbankfehler', 'Error during creation of a setting document');
            }
        );
        this.router.navigateByUrl('/login');
    }

    uploadLogo(event): void {
        console.log('EVENT:', event);
        this.fbInvoiceService.uploadLogo(event).subscribe(
            r => {
                console.log('UUUUUUUUU:', r.state, r.metadata.name);
                if (r.state === 'success') {
                    console.log('üüüüüüüüüüüüüüüüüüü');
                    this.settingsService.setting.logoId = r.metadata.name;
                }
            }
            , () => {
                this.settingsService.handleDbError('Speicherfehler', 'Error during uploading a file');
            }
        );
    }

}
