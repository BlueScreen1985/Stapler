import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'stp-button',
  templateUrl: 'button.component.html',
  styleUrls: ['button.component.scss']
})
export class ButtonComponent {
  @Input() public color: '' | 'basic' | 'accent' = '';
  @Output() public clicked: EventEmitter<void> = new EventEmitter();

  public click(): void {
    this.clicked.emit();
  }
}
