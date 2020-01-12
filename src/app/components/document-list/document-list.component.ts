import { Component, Input } from '@angular/core';
import { SourceDocument, SourcePages } from 'src/app/model/SourceDocument';
import { TranslateService } from '@ngx-translate/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DocumentService } from 'src/app/services/document.service';
import { StpRadioOption } from '../radio/radio.component';

@Component({
  selector: 'stp-document-list',
  templateUrl: 'document-list.component.html',
  styleUrls: ['document-list.component.scss']
})
export class DocumentListComponent {
  public pageOptions: StpRadioOption[] = [
    { value: 'ALL', label: this.translate.instant('main_page.source_list.item_menu.include_pages.all') },
    { value: 'RANGE', label: this.translate.instant('main_page.source_list.item_menu.include_pages.range') },
    { value: 'SELECT', label: this.translate.instant('main_page.source_list.item_menu.include_pages.select') }
  ];

  @Input() public sourceDocuments: SourceDocument[];

  constructor(
    private translate: TranslateService,
    private documentService: DocumentService
  ) { }

  // === Display Helper methods ===============================================
  public getDocumentUsedPagesDisplayString(document: SourceDocument): string {
    switch (document.usePages) {
      case SourcePages.ALL:
        return document.pageCount === 1 ?
          this.translate.instant('document_use_pages.single_page') :
          this.translate.instant('document_use_pages.all', { pages: document.pageCount });
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
        return this.translate.instant('document_use_pages.select', {
          pages: document.pageCount,
          selection: document.getUsedPageNumbers()
        });
    }
  }

  public getDocumentPageRange(document: SourceDocument): string {
    return document.useRange ? `${document.useRange.from}-${document.useRange.to}` : null;
  }

  public getDocumentPageSelection(document: SourceDocument): string {
    return document.useSelection ? `${document.useSelection.toString()}` : null;
  }

  // === Action Helper methods ================================================
  public listElementDropped(e: CdkDragDrop<SourceDocument[]>): void {
    moveItemInArray(this.sourceDocuments, e.previousIndex, e.currentIndex);
  }

  public rangeInputChange(document: SourceDocument, value: string): void {
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

  public pagesInputChange(document: SourceDocument, value: string): void {
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

  public showMenu(menu: HTMLElement) {
    menu.classList.add('doclist--list-item-options-menu-container__open');
  }

  public hideMenu(menu: HTMLElement) {
    menu.classList.remove('doclist--list-item-options-menu-container__open');
  }

  public removeDocument(document: SourceDocument): void {
    this.documentService.removeDocument(document);
  }
}
