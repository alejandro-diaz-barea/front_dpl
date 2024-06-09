import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent {
  @Output() orderChange: EventEmitter<string> = new EventEmitter<string>();

  onOrderChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.orderChange.emit(value);
  }
}
