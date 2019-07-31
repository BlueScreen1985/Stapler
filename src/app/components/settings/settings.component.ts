import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { version, branch } from '../../../../package.json';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.component.html',
  styleUrls: [ 'settings.component.scss' ]
})
export class SettingsComponent implements OnInit {
  public version: string = version;
  public branch: string = branch;

  public languages: { name: string, isoCode: string }[];

  constructor(private settings: SettingsService) { }

  public ngOnInit(): void {
    this.languages = this.settings.getAvailableLanguages().map((lang: string) => ({ name: this.getFullLanguageName(lang), isoCode: lang }));
  }

  public languageChanged(event: MatSelectChange) {
    this.settings.setLanguage(event.value);
  }

  private getFullLanguageName(lang: string): string {
    switch (lang) {
      case 'en':
        return 'English';
      case 'es':
        return 'Español';
      case 'de':
        return 'Deutsch';
    }
  }
}
