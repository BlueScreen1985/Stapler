import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'stp-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeaderComponent {

  public get route(): string {
    return this.router.url;
  }

  constructor(
    private router: Router,
    private documentService: DocumentService
  ) { }

  public newFile(): void {
    this.documentService.newProject()
    .then(() => this.router.navigate(['/main']));
  }

  public addFiles(): void {
    this.documentService.addDocuments()
    .then(() => this.router.navigate(['/main']));
  }

  public save(): void {
    this.documentService.composeAndSave()
    .then(() => { /* Do something */ });
  }
}
