import { Component } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { version, branch } from '../../../../package.json';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.component.html',
  styleUrls: [ 'settings.component.scss' ]
})
export class SettingsComponent {
  public version: string = version;
  public branch: string = branch;

  constructor(private settings: SettingsService) { }
}
