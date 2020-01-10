import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'stp-slide-toggle',
  templateUrl: 'slide-toggle.component.html',
  styleUrls: ['slide-toggle.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SlideToggleComponent),
    multi: true
  }]
})
export class SlideToggleComponent implements ControlValueAccessor {
  private value: boolean = false;
  private onChange: (_: boolean) => void;

  public get toggled(): boolean {
    return this.value;
  }
  public set toggled(value: boolean) {
    this.value = value;
  }

  // Angular ControlValueAccessor methods
  public writeValue(value: boolean) {
    this.value = value;
  }

  public registerOnChange(fn: (_: boolean) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void { }

  // Change handling
  public toggle() {
    this.value = !this.value;
    this.onChange(this.value);
  }
}
