import { Component, OnInit } from '@angular/core';
import { SettingsService, LanguageModel } from 'src/app/services/settings.service';
import { version, branch } from '../../../../package.json';
import { MatSelectChange } from '@angular/material/select';
import { Location } from '@angular/common';

@Component({
  selector: 'stp-settings-page',
  templateUrl: 'settings-page.component.html',
  styleUrls: ['settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
  public version: string = version;
  public branch: string = branch;
  public languages: LanguageModel[];

  public get currentLanguage(): string {
    return this.settings.getCurrentLanguage();
  }

  public get developerMode(): boolean {
    return this.settings.developerMode;
  }
  public set developerMode(value: boolean) {
    this.settings.developerMode = value;
  }

  constructor(
    private settings: SettingsService,
    private location: Location
  ) { }

  public ngOnInit(): void {
    this.languages = this.settings.getAvailableLanguages();
  }

  public languageChanged(event: MatSelectChange) {
    this.settings.setLanguage(event.value);
  }

  public saveSettings() {
    this.settings.saveSettings();
    this.location.back();
  }
}
