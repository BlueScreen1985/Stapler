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
        if (!document.range) {
          return this.translate.instant('document_use_pages.invalid_range');
        }
        return this.translate.instant('document_use_pages.range', {
          pages: document.pageCount,
          from: document.range.from,
          to: document.range.to
        });
      case SourcePages.SELECT:
        if (!document.selection) {
          return this.translate.instant('document_use_pages.invalid_selection');
        }
        return this.translate.instant('document_use_pages.select', {
          pages: document.pageCount,
          selection: document.getUsedPageNumbers()
        });
    }
  }

  // === Action Helper methods ================================================
  public listElementDropped(e: CdkDragDrop<SourceDocument[]>): void {
    moveItemInArray(this.sourceDocuments, e.previousIndex, e.currentIndex);
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
