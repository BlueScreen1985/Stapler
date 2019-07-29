import { PDFDocument, PDFPage } from 'pdf-lib';

export enum SourcePages {
  ALL = 'ALL',
  RANGE = 'RANGE',
  SELECT = 'SELECT'
}

export class PageRange {
  public from: number;
  public to: number;
}

export class SourceDocument {
  public filename: string;
  public pageCount: number;

  public usePages: SourcePages = SourcePages.ALL;
  public useRange?: PageRange;
  public useSelection?: number[];

  private document: PDFDocument;

  constructor(filename: string, pdfDocument: PDFDocument) {
    this.filename = filename;
    this.pageCount = pdfDocument.getPages().length; // getPageCount returns undefined for some reason (pdf-lib bug?)
    this.usePages = SourcePages.ALL;

    this.document = pdfDocument;
  }

  // Return an array with the page numbers to use
  public getUsedPageNumbers(): number[] {
    const pages: number[] = [];

    switch (this.usePages) {
      case SourcePages.ALL:
        for (let i = 1; i <= this.pageCount; i++) {
          pages.push(i);
        }
        return pages;
      case SourcePages.RANGE:
        if (!this.useRange || this.useRange.to < this.useRange.from || this.useRange.to > this.pageCount) {
          return [];
        }
        for (let i = this.useRange.from; i <= this.useRange.to; i++) {
          pages.push(i);
        }
        return pages;
      case SourcePages.SELECT:
        if (!this.useRange) {
          return [];
        }
        return this.useSelection;
    }
  }

  public getUsedPageIndices(): number[] {
    return this.getUsedPageNumbers().map((n: number) => n - 1);
  }

  public getDocument(): PDFDocument {
    return this.document;
  }
}
