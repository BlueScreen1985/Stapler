import { Component, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/services/document.service';
import { SourceDocument } from 'src/app/model/SourceDocument';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'stp-main-page',
  templateUrl: 'main-page.component.html',
  styleUrls: ['main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  public get documents(): SourceDocument[] {
    return this.documentService.sources;
  }

  public get filename(): string {
    return this.documentService.fileName;
  }
  public set filename(value: string) {
    this.documentService.fileName = value;
  }

  constructor(
    private documentService: DocumentService,
    private translate: TranslateService
  ) { }

  public ngOnInit(): void {
    this.filename = this.translate.instant('main_page.filename.default');
  }

  public save() {
    this.documentService.composeAndSave();
  }
}
