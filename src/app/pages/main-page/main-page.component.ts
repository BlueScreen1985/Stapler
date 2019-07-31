import { Component } from '@angular/core';
import { SourceDocument, SourcePages } from 'src/app/model/SourceDocument';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PdfService } from 'src/app/services/pdf.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main-page',
  templateUrl: 'main-page.component.html',
  styleUrls: ['main-page.component.scss']
})
export class MainPageComponent {
  public sourceDocuments: SourceDocument[];
  public filename: string;
  public working: boolean = false;

  constructor(private pdfService: PdfService, private snackBar: MatSnackBar, private translate: TranslateService) {}

  public addDocuments(): void {
    this.working = true;
    this.pdfService.openDocuments().then((documents: SourceDocument[]) => {
      if (!this.sourceDocuments) {
        this.newProject();
      }

      this.sourceDocuments = this.sourceDocuments.concat(documents);
      this.working = false;
    }).catch(err => {
      console.log(JSON.stringify(err));
      if (err.isError) {
        this.showSnackBar(this.translate.instant('message.error_generic'));
      }
      this.working = false;
    });
  }

  public composeAndSave(): void {
    this.working = true;
    this.pdfService.composeAndSave(this.sourceDocuments, this.filename)
    .then(() => {
      this.showSnackBar(this.translate.instant('message.saved_file'));
      this.working = false;
    })
    .catch(err => {
      console.log(JSON.stringify(err));
      if (err.isError) {
        this.showSnackBar(this.translate.instant('message.error_generic'));
      }
      this.working = false;
    });
  }

  public removeDocument(document: SourceDocument): void {
    this.sourceDocuments = this.sourceDocuments.filter((doc: SourceDocument) => doc != document);
  }

  public newProject() {
    this.sourceDocuments = [];
  }

  public getDocumentUsedPagesDisplayString(document: SourceDocument): string {
    switch (document.usePages) {
      case SourcePages.ALL:
        return this.translate.instant('document_use_pages.all', { pages: document.pageCount });
      case SourcePages.RANGE:
        if (!document.useRange) {
          return this.translate.instant('document_use_pages.invalid_range');
        }
        return this.translate.instant('document_use_pages.range', {
          pages: document.pageCount,
          from: document.useRange.from,
          to: document.useRange.to
        });
      case SourcePages.SELECT:
        if (!document.useSelection || document.useSelection.length == 0) {
          return this.translate.instant('document_use_pages.invalid_selection');
        }
        return this.translate.instant('document_use_pages.range', {
          pages: document.pageCount,
          selection: document.getUsedPageNumbers()
        });
    }
  }

  public getDocumentPageRange(document: SourceDocument): string {
    return document.useRange ? `${document.useRange.from}-${document.useRange.to}` : null;
  }

  public rangeInputChange(document: SourceDocument, value: string) {
    const rangeMatcher: RegExp = new RegExp(/^(\d+)-(\d+)$/);
    const results: RegExpMatchArray = rangeMatcher.exec(value);

    if (results) {
      const from: number = parseInt(results[1], 10);
      const to: number = parseInt(results[2], 10);

      if (from > 0 && from <= to && to <= document.pageCount) {
        document.useRange = { from: from, to: to };
      }
    }
  }

  public getDocumentPageSelection(document: SourceDocument): string {
    return document.useSelection ? `${document.useSelection.toString()}` : null;
  }

  public pagesInputChange(document: SourceDocument, value: string) {
    const selectionMatcher: RegExp = new RegExp(/^(\d+, ?)*\d+$/);
    const results: RegExpMatchArray = selectionMatcher.exec(value);

    if (results) {
      // First, extract all the numbers from the input and cast to number
      const selection: number[] = results[0].replace(' ', '').split(',').map((s: string) => parseInt(s, 10));

      let numbersAreValid: boolean = true;
      selection.forEach((page: number) => {
        if (page <= 0 || page > document.pageCount) {
          numbersAreValid = false;
        }
      });

      if (numbersAreValid) {
        document.useSelection = selection;
      }
    }
  }

  public drop(event: CdkDragDrop<SourceDocument[]>) {
    moveItemInArray(this.sourceDocuments, event.previousIndex, event.currentIndex);
  }

  public showSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }
}
