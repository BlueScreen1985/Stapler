import { Component, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title: string = 'Stapler';

  constructor(private settings: SettingsService, private translate: TranslateService, private change: ChangeDetectorRef) {

    translate.addLangs(['en', 'es']);

    translate.setDefaultLang('en');
    translate.use('en');

    settings.loadSettings().then(() => {
      console.log('owo' + translate.currentLang);
      change.detectChanges();
    });
  }
}
