import { Injectable } from '@angular/core';
import { PDFDocument, PDFPage } from 'pdf-lib';
import { SourceDocument } from '../model/SourceDocument';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private electron: ElectronService) { }

  /**
   * Opens a native open file dialog prompting to load one or more PDF documents
   *
   * @returns A promise containing an array of SourceDocument objects with the loaded
   * files, resolved once the dialog is closed and all files are loaded
   */
  public openDocuments(): Promise<SourceDocument[]> {
    return new Promise((resolve, reject) => {
      if (!this.electron.isElectronApp) {
        reject({
          isError: true,
          error: 'This is not an electron app!'
        });
      }

      // Tell Electron's main process to open a native open file dialog, and listen for its reply containing the files read
      this.electron.ipcRenderer.send('open-files');
      this.electron.ipcRenderer.once('file-open-result', (event: any, args: any) => {
        if (args.status == 'success') {
          // Type the response for easy access
          const files: { path: string, data: Buffer }[] = (args.payload as { path: string, data: Buffer }[]);

          if (files && files.length > 0) {
            // Load all PDF files and wait until all are done
            Promise.all(
              files.map(file => PDFDocument.load(file.data, { ignoreEncryption: true }))
            ).then((documents: PDFDocument[]) => {
              const sourceDocuments: SourceDocument[] = documents.map((document: PDFDocument) => new SourceDocument('', document));

              // Good ol' iterator to add the filenames (this was almost a beautiful pure map function, *almost*)
              for (let i = 0; i < sourceDocuments.length; i++) {
                const filePath: string[] = files[i].path.split(new RegExp(/[\\/]/));
                sourceDocuments[i].filename = filePath[filePath.length - 1];
              }

              resolve(sourceDocuments);
            }).catch(err => reject({
              isError: true,
              error: err
            }));
          }
          else {
            reject({
              isError: true,
              error: 'Read 0 files. Dialog may have been canceled, or something went wrong.'
            });
          }
        }
        else if (args.status == 'canceled') {
          reject({
            isError: false,
            reason: 'User canceled the dialog. No files were read.'
          });
        }
        else if (args.status == 'error') {
          reject({
            isError: true,
            error: args.err
          });
        }
      });
    });
  }

  /**
   * Loads PDF documents from a list fo files
   *
   * @returns A promise containing an array of SourceDocument objects with the loaded
   * files, resolved once all files are loaded
   */
  public addDocuments(files: File[]): Promise<SourceDocument[]> {
    return new Promise(async (resolve, reject) => {
      if (files && files.length > 0) {
        // First, read all the files into buffers
        const data: ArrayBuffer[] = await Promise.all(
          files.map((file: File) => this.readFile(file))
        );

        // Load all PDF files and wait until all are done
        Promise.all(
          data.map(buffer => PDFDocument.load(buffer, { ignoreEncryption: true }))
        ).then((documents: PDFDocument[]) => {
          const sourceDocuments: SourceDocument[] = documents.map((document: PDFDocument) => new SourceDocument('', document));

          // Good ol' iterator to add the filenames (this was almost a beautiful pure map function, *almost*)
          for (let i = 0; i < sourceDocuments.length; i++) {
            const filePath: string[] = files[i].path.split(new RegExp(/[\\/]/));
            sourceDocuments[i].filename = filePath[filePath.length - 1];
          }

          resolve(sourceDocuments);
        }).catch(err => reject({
          isError: true,
          error: err
        }));
      }
      else {
        reject({
          isError: true,
          error: 'Read 0 files. Input was empty or null.'
        });
      }
    });
  }

  /**
   * Builds a single PDF document from a list of SourceDocument objects, and opens a native file save dialog to save the resulting document
   *
   * @param documents The list of document objects to include, documents will be added in the order they appear on the list
   * @param filename The default file name when saving the PDF document
   *
   * @returns An empty promise that resolves when the operation is complete, or rejects with an error if something goes wrong
   */
  public composeAndSave(sourceDocuments: SourceDocument[], filename: string = ''): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.electron.isElectronApp) {
        reject({
          isError: true,
          error: 'This is not an electron app!'
        });
      }

      this.compose(sourceDocuments).then((composed: PDFDocument) => {
        // Get the document's raw data as a byte array
        composed.save().then((data: Uint8Array) => {
          // Tell Electron to open a native save file dialog, and listen for the response
          this.electron.ipcRenderer.send('save-file', {
            data: data,
            defaultFilename: filename
          });
          this.electron.ipcRenderer.once('save-file-result', (event: any, args: any) => {
            if (args.status == 'success') {
              resolve();
            }
            else if (args.status == 'canceled') {
              reject({
                isError: false,
                reason: 'User canceled the dialog. File was not saved.'
              });
            }
            else if (args.status == 'error') {
              reject({
                isError: true,
                error: args.err
              });
            }
          });
        }).catch(err => reject({
          isError: true,
          error: err
        }));
      }).catch(err => reject({
        isError: true,
        error: err
      }));
    });
  }

  // Internal function, read a blob/file into a buffer
  private readFile(file: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const fileReader: FileReader = new FileReader();
      fileReader.onload = (e) => resolve(fileReader.result as ArrayBuffer);
      fileReader.readAsArrayBuffer(file);
    });
  }

  // Internal function, compose a document from a SourceDocument list
  private compose(sourceDocuments: SourceDocument[]): Promise<PDFDocument> {
    return new Promise((resolve, reject) => {
      PDFDocument.create().then((newDocument: PDFDocument) => {
        // Pack all copy operations into a single promise and wait until all are finished
        Promise.all(sourceDocuments.map((source: SourceDocument) => newDocument.copyPages(source.getDocument(), source.getUsedPageIndices())))
          .then((sources: PDFPage[][]) => {
            // We get an array of the promise results, each one in turn an array of the copied pages
            // Iterate through the results, then through the pages for each result and add them, in order, to our document
            sources.forEach((source: PDFPage[]) => {
              source.forEach((page: PDFPage) => newDocument.addPage(page));
            });
            resolve(newDocument); // Finally, resolve to the newly created document with all pages
          })
          .catch(err => reject(err));
      }).catch(err => reject(err));
    });
  }
}
