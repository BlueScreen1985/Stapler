import { Directive, Output, EventEmitter, HostListener, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[stpDropUploader]'
})
export class DropUploaderDirective {
  @Output() public fileDropped: EventEmitter<File[]> = new EventEmitter();
  @Output() public dragLeave: EventEmitter<any> = new EventEmitter();
  @Input() public baseClass: string = 'drop-uploader--container';

  @HostBinding('class') private class = this.baseClass;

  @HostListener('dragover', ['$event']) onDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    this.class = this.baseClass + ' drop-uploader--container__dropping';
  }

  @HostListener('dragleave', ['$event']) onDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    this.class = this.baseClass;
    this.dragLeave.emit();
  }

  @HostListener('drop', ['$event']) public onDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    this.class = this.baseClass;

    const fileList: FileList = e.dataTransfer.files;
    if (fileList.length > 0) {
      const files: File[] = [];
      for (let i: number = 0; i < fileList.length; i++) {
        files.push(fileList.item(i));
      }

      this.fileDropped.emit(files);
    }
  }
}
