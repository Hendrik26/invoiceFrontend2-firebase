import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FbInvoiceService} from '../fb-invoice.service';
import {SettingsService} from '../settings.service';
import {} from '../setting';

@Component({
    selector: 'app-settings-detail',
    templateUrl: './settings-detail.component.html',
    styleUrls: ['./settings-detail.component.css']
})
export class SettingsDetailComponent implements OnInit {

    public enableSaveButton = true;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        // private location: Location,
        private fbInvoiceService: FbInvoiceService,
        public settingsService: SettingsService) {
    }

    ngOnInit() {
        this.getDownloadUrl(this.settingsService.setting.logoId);
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
        this.enableSaveButton = false;
        this.fbInvoiceService.uploadLogo(event).subscribe(
            r => {
                if (r.state === 'success') {
                    this.settingsService.setting.logoId = r.metadata.name;
                    this.getDownloadUrl(this.settingsService.setting.logoId);
                    this.enableSaveButton = true;
                }
            }
            , () => {
                this.settingsService.handleDbError('Speicherfehler', 'Error during uploading a file');
            }
        );
    }

    private getDownloadUrl(id: string): void {
        if (!id) {
            return;
        }
        if (id.length === 0) {
            return;
        }
        this.fbInvoiceService.getDownloadUrl(id).subscribe(
            r => {
                this.settingsService.logoUrl = r;
            }
            , () => {
                this.settingsService.handleDbError('Speicherfehler', 'Error during downloading a file');
            }
        );
    }

}
