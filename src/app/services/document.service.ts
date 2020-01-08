import { Injectable } from '@angular/core';
import { SourceDocument } from '../model/SourceDocument';
import { PdfService } from './pdf.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private sourceDocuments: SourceDocument[];
  private filename: string = '';
  private working: boolean = false;

  public get sources(): SourceDocument[] {
    return this.sourceDocuments;
  }

  public get fileName(): string {
    return this.filename;
  }
  public set fileName(value: string) {
    this.filename = value;
  }

  public get isWorking(): boolean {
    return this.working;
  }

  constructor(private pdfService: PdfService) { }

  // === Working methods ======================================================
  public newProject(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sourceDocuments = [];
      resolve();
    });
  }

  public addDocuments(files?: File[]): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.working = true;
      let documents: SourceDocument[];

      try {
        files && files.length > 0 ?
          documents = await this.pdfService.addDocuments(files) :
          documents = await this.pdfService.openDocuments();

        if (!this.sourceDocuments) {
          this.newProject();
        }

        this.sourceDocuments = this.sourceDocuments.concat(documents);
        this.working = false;
        resolve();
      } catch (err) {
        console.log(err);
        this.working = false;
      }
    });
  }

  public removeDocument(document: SourceDocument): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sourceDocuments = this.sourceDocuments.filter((doc: SourceDocument) => doc != document);
      resolve();
    });
  }

  public composeAndSave(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.working = true;
      this.pdfService.composeAndSave(this.sourceDocuments, this.filename)
        .then(() => {
          resolve();
        })
        .catch(err => {
          console.log(JSON.stringify(err));
          if (err.isError) {
            reject(err);
          }
        }).finally(() => this.working = false);
    });
  }
}
