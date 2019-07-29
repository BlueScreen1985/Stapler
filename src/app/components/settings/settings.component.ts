import { Component } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.component.html',
  styleUrls: [ 'settings.component.scss' ]
})
export class SettingsComponent {

  constructor(private settings: SettingsService) { }

  public get developerMode() {
    return this.settings.developerMode;
  }

  public set developerMode(value: boolean) {
    this.settings.developerMode = value;
  }
}
