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
  public useRange?: string;
  public useSelection?: string;

  public get range(): PageRange | null {
    // Return null if range is not enabled or unset
    if (this.usePages !== SourcePages.RANGE || !this.useRange) {
      return null;
    }

    // Parse string to actual page range
    const regex: RegExp = /^\s*(\d+)\s*-\s*(\d+)\s*$/g;
    const match: RegExpExecArray = regex.exec(this.useRange);
    if (!match || match.length < 3) {
      return null;
    } else {
      const from: number = parseInt(match[1], 10);
      const to: number = parseInt(match[2], 10);

      if (!isNaN(from) && !isNaN(to) && from > 0 && from <= to && to <= this.pageCount) {
        return { from: from, to: to };
      } else {
        return null;
      }
    }
  }

  public get selection(): number[] | null {
    // Return null if selection is not enabled or unset
    if (this.usePages !== SourcePages.SELECT || !this.useSelection) {
      return null;
    }

    // Make sure string is a valid format
    const regex: RegExp = /^\s*((\d+),?\s*)+$/g;
    if (!regex.test(this.useSelection)) {
      return null;
    }

    // If it's valid parse, make sure all numbers are fine
    const selection: number[] = this.useSelection.replace(' ', '').split(',').map((s: string) => parseInt(s, 10));
    const valid: boolean = selection.length > 0 && selection.some((page: number) => isNaN(page) || page <= 0 || page > this.pageCount);
    return valid ? null : selection;
  }

  private document: PDFDocument;

  constructor(filename: string, pdfDocument: PDFDocument) {
    this.filename = filename;
    this.pageCount = pdfDocument.getPages().length; // getPageCount returns undefined for some reason (pdf-lib bug?)
    this.usePages = SourcePages.ALL;

    this.document = pdfDocument;
  }

  public getPageSelectionValid(): boolean {
    switch (this.usePages) {
      case SourcePages.ALL:
        return true;
      case SourcePages.RANGE:
        return this.range !== null;
      case SourcePages.SELECT:
        return this.selection !== null;
    }
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
        if (!this.range) {
          return [];
        }
        for (let i = this.range.from; i <= this.range.to; i++) {
          pages.push(i);
        }
        return pages;
      case SourcePages.SELECT:
        if (!this.selection) {
          return [];
        }
        return this.selection;
    }
  }

  public getUsedPageIndices(): number[] {
    return this.getUsedPageNumbers().map((n: number) => n - 1);
  }

  public getDocument(): PDFDocument {
    return this.document;
  }
}
