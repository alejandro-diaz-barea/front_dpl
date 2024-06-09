import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Output() searchEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {}

  public searchForm: FormGroup = this.fb.group({
    searcher: ['']
  });

  onSearch(): void {
    const searchTerm = this.searchForm.get('searcher')?.value || '';
    this.searchEvent.emit(searchTerm);
  }
}
