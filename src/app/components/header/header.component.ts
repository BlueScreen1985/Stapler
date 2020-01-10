import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/services/document.service';
import { SettingsService } from 'src/app/services/settings.service';
import { ElectronService } from 'ngx-electron';
import { version, branch } from 'package.json';

@Component({
  selector: 'stp-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeaderComponent {

  public get route(): string {
    return this.router.url;
  }

  public get developerMode(): boolean {
    return this.settings.developerMode;
  }

  public get versionText(): string {
    return `Stapler ${version} ${branch}`;
  }

  constructor(
    private router: Router,
    private documentService: DocumentService,
    private settings: SettingsService,
    private electron: ElectronService
  ) { }

  public newFile(): void {
    this.documentService.newProject()
    .then(() => this.router.navigate(['/main']));
  }

  public addFiles(): void {
    this.documentService.addDocuments()
    .then(() => this.router.navigate(['/main']));
  }

  public save(): void {
    this.documentService.composeAndSave()
    .then(() => { /* Do something */ });
  }

  public openSettings() {
    this.router.navigate(['/settings']);
  }

  public openDevTools() {
    if (!this.electron.isElectronApp) {
      console.log('This is not an electron app! Press F12 to open dev tools. (you\'re already here, so you probably don\'t need that information...)');
      return;
    }
    this.electron.ipcRenderer.send('toggle-devtools');
  }
}
