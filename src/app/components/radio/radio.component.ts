import { Component, forwardRef, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface StpRadioOption {
  label: string;
  value: any;
}

@Component({
  selector: 'stp-radio',
  templateUrl: 'radio.component.html',
  styleUrls: ['radio.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioComponent),
    multi: true
  }]
})
export class RadioComponent implements ControlValueAccessor {
  private selectedOption: StpRadioOption;
  private onChange: (_: any) => void;
  private onTouched: () => void;

  public get selected(): StpRadioOption {
    return this.selectedOption;
  }

  @Input() public options: StpRadioOption[];
  @Input() public disabledOptions: string[];
  @Input() public menuRadio: boolean = false;
  @Output() public valueChanged: EventEmitter<any> = new EventEmitter();

  // Angular ControlValueAccessor methods
  public writeValue(value: any) {
    if (this.options) {
      this.selectedOption = this.options.find((option: StpRadioOption) => option.value === value);
    }
  }

  public registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Value change handler
  public select(option: StpRadioOption): void {
    this.selectedOption = option;
    this.valueChanged.emit(option.value);

    if (this.onChange) {
      this.onChange(option.value);
    }
    if (this.onTouched) {
      this.onTouched();
    }
  }

  public isDisabled(option: StpRadioOption): boolean {
    return this.disabledOptions.includes(option.value);
  }
}
