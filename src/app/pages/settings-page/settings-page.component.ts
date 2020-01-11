import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { SettingsService, LanguageModel } from 'src/app/services/settings.service';
import { ThemeService, ThemeModel } from 'src/app/services/theme.service';
import { version, branch } from 'package.json';
import { StpSelectOption, SelectComponent } from 'src/app/components/select/select.component.js';

@Component({
  selector: 'stp-settings-page',
  templateUrl: 'settings-page.component.html',
  styleUrls: ['settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
  public version: string = version;
  public branch: string = branch;
  private languages: LanguageModel[];

  public get currentLanguage(): string {
    return this.settings.getCurrentLanguage();
  }
  public set currentLanguage(value: string) {
    this.settings.setLanguage(value);
  }

  public get languageOptions(): StpSelectOption[] {
    return this.languages.map((lang: LanguageModel) => ({ displayName: lang.name, value: lang.code }));
  }

  public get currentTheme(): string {
    return this.theme.currentTheme;
  }
  public set currentTheme(value: string) {
    this.theme.currentTheme = value;
  }

  public get themeOptions(): StpSelectOption[] {
    return this.theme.availableThemes.map((theme: ThemeModel) => ({ displayName: theme.displayName, value: theme.name }));
  }

  public get developerMode(): boolean {
    return this.settings.developerMode;
  }
  public set developerMode(value: boolean) {
    this.settings.developerMode = value;
  }

  @ViewChild('languageSelect', { static: true }) private languageSelect: SelectComponent;

  constructor(
    private settings: SettingsService,
    private theme: ThemeService,
    private location: Location
  ) { }

  public ngOnInit(): void {
    this.languages = this.settings.getAvailableLanguages();
  }

  public saveSettings() {
    this.settings.saveSettings();
    this.location.back();
  }
}
