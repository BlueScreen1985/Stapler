import { Component, HostListener, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/services/document.service';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'stp-start-page',
  templateUrl: 'start-page.component.html',
  styleUrls: ['start-page.component.scss']
})
export class StartPageComponent implements OnInit {

  public dropUploaderStyle: any = { display: 'none' };

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private theme: ThemeService
  ) { }

  public ngOnInit() {
    // Show the drop uploader when dragging into the window
    window.addEventListener('dragenter', (e: any) => {
      e.preventDefault();
      this.dropUploaderStyle = {};
    });
  }

  public newFile() {
    this.documentService.newProject()
    .then(() => this.router.navigate(['/main']));
  }

  public addFiles(files: File[]) {
    this.documentService.addDocuments(files)
    .then(() => this.router.navigate(['/main']));
  }

  public hideUploader() {
    this.dropUploaderStyle = { display: 'none' };
  }
}
