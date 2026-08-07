import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClickOutsideDirective } from "../../directives/click-outside.directive";
import { IconComponent } from '../../icons/icon.component';
export interface SelectOption {
  label: string;
  value: string;
  icon?: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [ClickOutsideDirective, IconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent {
  isOpen = false;

@Input() options: SelectOption[] = [];
@Input() value = '';

@Output() valueChange = new EventEmitter<string>();

get selectedOption() {
  return this.options.find(o => o.value === this.value)!;
}

select(option: SelectOption) {
  this.value = option.value;
  this.valueChange.emit(option.value);
  this.isOpen = false;
}
}
