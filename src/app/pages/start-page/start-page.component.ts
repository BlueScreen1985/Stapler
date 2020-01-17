import { Component, HostListener, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/services/document.service';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'stp-start-page',
  templateUrl: 'start-page.component.html',
  styleUrls: ['start-page.component.scss']
})
export class StartPageComponent {
  constructor(
    private documentService: DocumentService,
    private router: Router,
    private theme: ThemeService
  ) { }

  public newFile() {
    this.documentService.newProject()
    .then(() => this.router.navigate(['/main']));
  }

  public addFiles(files: File[]) {
    this.documentService.addDocuments(files)
    .then(() => this.router.navigate(['/main']));
  }
}
