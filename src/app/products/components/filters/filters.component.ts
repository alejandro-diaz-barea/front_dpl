import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Category } from '../../interfaces/category.interface';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  categories: Category[] = [];
  searchTerm: string = '';
  selectedCategories: { id: number, name: string }[] = [];
  filteredCategories: Category[] = [];
  searchTermControl: FormControl = new FormControl();

  @Output() closePopup: EventEmitter<void> = new EventEmitter<void>();
  @Output() filterApplied: EventEmitter<number[]> = new EventEmitter<number[]>();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchCategories();
    this.searchTermControl.valueChanges.subscribe(() => this.filterCategories());
  }

  fetchCategories(): void {
    let apiUrl = 'http://127.0.0.1:8000/api/v1/categories';

    if (this.searchTerm) {
      apiUrl += `?query=${this.searchTerm}`;
    }

    this.http.get<any>(apiUrl).subscribe(
      (response: any) => {
        this.categories = response.map((category: any) => ({
          id: category.id,
          categoryname: category.categoryname
        }));
        this.filteredCategories = this.categories;
      },
      (error: any) => {
        console.error('Error fetching categories:', error);
      }
    );
  }


  toggleCategorySelection(category: Category): void {
    const categoryId = category.id;
    const categoryName = category.categoryname;
    const index = this.selectedCategories.findIndex(cat => cat.id === categoryId);
    if (index !== -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push({ id: categoryId, name: categoryName });
    }
  }


  isSelected(categoryId: number): boolean {
    return this.selectedCategories.some(category => category.id === categoryId);
  }



  removeSelectedCategory(selectedCategory: { id: number; name: string; }): void {
    const index = this.selectedCategories.findIndex(cat => cat.id === selectedCategory.id);
    if (index !== -1) {
      this.selectedCategories.splice(index, 1);
    }
  }


  closeFilterPopup(): void {
    this.closePopup.emit();
  }

  filterCategories(): void {
    const searchTerm = this.searchTermControl.value.toLowerCase();
    this.filteredCategories = this.categories.filter(category =>
      category.categoryname.toLowerCase().includes(searchTerm)
    );
  }

  applyFilter(): void {
    const selectedIds = this.selectedCategories.map(category => category.id);
    this.closePopup.emit();
    this.filterApplied.emit(selectedIds);
    console.log('Selected category ids:', selectedIds);
}


}
