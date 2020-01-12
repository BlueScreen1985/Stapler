import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface StpSelectOption {
  displayName: string;
  value: any;
}

@Component({
  selector: 'stp-select',
  templateUrl: 'select.component.html',
  styleUrls: ['select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true
  }]
})
export class SelectComponent implements ControlValueAccessor {
  private selectedOption: StpSelectOption;
  private showPanel: boolean = false;
  private onChange: (_: any) => void;
  private onTouched: () => void;

  public get selected(): StpSelectOption {
    return this.selectedOption;
  }

  public get showSelectionPanel(): boolean {
    return this.showPanel;
  }

  @Input() public options: StpSelectOption[];
  @Input() public label: string;
  @Input() public placeholder: string;
  @Output() public valueChanged: EventEmitter<any> = new EventEmitter();

  // Angular ControlValueAccessor methods
  public writeValue(value: any) {
    if (this.options) {
      this.selectedOption = this.options.find((option: StpSelectOption) => option.value === value);
    }
  }

  public registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Value change handler
  public select(option: StpSelectOption): void {
    this.showPanel = false;
    this.selectedOption = option;
    this.valueChanged.emit(option.value);

    if (this.onChange) {
      this.onChange(option.value);
    }
    if (this.onTouched) {
      this.onTouched();
    }
  }

  // Helper fns
  public openPanel(): void {
    this.showPanel = true;
  }

  public closePanel(): void {
    this.showPanel = false;
  }
}
