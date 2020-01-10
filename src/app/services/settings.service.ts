import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService } from 'ngx-electron';

export interface LanguageModel {
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private developer: boolean = false;
  private languageNameMap: any = {
    en: 'English',
    es: 'Español',
    de: 'Deutsch'
  };

  public get developerMode(): boolean {
    return this.developer;
  }
  public set developerMode(value: boolean) {
    this.developer = value;
  }

  constructor(private electron: ElectronService, private translate: TranslateService) { }

  public getCurrentLanguage(): string {
    return this.translate.currentLang;
  }

  public getAvailableLanguages(): LanguageModel[] {
    return this.translate.getLangs().map((code: string) => this.getLanguageData(code));
  }

  public setLanguage(lang: string): void {
    if (this.translate.getLangs().includes(lang)) {
      this.translate.use(lang);
    }
  }

  // Shitty settings save/load code
  // I'll rewrite this properly when the app settings consist of more than /just one two-character string/.
  public loadSettings(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.electron.isElectronApp) {
        reject('This is not an Electron app!');
      }

      this.electron.ipcRenderer.send('load-settings');
      this.electron.ipcRenderer.once('load-settings-result', (event: any, args: any) => {
        if (args) {
          this.translate.use(args.lang).toPromise().then(() => resolve());
        }
        else {
          reject();
        }
      });
    });
  }

  public saveSettings(): void {
    if (!this.electron.isElectronApp) {
      return;
    }

    const settingsJson: any = {
      lang: this.getCurrentLanguage()
    };
    this.electron.ipcRenderer.send('save-settings', settingsJson);
  }

  private getLanguageData(code: string): LanguageModel {
    return { code: code, name: this.languageNameMap[code] };
  }
}
