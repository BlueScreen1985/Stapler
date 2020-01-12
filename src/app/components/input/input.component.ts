import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'stp-input',
  templateUrl: 'input.component.html',
  styleUrls: ['input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true
  }]
})
export class InputComponent implements ControlValueAccessor {
  private theValue: string = '';
  private focused: boolean = false;
  private onChange: (_: string) => void;
  private onTouched: () => void;

  @Input() public label: string;
  @Input() public set value(value: string) {
    this.theValue = value;
  }
  @Output() public valueChanged: EventEmitter<string> = new EventEmitter();

  // Internal get/setter for value and focus
  public get inputValue(): string {
    return this.theValue;
  }
  public set inputValue(value: string) {
    this.theValue = value;
  }

  public get isFocused(): boolean {
    return this.focused;
  }
  public set isFocused(value: boolean) {
    this.focused = value;
  }

  // Angular ControlValueAccessor methods
  public writeValue(value: string) {
    this.theValue = value;
  }

  public registerOnChange(fn: (_: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Change handling
  public valueChange(value: string) {
    if (this.onChange) {
      this.onChange(value);
    }
    if (this.onTouched) {
      this.onTouched();
    }
    this.valueChanged.emit(value);
  }
}
