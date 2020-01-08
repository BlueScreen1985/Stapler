import { Component, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from './services/settings.service';
import { DocumentService } from './services/document.service';

@Component({
  selector: 'stp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title: string = 'Stapler';

  public get working(): boolean {
    return this.document.isWorking;
  }

  constructor(
    private document: DocumentService,
    private settings: SettingsService,
    private translate: TranslateService,
    private change: ChangeDetectorRef
  ) {
    translate.addLangs(['en', 'es']);

    translate.setDefaultLang('en');
    translate.use('en');

    settings.loadSettings().then(() => {
      console.log('owo' + translate.currentLang);
      change.detectChanges();
    });
  }
}
