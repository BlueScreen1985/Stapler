import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from './services/settings.service';
import { DocumentService } from './services/document.service';
import { Router } from '@angular/router';

@Component({
  selector: 'stp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title: string = 'Stapler';
  public dropUploaderStyle: any = { display: 'none' };

  public get working(): boolean {
    return this.document.isWorking;
  }

  constructor(
    private document: DocumentService,
    private settings: SettingsService,
    private translate: TranslateService,
    private change: ChangeDetectorRef,
    private router: Router
  ) {
    translate.addLangs(['en', 'es']);

    translate.setDefaultLang('en');
    translate.use('en');

    settings.loadSettings().then(() => {
      console.log('owo' + translate.currentLang);
      change.detectChanges();
    });
  }

  public ngOnInit() {
    // Show the drop uploader when dragging into the window
    window.addEventListener('dragenter', (e: any) => {
      e.preventDefault();
      this.dropUploaderStyle = {};
    });
  }

  public addFiles(files: File[]) {
    this.dropUploaderStyle = { display: 'none' };
    this.document.addDocuments(files)
    .then(() => this.router.navigate(['/main']));
  }

  public hideUploader() {
    this.dropUploaderStyle = { display: 'none' };
  }
}
