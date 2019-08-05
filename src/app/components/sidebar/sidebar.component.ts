import { Component, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ElectronService } from 'ngx-electron';
import { SettingsComponent } from '../settings/settings.component';
import { SettingsService } from 'src/app/services/settings.service';
import { version, branch } from '../../../../package.json';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: [ 'sidebar.component.scss' ]
})
export class SidebarComponent {
  @Output() public addFiles: EventEmitter<any> = new EventEmitter();
  @Output() public new: EventEmitter<any> = new EventEmitter();
  @Output() public save: EventEmitter<any> = new EventEmitter();

  public version: string = version;
  public branch: string = branch;

  constructor(private dialog: MatDialog, private electron: ElectronService, private settings: SettingsService) {}

  public devModeEnabled(): boolean {
    return this.settings.developerMode;
  }

  public openSettings(): void {
    this.dialog.open(SettingsComponent, {
      minWidth: 300,
      disableClose: true
    });
  }

  public toggleDevTools(): void {
    if (!this.electron.isElectronApp) {
      console.log('This is not an electron app! Press F12 to open dev tools. (you\'re already here, so you probably don\'t need that information...)');
      return;
    }
    this.electron.ipcRenderer.send('toggle-devtools');
  }
}
